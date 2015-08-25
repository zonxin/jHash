define(['./toUint32'],function(toUint32){
    //  BufferToUint32Array :: (buffer,boolean) -> Uint32[]
    return function (input,isBigEndian)  {
        var i=0;
        var len = input.length;
        var output=[];
        while(i+3 < len){
            var substr = input.substr(i,4);
            if( isBigEndian ) substr = substr.split("").reverse().join("");
            var temp = ((substr.charCodeAt(0) & 0xFF)      ) | 
                       ((substr.charCodeAt(1) & 0xFF) <<  8) |
                       ((substr.charCodeAt(2) & 0xFF) << 16) | 
                       ((substr.charCodeAt(3) & 0xFF) << 24);
            output.push(toUint32(temp));
            i+=4;
        }
        return output;
    };
});
