/**
 * Created by jonghyeok on 2017-02-03.
 */

/*
[ES5 ? ES6]
Node에서 최근에는 Babel같은 변환 도구를 사용하여 ES6 문법을 사용가능하게지만
우선 ES5 문법(회사에서 쓰니까)부터 연습
*/

//일반적으로 다음과 같은 방법으로 모듈을 호출
//var Module = require('Module Name');  - ES5
//const Module = require('Module Name'); - ES6
var fs = require('fs');

// File System, Console, Debugger 등 많은 기본 내장 객체가 존재
// https://nodejs.org/dist/latest-v6.x/docs/api/fs.html
console.log(typeof fs);
