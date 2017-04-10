/**
 * Created by jonghyeok on 2017-04-05.
 */

/**
 * 모듈
 * */
var _ = require('underscore');
var jsdom = require('jsdom').jsdom;
var window = jsdom().defaultView;
var document = window.document;

//Caching Config Function
var Converter = {};
Converter.Util = require('./util'); //기본 Util
Converter.Config = require('./config'); //Converter 관련 템플릿, 설정 등

/**
 * 상수
 * */
var TYPE = require('./const_type');

(function() {

    var UTIL = {
        //해당 List에서 ID와 일치하는 ViewController 정보를 가져온다
        getViewController: function (extList, srcId) {
            return _.findWhere(extList, {alias:TYPE.VC + "." + srcId});
        },
        //해당 List에서 ID와 일치하는 ViewModel 정보를 가져온다
        getViewModel: function (extList, srcId) {
            return _.findWhere(extList, {alias:TYPE.VM + "." + srcId});
        },
        //getViewModel
        getViewModel: function (extList, srcId) {
            return _.findWhere(extList, {alias:TYPE.VM + "." + srcId});
        },
        //transformView
        transformView: function (tmp, extObj, config) {
            var convertConfig;
            var parentDom = tmp.getElementById('template-zone'); //최상위 엘리먼트 주입
            for(var key in extObj) {
                if(extObj.hasOwnProperty(key) && (convertConfig = config[key])) {
                    var extValue = extObj[key];

                    var result = _.isFunction(convertConfig.value) ? convertConfig.value.call(convertConfig, parentDom, extValue, extObj) : convertConfig.value;
                    if(result) {
                        parentDom = result.parentDom || parentDom;
                    }
                }
            }
            return tmp;
        },
        //transformViewModel
        transformViewModel: function (tmp, extObj, config, xtypeConfig) {
            return tmp;
        },
        //transformViewController
        transformViewController: function (tmp, extObj, config) {
            return tmp;
        },

        /*CaseMap*/
        _caseMap: {},
        _rx: {
            dashToCamel: /-[a-z]/g,
            camelToDash: /([A-Z])/g
        },

        dashToCamelCase: function(dash) {
            return this._caseMap[dash] || (
                    this._caseMap[dash] = dash.indexOf('-') < 0 ? dash : dash.replace(this._rx.dashToCamel,
                            function(m) {
                                return m[1].toUpperCase();
                            }
                        )
                );
        },

        camelToDashCase: function(camel) {
            return this._caseMap[camel] || (
                    this._caseMap[camel] = camel.replace(this._rx.camelToDash, '-$1').toLowerCase()
                );
        }

    };

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = UTIL;
        }
        exports.UTIL = UTIL;
    } else {
        root.UTIL = UTIL;
    }
})();