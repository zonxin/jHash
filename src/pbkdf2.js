define([
    './globalname',
    './var/Uint32ArrayToBuffer',
    './var/bufferXor',
    './var/bufferToHexString'
],function(jHash,Uint32ArrayToBuffer,bufferXor,bufferToHexString){
    // pbkdf2:: (hmacFunction,count,dlen) -> (buffer,buffer,boolean) -> string/buffer
    function pbkdf2(hmac,count,dlen)
    { 
        function F(password,salt,count,num){
            var prf = new hmac(password);
            prf.addPart(salt);
            prf.addPart(Uint32ArrayToBuffer([num],true));
            var u1 = prf.getDigest();
            var result = u1;
            var i;
            for(i=1; i< count; i++){
                prf.reInit(password);
                prf.addPart(u1);
                var u2 = prf.getDigest();
                result = bufferXor(result,u2);
                u1 = u2;
            }
            return result;
        }
        
        return function(password,salt,isBuffer){
            var t1 = F(password,salt,count,1);
            var l = Math.ceil(dlen/t1.length);
            var i;
            for(i=2; i<=l; i++){
                var t2 = F(password,salt,count,i);
                t1 += t2;
            }
            t1 = t1.substr(0,dlen);
            if(isBuffer){
                return t1;
            }
            return bufferToHexString(t1); 
        };
    }
    jHash.pbkdf2 = pbkdf2;
    return pbkdf2;
});
