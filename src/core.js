define([
    './var/bufferToHexString'
],function(bufferToHexString) {
    var InnerHash = (function() {
        function init()        { throw "InnerHash.init should be overriden";      }
        function addPart()     { throw "InnerHash.addPart should be  verriden";   }
        function transform()   { throw "InnerHash.transform should be overriden"; }
        function getDigest()   { throw "InnerHash.getDigest should be overriden"; }
        function getHexDigest(){ return bufferToHexString(this.getDigest()); }
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
