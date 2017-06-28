var Sprite = (function () {
    function Sprite(val) {
        this.x = 10;
        this.x = val;
    }
    Sprite.prototype.func = function () {
        console.log("x = " + this.x);
    };
    return Sprite;
}());
var arrTest = [];
arrTest[1] = "abc";
console.log(arrTest[1]);
// var arr : [number, Sprite];
// var arr : Sprite[] = {};
// var arrSub: {[keycode: number]: Sprite; } = {};
// mScene: { [keycode: number]: Scene; } = {};
var scmList = (function () {
    function scmList() {
        this.arr = [];
    }
    scmList.prototype.AddNode = function (sp) {
        this.arr.push(sp);
    };
    scmList.prototype.GetNodeList = function () {
        return this.arr;
    };
    return scmList;
}());
var arr = {};
function AddSprite(s, num) {
    if (num == null)
        num = 10;
    if (arr[num] == null) {
        var arrSub = new scmList();
        arr[num] = arrSub;
        arrSub.AddNode(s);
    }
    else
        arr[num].AddNode(s);
}
AddSprite(new Sprite(100), 10);
AddSprite(new Sprite(1120), 77);
AddSprite(new Sprite(150), 5);
AddSprite(new Sprite(120), 7);
AddSprite(new Sprite(15), 15);
AddSprite(new Sprite(300), 7);
AddSprite(new Sprite(1234), 77);
for (var idx in arr) {
    //console.log("===> " +idx);
    //console.log(arr[idx]);
    for (var idx2 in arr[idx].arr) {
        console.log(idx + ":" + idx2);
        arr[idx].arr[idx2].func();
    }
}
