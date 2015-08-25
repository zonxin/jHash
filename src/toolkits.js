define([
    './globalname',
    './globalArg/global'
],function(jHash,global){
    /*************toolkits******************************/
    var toolkits = (function(){
        // unescape: string -> string
        var unescape = global.unescape || function(string){
            var r1=string.toString();
            var r2=r1.length;
            var R="";
            var k=0;
            while(1){
                if( k >= r2 ) return R; // 标准里写的是 ==  
                var c = r1.charAt(k);
                if( c === "%" ){
                    var subInt4 = r1.substr(k+2,4);
                    var subInt2 = r1.substr(k+1,2);
                    if( k+6 <= r2 && (r1.charAt(k+1) ==="u") && /^[0-9a-fA-F]{4}$/.test(subInt4)){
                        c = String.fromCharCode(parseInt(subInt4,16));
                        k+=5;
                    }else if(k+3 <= r2 && /^[0-9a-fA-F]{2}$/.test(subInt2)){
                        c = String.fromCharCode(parseInt(subInt2,16));
                        k +=2;
                    }
                }
                R += c;
                k++;
            }
        };
        //UCS-2 to UTF-8 : string -> buffer
        function UCS2toUTF8(str){
            return unescape(global.encodeURIComponent(str));
        }
        //UCS-2 to buffer(big endian) : string -> buffer
        function UCS2toBigEndian(str){
            var i,j,len;
            var buf="";
            len = str.length;
            for(i=0; i< len; i++){
                var charCode = str.charCodeAt(i);
                buf += String.fromCharCode(charCode >> 8);
                buf += String.fromCharCode(charCode & 0xFF);
            }
            return buf;
        }    
        //UCS-2 to buffer(little endian) : string -> buffer
        function UCS2toLittleEndian(str){
            var i,j,len;
            var buf="";
            len = str.length;
            for(i=0; i< len; i++){
                var charCode = str.charCodeAt(i);
                buf += String.fromCharCode(charCode & 0xFF);
                buf += String.fromCharCode(charCode >> 8);           
            }
            return buf;
        }
        return {
            UCS2toUTF8        :UCS2toUTF8, 
            UCS2toBigEndian   :UCS2toBigEndian,
            UCS2toLittleEndian:UCS2toLittleEndian
        };
    })();
    jHash.toolkits = toolkits;
   return toolkits;
});
