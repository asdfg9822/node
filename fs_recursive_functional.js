/**
 * Created by user on 2017. 4. 1..
 */

var fs = require('fs');

var dir = process.argv[2] || './testdir'; //prompt에서 인자로 입력또는 기본값

(function searchDir(dir) {
    fs.readdir(dir, function (err, files) { //callback arg0 : err 인자, arg1 : 파일이름의 리스트
        if (err) {
            throw err;
        }

        //files 는 파일 객체가 아닌 파일 이름이 담긴 배열
        files.forEach(function (file) {
            var path = dir + '\\' + file;

            //path를 클로저변수로 사용
            (function (path) {
                //stat을 통해 해당 file 또는 dir의 상태 정보를 얻을 수 있음
                fs.stat(path, function (err, stats) {
                    console.log((stats.isDirectory() ? "[D]" : "[F]"), path);

                    (stats.isDirectory()) ? searchDir(path): fileProcess(path);  //디렉토리면 반복탐색 파일이면 파일처리
                });
            })(path);
        });

        //파일에 관련된 처리를 진행
        function fileProcess(path) {

        }

    });
})(dir);

function getBaseTmp() {

}

function minin(obj) {

}

//mixin.apply(obj, args)