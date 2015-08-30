define([
    './var/toUint32',
    './extends'
],function(toUint32,classExtends){
    // Unsigned int
    var Uint = (function (){ 
        // constructor:: number -> Object
        // constructor:: array -> Object
        function innerUint(ar){
            var len =  ar.length, i;
            for(i=0; i<len; i++){ this[i] = toUint32(ar[i]) || 0; }
            this.length = len;
        }
        classExtends(innerUint,Array);
        function add(num){
            if(!(num instanceof Array)) { return this.add([num]); }
            var len = Math.min(num.length,this.length),
                i;
            for(i=0; i<len; i++){
                this[i] += num[i];
            }
            len = this.length;
            for(i=0; i<len; i++){
                if(this[i] > 0xFFFFFFFF) {
                    this[i] -= 0x100000000;
                    if(i+1< len) { this[i+1]++; }
                }
            }
        }
        innerUint.prototype.add = add;
        function Uint(bits){ 
            var arr;
            if(!(bits instanceof Array)){
                var len = bits || 64;
                arr = new Array(Math.ceil(len/32));
            }else{
                arr = bits;
            }
            return new innerUint(arr);
        }
        return Uint; 
    })();
    return Uint;
});
