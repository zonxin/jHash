define(['./toUint32'],function(toUint32){
    return function (x,n)   { return toUint32((x >>> n)|(x << 32-n));};
});
