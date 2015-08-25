define([],function(){
    //  Uint32ArrayToBuffer: (Uint32[],boolean) -> buffer
    return function (buf1,buf2){  
        // min length
        var length = buf1.length > buf2.length ? buf2.length: buf1.length; 
        var i,result='';
        for(i=0; i < length; i++){
            result += String.fromCharCode( (buf1.charCodeAt(i) ^ buf2.charCodeAt(i) ) & 0xFF);
        }
        return result;
    };
});
