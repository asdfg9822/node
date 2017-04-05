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
var html_beautify = require("html-beautify");

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
 * Preloader
 */
(function(global) {
    //Ext Custom Define
    global.Ext = {
        define: function (id, props) {
            //Control Property
            props["srcId"] = id;
            props["srcType"] = getSourceType(props.alias);
            props["srcAlias"] = getSourceAlias(props.alias);

            //Input Target Ext.component
            global.extList.push(props);

            //View : widget, VC : ViewController, VM : ViewModel
            function getSourceType(alias) {
                return alias.split(".")[0];
            }

            function getSourceAlias(alias) {
                return alias.split(".")[1];
            }
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
        var path = dir + '\\' + files[i];
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
        var modifiedTmp = transformView(baseTmp, view, Config.viewConfig);
        modifiedTmp = transformViewController(modifiedTmp, vc, Config.vcConfig);
        modifiedTmp = transformViewModel(modifiedTmp, vm, Config.vmConfig);

        //DOM -> String
        var resultText = serializeDocument(baseTmp);
        console.log(resultText);

        //Code Beautify
        //output = html_beautify(resultText);

        //console.log(output);

        //파일 Write
    });

})(global.extList);