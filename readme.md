# javascript 哈希算法

支持 md5 sha1 sha256 sha224 HMAC
支持 nodejs require.js sea.js
支持 中文编码/unicode编码( UTF-8,UTF-16, UCS-2 little/big-endian)

使用方法及编译好的代码，参见<https://github.com/zonxin/jHash/tree/gh-pages>

### 编译 jHash

    # 安装 npm git（ 过程略）

    # clone 源码
    git clone https://github.com/zonxin/jHash-project.git

    # 安装 grunt-cli, 可能需要管理员权限
    npm install -g grunt-cli 
    
    #进入源码目录
    cd jHash-project
    # 安装依赖的nodejs模块
    npm install
    # 编译
    grunt
