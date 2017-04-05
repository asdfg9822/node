/**
 * Created by jonghyeok on 2017-04-05.
 */
(function() {
    var TYPE = {
        VIEW: 'widget',
        VM: 'viewmodel',
        VC: 'controller'
    };

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = TYPE;
        }
        exports.TYPE = TYPE;
    } else {
        root.TYPE = TYPE;
    }
})();