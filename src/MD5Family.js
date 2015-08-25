define([
    './core',
    './extends',
    './var/toUint32',
    './var/ZEROS',
    './var/Uint32ArrayToBuffer'
],function(InnerHash,classExtends,toUint32,ZEROS,Uint32ArrayToBuffer){

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
   return MD5Family;
});
