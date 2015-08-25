# javascript 哈希算法

支持 md5 sha1 sha256 sha244 HMAC
支持 nodejs require.js sea.js模块
支持 中文编码/unicode编码( UTF-8,UTF-16, UCS-2 little/big-endian)

### 示例

    <!doctype html>
    <html>
        <head>
            <meta charset="utf-8" />
            <script src="path/to/jHash.js"></script>
        </head>
        <body>
            <script> 
            //基本用法
            var hash = jHash.md5("abc");
            // hash === "900150983cd24fb0d6963f7d28e17f72";

            //创建 对象
            var md5obj = new jHash.md5();
            md5obj.addPart("ab"); md5obj.addPart("c");
            var hash2 = md5obj.getHexDigest();
            // hash2 === "900150983cd24fb0d6963f7d28e17f72";

            // 中文支持
            // UTF-8编码
            var hash3 = jHash.md5(jHash.toolkits.UCS2toUTF8("中文"));
            //var hash3 = "a7bac2239fcdcb3a067903d8077c4a07";
            // USC-2 big endian
            var hash4 = jHash.md5(jHash.toolkits.UCS2toBigEndian("中文"));
            //var hash4 = "cf95ffbc73eb73e8ed0655d79bdad662";
            // USC-2 little endian
            var hash5 = jHash.md5(jHash.toolkits.UCS2toLittleEndian("中文"));
            //var hash5 = "73c6c8cd2f94355ef015e5265d5e65b1";



            // =============== SHA1 =================================
            var hash = jHash.sha1("abc");
            // hash === "a9993e364706816aba3e25717850c26c9cd0d89d";

            var sha1obj = new jHash.sha1();
            sha1obj.addPart("ab"); sha1obj.addPart("c");
            var hash2 = sha1obj.getHexDigest();
            // hash2 === "a9993e364706816aba3e25717850c26c9cd0d89d";

            var hash3 = jHash.sha1(jHash.toolkits.UCS2toUTF8("中文"));
            //hash3 === "7be2d2d20c106eee0836c9bc2b939890a78e8fb3";
            var hash4 = jHash.sha1(jHash.toolkits.UCS2toBigEndian("中文"));
            //hash4 === "dcf9d6585e2d08015ee54e26c244a0fdff6a17c9";
            var hash5 = jHash.sha1(jHash.toolkits.UCS2toLittleEndian("中文"));
            //hash5 === "a09ea1fd5d2f2e552370159ff451f054d7574c47";

            // ================ HMAC ================
            var hmac_md5 = jHash.hmac(jHash.md5);
            hash5 = hmac_md5("key","abc");
            // :: OR ::
            var obj = new hmac_md5("key");
            obj.addPart("abc");
            hash5 = obj.getHexDigest();
            // hash5 === "d2fe98063f876b03193afb49b4979591"

            // =================== SHA256  SHA244============================
            // same as md5 and sha1 except function name is sha256 and sha244
            </script>
        </body>
    </html>

### nodejs

    var sha1 = require("path/to/jHash.js");

### requiejs
    
    requirejs(["path/to/jHash"],function (jHash){
        //to do with jHash function
    });

### sea.js

    seajs.use(["path/to/jHash"],function (jHash){
        //to do with jHash function
    });
