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

     //   console.log(key + ":" + value);
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
//console.log(result);


/*
 EXT JS
 */
global.Ext = {
    define: function (id, props) {
        console.log(id);
        console.log(props);
    }
};

require('./test/testfile.js');