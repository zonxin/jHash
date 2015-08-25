/*
* Zong Shouxin's hash/encryption algroithm
* support MD5, SHA-1, SHA-256, SHA-224, HMAC, PBKDF2
* support nodejs, require.js and sea.js
* support utf-8, utf-16, usc-2 little endian and usc-2 big endian
*
* Released under the MIT license
* http://mit-license.org/
*/
/************* type define *******************************************************
* buffer: a string which just use the low 8-bits to store bin
* Int32 : a signed 32-bit integer
* Uint32: a unsigned 32-bit integer
*****************************************************************************/
(function (global){
    'use strict' ;
