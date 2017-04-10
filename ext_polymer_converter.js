/**
 * Created by jonghyeok on 2017-04-05.
 */

/**
 * 모듈
 */
var fs = require('fs');
var _ = require('underscore');
var jsdom = require('jsdom').jsdom;
var serializeDocument = require("jsdom").serializeDocument;

// Code Beautify 모듈
// var beautify_js = require('js-beautify'); // also available under "js" export
// var beautify_css = require('js-beautify').css;
//var beautify_html = require('html-beautify').html;

/**
 * 상수
 */
var TYPE = require('./const_type');

/**
 * Custom Module
 */
var Converter = {};
Converter.Util = require('./util'); //기본 Util
Converter.Config = require('./config'); //Converter 관련 템플릿, 설정 등
//Converter.Polymer = require('./polymer'); //Polymer 관련 Utii , 아직 없음

/**
 * Global Variable
 */
var dir = "./test";

global.extList = [];
global.jsCnt = 0;

/**
 * preloader
 */
(function(global) {
    //Ext Custom Define
    global.Ext = {
        define: function (id, props) {
            //Control Property
            props["srcId"] = id;
            props["srcType"] = getSourceType(props.alias);
            props["is"] = getPolymerId(id);
            props["isPath"] = getFilePath(id); //default는 es로했음
            props["root"] = true;

            //파일 유형 (em, es, ep)
            if(props.modal) {
                props["isType"] = "ep";
            } else if(props.layout && props.layout.type === "card") {
                props["isType"] = "em";
            } else {
                props["isType"] = "es";
            }

            //initConfig를 이용한 설정일 경우에는 getConfigurator에서 추가한다
            if(_.isFunction(props.initConfig)) {
                props.callParent = function (configArr) {
                    global.extList.push(configArr[0]);
                }
                props.initConfig.call(props);
                return;
            }

            //Input Target Ext.component
            global.extList.push(props);

            //View : widget, VC : ViewController, VM : ViewModel
            function getPolymerId(package) {
                if(!package) return;
                var fileNames = package.split(".");
                var fileName =  fileNames[fileNames.length -1];
                return Converter.Util.camelToDashCase(fileName).slice(1);
            }

            //Package 경로로 FilePath를 가져옴
            function getFilePath(package) {
                if(!package) return;
                var result = package.split(".");
                var moduleName = result[0].toLowerCase();

                var realFilePath = [moduleName];        //Module Name
                realFilePath.push("app");   //app forder
                for(var i=1,len=result.length; i<len-1; i++) {
                    realFilePath.push(result[i]);   //Other Path
                }

                return realFilePath.slice(0, realFilePath.length).join("/");
            }

            //View : widget, VC : ViewController, VM : ViewModel
            function getSourceType(alias) {
                if(!alias) return;
                return alias.split(".")[0];
            }

        },
        create: function () {
            return {};
        },
        String: function () {
            return {
                format: function (data) {
                    return data;
                }
            };
        }
    };
})(global);

Ext.String.format = function (data) {
    return data;
};

/**
 * File Search (Synchronize)
 * 개별 파일별로 작업이 아닌 모든 파일의 Ext Component정보를 하나의 Array에 담고 다루기 위해 동기 방식을 사용
 */
(function searchDir(dir) {
    var files = fs.readdirSync(dir);

    //recursive
    for(var i=0,len=files.length; i<len; i++) {
        var path = dir + '/' + files[i];
        var stats = fs.statSync(path);

        (stats.isDirectory()) ? searchDir(path): fileProcess(path);
    }

    //파일에 관련된 처리를 진행
    function fileProcess(path) {
        var paths = path.split('.');

        console.error((paths[paths.length - 1] === 'js'), path);

        (paths[paths.length - 1] === 'js') ? require(path) : console.log(path, "- This file is not a JS file");
    }
})(dir);

/**
 * 아래 작업 전에 모든 Ext.Component의 정보가 준비되어 있어야 함
 * View를 기준으로 비동기(실행 컨텍스트) 분리
 */
(function(extList) {
    var viewList = _.where(extList, {srcType: TYPE.VIEW});

    //Caching Function
    var Util = Converter.Util;
    var getViewModel = Util.getViewModel;
    var getViewController = Util.getViewController;
    var transformView = Util.transformView;
    var transformViewController = Util.transformViewController;
    var transformViewModel = Util.transformViewModel;

    //Caching Config Function
    var Config = Converter.Config;
    var getPolymerBaseTmp = Config.baseFn.getPolymerBaseTmp;

    viewList.forEach(function(view) {
        //Custom-Alias로 ViewModel, ViewController를 가져옴
        //View, ViewModel, ViewController 한쌍으로 동작
        var vm = getViewModel(extList, view.srcAlias);
        var vc = getViewController(extList, view.srcAlias);

        //불필요하다고 생각되는 부분 제거(임시)
        view = _.omit(view, 'extend', 'requires');
        vm = _.omit(vm, 'extend', 'requires');
        vc = _.omit(vc, 'extend', 'requires');
        console.log(view.srcId);

        //Polymer 기본 템플릿 바탕으로 변환
        var baseTmp = getPolymerBaseTmp();
        var modifiedTmp = transformView(baseTmp, view, Config.viewConfig, Config.viewXtypeConfig);
        modifiedTmp = transformViewController(modifiedTmp, vc, Config.vcConfig);
        modifiedTmp = transformViewModel(modifiedTmp, vm, Config.vmConfig);

        //<body> 밑의 영역만 가져오기

        //Polymer ID 등록 및 태그 변경
        //<template>은 동작이 되지 않아 <template-zone>으로 생성 후 변경

        //DOM -> String
        var resultText = baseTmp.getElementById("template-id-zone").outerHTML;

        //제대로 된 폴리머 템플릿으로 변경 작업
        resultText = resultText.replace(/template-zone/g, 'template');
        resultText = resultText.replace(/template-id-zone/g, view.isType + "-" + view.is);
        resultText = resultText.replace(/ id="template"/g, '');
        resultText = resultText.replace(/<\/template>/g, "\n</template>");

        //Code Beautify
        //beautify_js(js)
        //beautify_css(css)
        //resultText = beautify_html(resultText);

        console.log(resultText);

        //console.log(output);

        //파일 Write
        fs.writeFile('test/' + view.isPath + "/" + view.isType + "-" + view.is + '.html', resultText, 'utf8', function (err) {
            if(err) {
                console.error(err);
            }
        });
    });

})(global.extList);