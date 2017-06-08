"use strict";
exports.__esModule = true;
var test2_1 = require("./test2");
var test2 = (function () {
    function test2() {
    }
    test2.prototype.func = function () {
        var a = new test2_1.test1();
        a.func();
        console.log("test1");
    };
    return test2;
}());
exports.test2 = test2;
var val = new test2();
val.func();
