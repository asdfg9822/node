/**
 * Created by jonghyeok on 2017-04-05.
 */
(function() {
    var BIND = {
        ORIGIN: 'origin',   //기존에 있던 값(Ext JS소스내에 있는)
        BIND: 'bind',    //바인딩 된 값
        APPOINT: 'appoint'  //지정된 값
    };

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = BIND;
        }
        exports.BIND = BIND;
    } else {
        root.BIND = BIND;
    }
})();