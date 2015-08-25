define(function() {
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
    return InnerHash;
});
