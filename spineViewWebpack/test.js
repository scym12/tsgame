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
/*
var arrTest : string[] = [];

arrTest[1] = "abc";
console.log(arrTest[1]);
*/
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
    scmList.prototype.DeleteNode = function (sp) {
        for (var idx in this.arr) {
            if (this.arr[idx] == sp) {
                var ret = this.arr.splice(Number(idx), 1);
                console.log(ret);
                console.log(this.arr);
                break;
            }
        }
    };
    scmList.prototype.LoopNode = function () {
    };
    scmList.prototype.GetNodeList = function () {
        return this.arr;
    };
    return scmList;
}());
var SpriteManager = (function () {
    function SpriteManager() {
        this.arr = {};
    }
    SpriteManager.prototype.AddSprite = function (s, num) {
        if (num == null)
            num = 10;
        if (this.arr[num] == null) {
            var arrSub = new scmList();
            this.arr[num] = arrSub;
            arrSub.AddNode(s);
        }
        else
            this.arr[num].AddNode(s);
        return s;
    };
    SpriteManager.prototype.RemoveSprite = function (s) {
        for (var idx in this.arr) {
            this.arr[idx].DeleteNode(s);
        }
    };
    SpriteManager.prototype.LoopManager = function () {
        for (var idx in this.arr) {
            console.log("===> " + idx);
            console.log(this.arr[idx]);
            for (var idx2 in this.arr[idx].arr) {
                //console.log(this.arr[idx]);
                //console.log(idx + ":" + idx2);
                //this.arr[idx].arr[idx2].func();
            }
        }
    };
    return SpriteManager;
}());
var manager = new SpriteManager();
manager.AddSprite(new Sprite(100), 10);
manager.AddSprite(new Sprite(1120), 77);
manager.AddSprite(new Sprite(150), 5);
manager.AddSprite(new Sprite(120), 7);
manager.AddSprite(new Sprite(15), 15);
var sp = manager.AddSprite(new Sprite(300), 7);
manager.AddSprite(new Sprite(125), 7);
manager.AddSprite(new Sprite(129), 7);
manager.AddSprite(new Sprite(320), 7);
manager.AddSprite(new Sprite(1234), 77);
manager.LoopManager();
console.log("===============");
manager.RemoveSprite(sp);
