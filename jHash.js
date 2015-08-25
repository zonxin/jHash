/*
* Zong Shouxin's hash/encryption algroithm
* support MD5, SHA-1, SHA-256, SHA-224, HMAC
* support nodejs, require.js and sea.js
* support utf-8, utf-16, usc-2 little endian and usc-2 big endian
*
* Released under the MIT license
* http://mit-license.org/
*/
/************* type define *******************************************************
* buffer: a string which just use the low 8-bits to store bin
* Int32 : a signed 32-bit integer
* Uint32: a unsigned 32-bit integer
*****************************************************************************/
(function (global){
    'use strict' ;

    var jHash = {};

    var InnerHash = (function() {
        function init()      { throw "InnerHash.init should be reload";      }
        function addPart()   { throw "InnerHash.addPart should be reload";   }
        function transform() { throw "InnerHash.transform should be reload"; }
        function getDigest() { throw "InnerHash.getDigest should be reload"; }
        function getHexDigest(){
            var HEXSYM="0123456789abcdef";
            // toHEXString(result)
            var result = this.getDigest();
            var sresult = "";
            var i=0;
            var len = result.length;
            for(i=0;i < len;i++){
                sresult += HEXSYM.charAt((result.charCodeAt(i) >> 4) & 0xF);
                sresult += HEXSYM.charAt((result.charCodeAt(i)     ) & 0xF);
            }          
            return sresult;
        }
        function InnerHash(){}
        InnerHash.prototype.reInit         = init;
        InnerHash.prototype.addPart      = addPart;
        InnerHash.prototype.transform    = transform;
        InnerHash.prototype.getDigest    = getDigest;
        InnerHash.prototype.getHexDigest = getHexDigest;
        return InnerHash;
    })();

    var hasOwnProperty = {}.hasOwnProperty;


    var classExtends = (function() {
        function classExtends(child,parent) {
            var key;
            for( key in parent){
                if(hasOwnProperty.call(parent,key)){
                    child[key] = parent[key];
                }
            }
            function ctor(){this.constructor = child;}
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.SUPER = parent.prototype;
        }
        return classExtends;
    })();

    var toUint32 = function(x) { return x>>>0; };


    var rotate_left = function (x,n)   { return toUint32((x << n)|(x >>> (32-n)));};


    // zeros.length = 64
    var ZEROS = "\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00";


    //  Uint32ArrayToBuffer: (Uint32[],boolean) -> buffer
    var Uint32ArrayToBuffer = function (input,isBigEndian){  
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



    var MD5Family = (function(){
        // addPart:: buffer -> number
        function addPart(str)
        {
            if(this.isEnd) { return null; }
            this.count[0] += str.length*8;  // do not replace by "<<3"
            if(this.count[0] > 0xFFFFFFFF ){  // toUint32(-1) === 0xFFFFFFFF
                this.count[1] += Math.floor(this.count[0] / 0x100000000); // toUint32(-1) + 1
                this.count[1] = toUint32(this.count[1]);
                this.count[0] &= 0xFFFFFFFF;
                this.count[0] = toUint32(this.count[0]);
            }        
            var substring = this.buffer.concat(str);
            var i=0;
            var len = substring.length;
            for(i=0; i+this.block_size <= len; i+=this.block_size){ // block size === 64
                this.state = this.transform(this.state,substring.substr(i,64));
            }  
            this.buffer = substring.substring(i);
            return str.length;
        }
        // getDigest:: () -> buffer
        function getDigest(){
            var PADDING = "\x80" + ZEROS;
            if(this.isEnd){ return Uint32ArrayToBuffer(this.state,this.isBigEndian); } 
            var index = (this.count[0] >> 3) & 0x3F;
            var padlen = (index < 56)?(56-index):(120-index);
            var padstr = PADDING.substr(0,padlen);
            var bits;
            if(this.isBigEndian){
                bits =  Uint32ArrayToBuffer(this.count.reverse(),true);
            }else{
                bits =  Uint32ArrayToBuffer(this.count);
            } 
            this.addPart(padstr);
            this.addPart(bits);
            this.isEnd = true;
            return Uint32ArrayToBuffer(this.state,this.isBigEndian);
        }
        // constructor
        function MD5Family(){ 
            MD5Family.SUPER.constructor.apply(this,arguments);
            this.count = [0,0];
            this.buffer = "";
            this.isEnd = false;
        }
        classExtends(MD5Family,InnerHash);
        MD5Family.prototype.block_size = 64;
        MD5Family.prototype.isBigEndian = false;
        MD5Family.prototype.reInit = function(){return this.constructor.call(this);};
        MD5Family.prototype.addPart = addPart;
        MD5Family.prototype.getDigest = getDigest;
        return MD5Family;
    })();

    //  BufferToUint32Array :: (buffer,boolean) -> Uint32[]
    var bufferToUint32Array = function (input,isBigEndian)  {
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


    /***************** MD5 *******************************/
    var MD5 = (function(){
        function MD5_F(x,y,z)           { return toUint32((x & y) | (~x & z))     ;} 
        function MD5_G(x,y,z)           { return toUint32((x & z) | (y & ~z))     ;} 
        function MD5_H(x,y,z)           { return toUint32( x ^ y ^ z)             ;} 
        function MD5_I(x,y,z)           { return toUint32( y ^ (x | ~z))          ;}
        var md5key = [ 
            0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee,0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
            0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
            0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa,0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
            0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
            0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
            0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05,0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
            0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039,0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
            0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
        ];
        var md5s = [
            7, 12, 17, 22,  7, 12, 17, 22,  7, 12, 17, 22,  7, 12, 17, 22, 
            5,  9, 14, 20,  5,  9, 14, 20,  5,  9, 14, 20,  5,  9, 14, 20,
            4, 11, 16, 23,  4, 11, 16, 23,  4, 11, 16, 23,  4, 11, 16, 23,
            6, 10, 15, 21,  6, 10, 15, 21,  6, 10, 15, 21,  6, 10, 15, 21
        ];
        // MD5Transform : (Uint32[4], buffer) -> Uint32[4]
        function MD5Transform(state,block)  
        {  
            // do not change the value of statue[i]
            var a = state[0], b = state[1], c = state[2], d = state[3];  
            var x = []; 
            x = bufferToUint32Array(block); 
            var temp,g,f,i; 
            for(i = 0; i<64; i++){ 
                if      ( i < 16 ) { g = i;              f = MD5_F(b,c,d); }  // round 1 0~15
                else if ( i < 32 ) { g = (5*i+1) & 0x0F; f = MD5_G(b,c,d); }  // round 2
                else if ( i < 48 ) { g = (3*i+5) & 0x0F; f = MD5_H(b,c,d); }  // round 3
                else               { g = (7*i  ) & 0x0F; f = MD5_I(b,c,d); }  // round 4
                temp = d; d = c; c = b; 
                b = b + rotate_left(a + f + md5key[i] + x[g],md5s[i]); 
                b = toUint32(b);
                a=temp; 
            }
            return [ 
                toUint32(state[0] + a), toUint32(state[1] + b), 
                toUint32(state[2] + c), toUint32(state[3] + d) 
            ];
        } 
        // constructor
        function InnerMD5(){ 
            InnerMD5.SUPER.constructor.apply(this,arguments);
            this.state = [0x67452301,0xEFCDAB89,0x98BADCFE,0x10325476];
        }
        classExtends(InnerMD5,MD5Family);
        InnerMD5.prototype.transform = MD5Transform;
        // md5 : buffer ->　string/object   
        function MD5(str){
            if(!(this instanceof MD5)) {
                var enc = new MD5(); 
                enc.addPart(str);
                return enc.getHexDigest();
            }
            return new InnerMD5();
        }
        return MD5;
    })();
    jHash.md5=MD5;

    var SHA1 = (function(){
        /***************** SHA1 *******************************/
        function SHA1_F(x,y,z)           { return toUint32((x & y) | (~x & z))     ;} 
        function SHA1_H(x,y,z)           { return toUint32( x ^ y ^ z)             ;} 
        function SHA1_J(x,y,z)           { return toUint32( (x&y)| (x&z) | ( y&z ));}
        // SHA1Transform : (Uint32[4],buffer) -> Uint32[4]
        function SHA1Transform(state,block)  
        {  
            // do not change the value of statue[i]
            var a = state[0], b = state[1], c = state[2], d = state[3], e = state[4];
            var x = []; 
            x = bufferToUint32Array(block,true);
            for(var i = 16;i<80; i++){
                x[i] = (x[i-3] ^ x[i-8] ^x[i-14] ^x[i-16]);
                x[i] = rotate_left(x[i],1);
            } 
            var temp,f,k;
            for( i = 0; i< 80; i++){ 
                if      ( i < 20) { f = SHA1_F(b,c,d); k = 0x5A827999; } // 0~19 
                else if ( i < 40) { f = SHA1_H(b,c,d); k = 0x6ED9EBA1; } // 20~39 
                else if ( i < 60) { f = SHA1_J(b,c,d); k = 0x8F1BBCDC; } // 40~59
                else              { f = SHA1_H(b,c,d); k = 0xCA62C1D6; } // 60~79
                f = toUint32(f); 
                temp = rotate_left(a,5) + f + e + k + x[i]; 
                e=d;d = c; c = rotate_left(b,30); b = a; a=toUint32(temp); 
            } 

            return [ 
                toUint32(state[0] + a), toUint32(state[1] + b), 
                toUint32(state[2] + c), toUint32(state[3] + d),
                toUint32(state[4] + e)
            ];
        } 
        // SHA1 constructor ~~~~~
        var InnerSHA1 = function(){
            InnerSHA1.SUPER.constructor.apply(this,arguments);
            this.state=[0x67452301,0xEFCDAB89,0x98BADCFE,0x10325476,0xC3D2E1F0];
        };
        classExtends(InnerSHA1,MD5Family);
        InnerSHA1.prototype.isBigEndian = true;
        InnerSHA1.prototype.transform = SHA1Transform;
        // SHA1 : buffer ->　string/object   
        function SHA1(str){
            if( !(this instanceof SHA1)) {
                var enc = new SHA1(); 
                enc.addPart(str);
                return enc.getHexDigest();
            }
            return new InnerSHA1();
        }
        return SHA1;
    })();
    jHash.sha1 = SHA1;

    var rotate_right = function (x,n)   { return toUint32((x >>> n)|(x << 32-n));};


    var SHA256 = (function(){
         /************* sha256 *******************************/ 
        function CH(e,f,g)          { return toUint32( (e & f) ^ ((~e) & g) ); }
        function MA(a,b,c)          { return toUint32((a&b) ^ (a&c) ^( b&c));  }
        function GAMMA0(x)          { return toUint32(rotate_right(x, 7)^rotate_right(x,18)^(x >>> 3)); }
        function GAMMA1(x)          { return toUint32(rotate_right(x,17)^rotate_right(x,19)^(x >>> 10)); }
        function SIGMA0(a)          { return toUint32(rotate_right(a,2)^rotate_right(a,13)^rotate_right(a,22)); }
        function SIGMA1(a)          { return toUint32(rotate_right(a,6)^rotate_right(a,11)^rotate_right(a,25));}
        var sha256key= [  
            0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
            0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
            0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
            0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
            0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
            0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
            0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
            0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
            0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
            0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
            0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
        ];
        function SHA256Transform(state,block)
        {
            var a = state[0], b = state[1], c = state[2], d = state[3], 
                e = state[4], f = state[5], g = state[6], h = state[7];
            var x = []; 
            x = bufferToUint32Array(block,true);
            for(var i = 16;i<64; i++){
                var s0 = GAMMA0(x[i-15]);
                var s1 = GAMMA1(x[i- 2]);
                x[i] = toUint32(x[i-16] + s0 + x[i-7] +s1);
            } 
            for( i=0; i<64 ; i++){
                var S1 = SIGMA1(e);
                var ch = CH(e,f,g);
                var temp1 = h + S1 + ch + sha256key[i] + x[i];
                var S0 = SIGMA0(a);
                var maj = MA(a,b,c);
                var temp2 = S0+maj;
                h = g; g = f; f = e; e = toUint32(d+temp1);
                d = c; c = b; b = a; a = toUint32(temp1+temp2);
            }
            return [
                toUint32(state[0] + a), toUint32(state[1] + b), 
                toUint32(state[2] + c), toUint32(state[3] + d),
                toUint32(state[4] + e), toUint32(state[5] + f),
                toUint32(state[6] + g), toUint32(state[7] + h)
            ];
        }
        
        function InnerSHA256() {
            InnerSHA256.SUPER.constructor.apply(this,arguments);
            this.state = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,
                          0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
        }
        classExtends(InnerSHA256,MD5Family);
        InnerSHA256.prototype.isBigEndian = true;
        InnerSHA256.prototype.transform = SHA256Transform;
        function SHA256(str) {
            if( !(this instanceof SHA256)) {
                var enc = new SHA256(); 
                enc.addPart(str);
                return enc.getHexDigest();
            }
            return new InnerSHA256();    
        }
        return SHA256;
    })();
    jHash.sha256 = SHA256;

    // same as SHA256, except: initial state, output is constructed by ommit state[7]
    var SHA224 = (function(){
        var InnerSHA256 = (new SHA256()).constructor;
        function InnerSHA224(){
            InnerSHA224.SUPER.constructor.apply(this,arguments);
            this.state = [ 0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939, 
                           0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4 ];
        }
        classExtends(InnerSHA224,InnerSHA256);
        InnerSHA224.prototype.getDigest = function() { 
            return InnerSHA224.SUPER.getDigest.call(this).substring(0,28);
        };
        function SHA224(str){
            if( !(this instanceof SHA224)) {
                var enc = new SHA224(); 
                enc.addPart(str);
                return enc.getHexDigest();
            }
            return new InnerSHA224();
        }
        return SHA224;
    })();
    jHash.sha224 = SHA224;

    var hmac = function (hash) { 
        var block_size = (new hash()).block_size;
        function getDigest(){
            var digest = this.innerHash.getDigest();
            console.log(digest.length);
            this.outHash.addPart(digest);
            return this.outHash.getDigest();
        }

        function InnerHMAC(key)
        {
            if(key.length > block_size) { 
                var t =  new hash();
                t.addPart(key);
                key = t.getDigest();
            }
            key += ZEROS.substr(0,hash.block_size - key.length);
            var i;
            var o_key_pad="",i_key_pad="";
            for(i=0; i<block_size; i++){
                o_key_pad += String.fromCharCode(key.charCodeAt(i) ^ 0x5c);
                i_key_pad += String.fromCharCode(key.charCodeAt(i) ^ 0x36);
            }
            this.outHash = new hash();
            this.outHash.addPart(o_key_pad);

            this.innerHash = new hash();
            this.innerHash.addPart(i_key_pad);
        }
        classExtends(InnerHMAC,InnerHash);
        InnerHMAC.prototype.reInit = function (){ InnerHMAC.apply(this,arguments); };
        InnerHMAC.prototype.addPart = function (str){ 
            return this.innerHash.addPart(str);
        };
        InnerHMAC.prototype.getDigest = getDigest;

        var HMAC = function(key,str){
            if(!(this instanceof HMAC)){
                var h = new InnerHMAC(key);
                h.addPart(str);
                return h.getHexDigest();
            }
            return new InnerHMAC(key);
        };
        return HMAC;
    };
    jHash.hmac = hmac;



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

})(typeof window !== "undefined" ? window : global);