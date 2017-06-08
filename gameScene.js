/*
import { Point, SNode } from "./scmNode";
import { Sprite } from "./scmSprite";
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
//////////////////////////////////////////////////////////////////////
var Point = (function () {
    function Point() {
        this.nx = 0;
        this.ny = 0;
    }
    return Point;
}());
var SNode = (function () {
    function SNode() {
        this.loc = new Point();
    }
    SNode.prototype.getX = function () { return this.loc.nx; };
    SNode.prototype.getY = function () { return this.loc.ny; };
    SNode.prototype.setNumber = function (num) {
        this.unique = num;
    };
    return SNode;
}());
//////////////////////////////////////////////////////////////////////
var Sprite = (function (_super) {
    __extends(Sprite, _super);
    function Sprite() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.parent = null;
        _this.img = null;
        return _this;
    }
    Sprite.prototype.setParent = function (p) { this.parent = p; };
    Sprite.prototype.loadImage = function (name) {
        //console.log("sprite loadImage");
        this.img = new Image();
        this.img.onload = function () {
        };
        this.img.src = name.toString();
    };
    Sprite.prototype.setLocation = function (x, y) {
        this.loc.nx = x;
        this.loc.ny = y;
    };
    Sprite.prototype.OnUpdate = function (ctx, tm) {
        // console.log("sprite onupdate" + ctx)
        if (ctx && this.img) {
            var x = this.getX() + (this.parent && this.parent.node.getX() || 0);
            var y = this.getY() + (this.parent && this.parent.node.getY() || 0);
            ctx.drawImage(this.img, x, y);
        }
    };
    Sprite.prototype.mouseDown = function (event) {
        var x = event.x;
        var y = event.y;
        console.log("Sprite down : " + x + ":" + y);
    };
    Sprite.prototype.mouseUp = function (event) {
        var x = event.x;
        var y = event.y;
        console.log("Sprite Up : " + x + ":" + y);
    };
    return Sprite;
}(SNode));
/////////////////////////////////////////////////////////////////////////////
var Stage = (function () {
    function Stage() {
        this.mNum = 0;
        this.mScene = {};
        /////////////////////////////////////////////////////
        this.OnUpdate = function OnUpdate(tm) {
            //console.log("stage onupdate  " + tm + " " + typeof(tm));
            if (this.canvas) {
                this.ctx.fillStyle = "black";
                this.ctx.fillRect(0, 0, 1280, 720);
                var av = this;
                requestAnimationFrame(function (tm) { av.OnUpdate(tm); });
                for (var key in this.mScene) {
                    var scene = this.mScene[key];
                    scene.OnUpdate(this.ctx, tm);
                }
            }
        };
        this.OnUpdate(0);
    }
    Stage.prototype.setCanvas = function (canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
    };
    Stage.prototype.AddScene = function (scene) {
        this.mNum = this.mNum + 1;
        scene.setNumber(this.mNum);
        this.mScene[this.mNum] = scene;
        scene.setParent(this);
    };
    Stage.prototype.RemoveScene = function () {
    };
    /////////// Mouse Event ////////////////////////////
    Stage.prototype.mouseDown = function (event) {
        for (var key in this.mScene) {
            this.mScene[key].mouseDown(event);
        }
    };
    Stage.prototype.mouseUp = function (event) {
        for (var key in this.mScene) {
            this.mScene[key].mouseUp(event);
        }
    };
    return Stage;
}());
var Scene = (function () {
    function Scene() {
        this.parent = null;
        this.mSprite = {};
        this.mNum = 0;
        this.node = new SNode();
    }
    Scene.prototype.setParent = function (p) { this.parent = p; };
    Scene.prototype.setNumber = function (num) {
        this.node.setNumber(num);
    };
    Scene.prototype.AddSprite = function (sprite) {
        this.mNum = this.mNum + 1;
        sprite.setNumber(this.mNum);
        this.mSprite[this.mNum] = sprite;
        sprite.setParent(this);
    };
    Scene.prototype.RemoveSprite = function (num) {
        this.mSprite[num] = null;
    };
    // 숫자는 몇까지 되는가? 오버플로우되면? 해결책은? 
    // Number는 왜 계산이 안되는건가? (계산도 안되는 숫자타입을 만든이유는 무엇인가?)
    // var a = 10; 
    // var b : Number = 10;
    // 둘의 차이점은 ? 
    Scene.prototype.OnUpdate = function (ctx, tm) {
        //console.log("scene update"+ ctx);
        for (var key in this.mSprite) {
            var sprite = this.mSprite[key];
            sprite.OnUpdate(ctx, tm);
        }
    };
    Scene.prototype.mouseDown = function (event) {
        for (var key in this.mSprite) {
            this.mSprite[key].mouseDown(event);
        }
    };
    Scene.prototype.mouseUp = function (event) {
        for (var key in this.mSprite) {
            this.mSprite[key].mouseUp(event);
        }
    };
    return Scene;
}());
/////////////////////////////////////////////////////////////////////////////
var scmButton = (function (_super) {
    __extends(scmButton, _super);
    function scmButton() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.btnState = 0;
        return _this;
    }
    scmButton.prototype.loadImage = function (name) {
        //console.log("scmbutton loadimage");
        _super.prototype.loadImage.call(this, name);
        this.imgUp = this.img;
    };
    scmButton.prototype.mouseDown = function (event) {
        if (this.img && event.x > this.getX() && event.x < (this.getX() + this.img.width)
            && event.y > this.getY() && event.y < (this.getY() + this.img.height))
            this.btnState = 1;
        if (this.imgDown && this.btnState == 1)
            this.img = this.imgDown;
    };
    scmButton.prototype.mouseUp = function (event) {
        if (this.img && event.x > this.getX() && event.x < (this.getX() + this.img.width)
            && event.y > this.getY() && event.y < (this.getY() + this.img.height)) {
            this.OnClick();
        }
        if (this.imgUp && this.btnState == 1) {
            this.btnState = 0;
            this.img = this.imgUp;
        }
    };
    scmButton.prototype.setImageD = function (img) {
        this.imgDown = new Image();
        this.imgDown.onload = function () { };
        this.imgDown.src = img.toString();
    };
    scmButton.prototype.OnClick = function () {
        console.log("Good");
    };
    return scmButton;
}(Sprite));
/////////////////////////////////////////////////////////////////////////////
var exSprite = (function (_super) {
    __extends(exSprite, _super);
    function exSprite() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.speed = 80;
        _this.state = 0; // Idle, walk, run, attack 
        _this.idleIndex = 0;
        _this.idleArrow = 1;
        return _this;
    }
    exSprite.prototype.setSpeed = function (sp) { this.speed = sp; };
    exSprite.prototype.setIdle = function (arr) {
        this.tm = 0;
        this.idleArrow = 1;
        this.idle = new Array(arr.length);
        for (var i = 0; i < arr.length; i++) {
            //console.log("arr " + i + " : " + arr[i]);
            this.idle[i] = new Image();
            this.idle[i].onload = function () { };
            this.idle[i].src = arr[i].toString();
        }
        //console.log(this.idle);
        this.idleIndex = 0;
    };
    exSprite.prototype.IdleProcess = function (tm) {
        if ((this.idleIndex + 1) >= this.idle.length) {
            this.idleArrow = -1;
        }
        if (this.idleIndex <= 0)
            this.idleArrow = 1;
        this.img = this.idle[this.idleIndex];
        var diff = tm - this.tm;
        if (diff > this.speed) {
            this.tm = tm;
            this.idleIndex = this.idleIndex + this.idleArrow;
        }
    };
    exSprite.prototype.WalkProcess = function (tm) {
    };
    exSprite.prototype.RunProcess = function (tm) {
    };
    exSprite.prototype.AttackProcess = function (tm) {
    };
    exSprite.prototype.OnUpdate = function (ctx, tm) {
        // IDLE
        this.IdleProcess(tm);
        _super.prototype.OnUpdate.call(this, ctx, tm);
    };
    exSprite.prototype.mouseDown = function (event) {
    };
    exSprite.prototype.mouseUp = function (event) {
    };
    return exSprite;
}(Sprite));
var stage = new Stage();
window.onload = function () {
    var canvas;
    canvas = document.getElementById('cnvs');
    stage.setCanvas(canvas);
    stage.OnUpdate(0);
    canvas.addEventListener("mousedown", function (event) { stage.mouseDown(event); }, false);
    canvas.addEventListener("mouseup", function (event) { stage.mouseUp(event); }, false);
};
function Init() {
    var scene = new Scene();
    stage.AddScene(scene);
    var sprite = new exSprite();
    sprite.loadImage("./images/ship.png");
    scene.AddSprite(sprite);
    sprite.setLocation(50, 50);
    var arr = new Array(10);
    for (var i = 0; i < 9; i++)
        arr[i] = "./images/BlueKnight_entity_000_Idle_00" + (i + 1) + ".png";
    arr[9] = "./images/BlueKnight_entity_000_Idle_010.png";
    sprite.setIdle(arr);
    var btn = new scmButton();
    btn.loadImage("./images/btnN.png");
    btn.setImageD("./images/btnD.png");
    scene.AddSprite(btn);
    btn.setLocation(250, 50);
}
Init();
// 아래는 질문이 완료되면 지울것 
//////////////////////////////////////////////////////////////////
/*
let : for() 문을 벗어나면 사라지는 변수
var : for() 문을 벗어나도 변수값이 존재함

function theDifference(){
    for(let emre = 0; emre < 10; emre++){
    // emre is only visible inside of this for()
    }
    console.log(emre);
// emre is NOT visible here.
}

function theDifference2(){
    for(var emre = 0; emre < 10; emre++){
    // emre is visible inside of this for()
    }
    console.log(emre);
// emre is visible here too.

}
*/
//////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
// typescript는 Map없나?
//let my = new Map();
//my.set('a',1);
//my.set('b',2);
//let ret  = my.get('a');
//console.log(ret);
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/*
// 숫자계산이 잘 되네?? 노트북에서는 숫자계산이 안되었는데...

let num1 : number = 10;
let num2 : number = 20;
let num3 : number;

num3 = num1 + num2;
console.log(num3);

num3 = num3 + 1;
console.log(num3);
*/
/////////////////////////////////////////////////////////////////
