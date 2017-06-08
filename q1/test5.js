var test5 = (function () {
    function test5() {
    }
    test5.prototype.func = function () {
        console.log("test1");
    };
    return test5;
}());
var val = new test5();
val.func();
