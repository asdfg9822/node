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
// var beautify_html = require('js-beautify').html;

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
            props["srcAlias"] = getSourceAlias(props.alias);
            props["root"] = true;

            //initConfig를 이용한 설정일 경우에는 getConfigurator에서 추가한다
            if(_.isFunction(props.initConfig)) {
                props.initConfig.call(global.Ext, props);
                return;
            }

            //Input Target Ext.component
            global.extList.push(props);

            //View : widget, VC : ViewController, VM : ViewModel
            function getSourceType(alias) {
                return alias.split(".")[0];
            }

            function getSourceAlias(alias) {
                return alias.split(".")[1];
            }
        },
        getConfigurator: function () {
            return {
                merge: function(me, config, props) {
                    for(var key in config) {
                        if(config.hasOwnProperty(key)) {
                            props[key] = config[key];
                        }
                    }
                    global.extList.push(props);
                }
            }
        },
        create: function () {
            return {};
        },
        callParent: function (configArr) {

        }
    };
})(global);

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

        (paths[paths.length - 1] === 'js') ? require(path): console.log(path, "- This file is not a JS file");
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
        var resultText = serializeDocument(baseTmp);
        console.log(resultText);

        //Code Beautify
        //beautify_js(js)
        //beautify_css(css)
        //beautify_html(html)

        //console.log(output);

        //파일 Write
    });

})(global.extList);