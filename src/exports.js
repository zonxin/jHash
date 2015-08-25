
 /************* exports ******************************/
    if ( typeof module === "object" && typeof module.exports === "object" ) { // nodejs
        module.exports = jHash;
    } else if ( typeof define === "function" && define.amd ) { // AMD, requiejs
        define( function() {return jHash;} );
    } else if ( typeof define === "function" && define.cmd){ // CMD, seajs
        define( function() {return jHash;} );
    }else {
        var old_jHash=global.jHash;
        jHash.noConflict = function() {global.jHash = old_jHash; return jHash;};
        global.jHash = jHash;
    }
