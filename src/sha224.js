define([
    './globalname',
    './extends',
    './sha256'
],function(jHash,classExtends,SHA256){
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
    return SHA224;
});
