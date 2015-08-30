define([
    './core',
    './extends',
    './var/toUint32',
    './var/ZEROS',
    './var/Uint32ArrayToBuffer',
    './Uint'
],function(InnerHash,classExtends,toUint32,ZEROS,Uint32ArrayToBuffer,Uint){

    var MD5Family = (function(){
        // addPart:: buffer -> Object
        function addPart(str)
        {
            if(this.isEnd) { return null; }
            var bitlen= str.length*8;  // do not replace by "<<3"
            if(bitlen < 0x100000000){
                this.count.add(bitlen);
            }else{
                this.count.add([toUint32(bitlen),Math.floor(bitlen/0x100000000)]);
            }
            var substring = this.buffer.concat(str),
                i=0,
                len = substring.length;
            for(i=0; i+this.block_size <= len; i+=this.block_size){ // block size === 64
                this.state = this.transform(this.state,substring.substr(i,64));
            }  
            this.buffer = substring.substring(i);
            return this;
        }
        // getDigest:: () -> buffer
        function getDigest(){
            var PADDING = "\x80" + ZEROS;
            if(this.isEnd){ return Uint32ArrayToBuffer(this.state,this.isBigEndian); } 
            var index = (this.count[0] >> 3) & 0x3F,
                padlen = (index < 56)?(56-index):(120-index),
                padstr = PADDING.substr(0,padlen),
                bits;
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
            this.count = new Uint(64);
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
   return MD5Family;
});
