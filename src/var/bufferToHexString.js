define([],function(){
    return function(buffer){
        var HEXSYM = "0123456789abcdef";
        var i,sresult = "";
        for(i=0; i<buffer.length; i++){
            sresult += HEXSYM.charAt( (buffer.charCodeAt(i) >> 4) & 0xF );
            sresult += HEXSYM.charAt( (buffer.charCodeAt(i)     ) & 0xF );
        }
        return sresult;
    };
});
