define([
    './globalname',
    './extends',
    './var/toUint32',
    './var/rotate_left',
    './MD5Family',
    './var/bufferToUint32Array'
],function(jHash,classExtends,toUint32,rotate_left,MD5Family,bufferToUint32Array){
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
   return SHA1;
});
