/**
 * Created by jonghyeok on 2017-04-05.
 */

/**
 * 모듈
 * */
var jsdom = require('jsdom').jsdom;
var fs = require('fs');

/**
 * 상수
 * */
var BIND = require('./const_binding');

/**
 * 전역 변수
 * */
global.document = jsdom('helloworld');
global.window = document.defaultView;

(function() {
    //외부에 제공하는 함수
    var Config = {};

    var baseFn = Config.baseFn = {
        //DOM 형식의 Polymer 기본 템플릿을 반환
        getPolymerBaseTmp: function () {
            var templateString = fs.readFileSync('./polymer_base_tmp.html', 'utf-8');
            return jsdom(templateString);
        },
    };

    //내부에서 사용하는 함수
    var innerFn = {

    };

    //ViewModel Config
    var vmConfig = Config.vmConfig = {

    };

    //ViewController Config
    var vcConfig = Config.vcConfig = {

    };

    //View Config
    var viewConfig = Config.viewConfig = {
        title: {
            type: 'tag',
            tagName: 'cc-page-title-bar',
            attrs: [
                {"name": 'page-title', "value": BIND.ORIGIN}
            ]
        }
    };

    //Common Config
    var commonConfig = Config.commonConfig = {

    };

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = Config;
        }
        exports.UTIL = Config;
    } else {
        root.UTIL = Config;
    }
})();