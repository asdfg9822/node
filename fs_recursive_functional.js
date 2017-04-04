/**
 * Created by user on 2017. 4. 1..
 */

var fs = require('fs');
var vm = require('vm');
var _ = require('underscore')

var UTIL = {
    emptyString: function() {
        return '';
    }
};

function getBaseTmp() {

}

function convertView(condition, target) {

}

function convertViewContoller() {

}

function convertViewModel() {

}

/*
View
*/

/*
ViewController
*/
function convertFormula(baseObj, formula) {
    if(formula) {

    }
}

/*
ViewModel
*/


/*
Object to Source Code
*/
function Obj2Source(obj) {
    if(!_.isObject(obj)) {
        //console.error(obj);
      //  console.error("Above Data Type is not Object");
        return;
    }

    var source = JSON.stringify(obj);
    //console.log(source);

    source.replace('')

    // function removeQuote
}

function objToString (obj, defaultString) {
    return _.reduce(obj, function (source, curr, key) {

        var value = !_.isFunction(curr) && _.isObject(curr) ? objToString(curr, source) : curr;

            //console.log(key + ":" + value);
        return source;

    }, defaultString);
}


var result = objToString({1:'2', 2:function() {
    return this;
}, obj: { obj2: {}}});

//console.log(result)



/*
Style
*/
function addClass(target, className) {

}

/*
String
*/
function removeTransformGenerator() {
    var startRegex = /^#\{(.*)\}$/;
    return function(str) {
        if(typeof str === 'string') {
            return str.replace(startRegex, '$1');
        }
        return str;
    }
}

var rmTransformChar = removeTransformGenerator();
var result = rmTransformChar('#{okok}');

var TYPE = {
    VIEW: 'View',
    VM: 'ViewModel',
    VC: 'ViewController'
};

function getSourceType(id) {
    var result = id.match(/(View[A-Za-z]*)$/g);
    result = result ? result[0] : TYPE.VIEW;

    for(var t in TYPE) {
        if(TYPE.hasOwnProperty(t) && TYPE[t] === result) {
            return TYPE[t];
        }
    }

    return TYPE.VIEW;
}

/*
 EXT JS Parse
 */
(function(global) {
    global.Ext = {
        define: function (id, props) {
            var result = getSourceType(id);
            console.log("Target ID : ", id);
            console.log("Target TYPE : ", result);

            //console.log(props.data);

            //TODO 모든 define된 객체를 배열 또는 VM, View, VC각각의 배열로 관리
            //TODO 또는 controller / viewmodel / widget 의 prefix로 구분 가능
        }
    };
})(this.window || global); //browser || node

require('./test/testfile.js');


/*
config의 설정된 prop과 비교해서 있으면 그 안의 데이터를 넣어 줌
일치된 prop은 객체에서 제거하고 다른 값을 검사
*/
var config = {
    View: {
        data: {
            name: 'properties',
            value: function(data) {
                var properties = {};
                for(var key in data) {
                    if(data.hasOwnProperty(key)) {
                        properties[key] = {
                            type: Object,
                            value: function () {
                                return data[key];
                            }
                        }
                    }
                }

                return properties;
            }
        },

        formulas: {
            name: 'formulas',
            value: function (data) {
                // var formulas = {};
                //
                // if(data.bind) {
                //
                //     data = _.omit('bind');
                // }
                // if(data.get) {
                //
                //     data = _.omit('get');
                // }
                //
                // for(var key in data) {
                //     if (data.hasOwnProperty(key)) {
                //
                //     }
                // }
                //
                // return formulas;

                //TODO get, bind 조합하여 사용되는 것 변경
                //TODO bind -> get에서 사용될 데이터 바인딩
                //TODO get -> 바인딩된 데이터 정보를 넘겨줘서 작업

                return data;
            }
        }
    },
    ViewModel: {

    },
    ViewController: {

    }
}


// function convertToText(obj) {
//     //create an array that will later be joined into a string.
//     var string = [];
//
//     //is object
//     //    Both arrays and objects seem to return "object"
//     //    when typeof(obj) is applied to them. So instead
//     //    I am checking to see if they have the property
//     //    join, which normal objects don't have but
//     //    arrays do.
//     if (typeof(obj) == "object" && (obj.join == undefined)) {
//         string.push("{");
//         for (prop in obj) {
//             string.push(prop, ": ", convertToText(obj[prop]), ",");
//         };
//         string.push("}");
//
//         //is array
//     } else if (typeof(obj) == "object" && !(obj.join == undefined)) {
//         string.push("[")
//         for(prop in obj) {
//             string.push(convertToText(obj[prop]), ",");
//         }
//         string.push("]")
//
//         //is function
//     } else if (typeof(obj) == "function") {
//         string.push(obj.toString())
//
//         //all other values can be done with JSON.stringify
//     } else {
//         string.push(JSON.stringify(obj))
//     }
//
//     return string.join("")
// }
//
// var result = convertToText(config);
// console.log(result);


/*

TODO

1. 모든 파일 Import
2. 파일 Import값 배열로 관리
3. 특정 Key값으로 데이터를 가져오기
4. xtype을 sc-link로 변환 & HTML추가할 방법 고민 & event등록

다른건 몰라도 View, Grid형태만이라도

*/