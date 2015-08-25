define([],function(){
    //  Uint32ArrayToBuffer: (Uint32[],boolean) -> buffer
    return function (input,isBigEndian){  
        var i=0;
        var len = input.length;
        var output = "", temp = "";
        while(i < len) 
        {  
            temp = "";
            temp += String.fromCharCode((input[i]      ) & 0xFF);    
            temp += String.fromCharCode((input[i] >>  8) & 0xFF);  
            temp += String.fromCharCode((input[i] >> 16) & 0xFF);  
            temp += String.fromCharCode((input[i] >> 24) & 0xFF);  
            if(isBigEndian){ temp = temp.split("").reverse().join(""); }
            output += temp;
            i++;  
        }
        return output;
    };
});
