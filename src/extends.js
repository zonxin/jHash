define([
    './var/hasOwnProperty'
],function(hasOwnProperty){
    var classExtends = (function() {
        function classExtends(child,parent) {
            var key;
            for( key in parent){
                if(hasOwnProperty.call(parent,key)){
                    child[key] = parent[key];
                }
            }
            function ctor(){this.constructor = child;}
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.SUPER = parent.prototype;
        }
        return classExtends;
    })();
    return classExtends;
});

