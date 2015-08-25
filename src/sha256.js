define([
    './globalname',
    './extends',
    './var/toUint32',
    './var/rotate_right',
    './MD5Family',
    './var/bufferToUint32Array'
],function(jHash,classExtends,toUint32,rotate_right,MD5Family,bufferToUint32Array){
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
   return SHA256;
});
