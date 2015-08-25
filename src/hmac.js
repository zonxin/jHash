define([
    './globalname',
    './extends',
    './core',
    './var/ZEROS'
],function(jHash,classExtends,InnerHash,ZEROS){
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
});
