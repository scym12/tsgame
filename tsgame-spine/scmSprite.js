"use strict";
//////////////////////////////////////////////////////////////////////
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
exports.__esModule = true;
var Point = (function () {
    function Point() {
        this.nx = 0;
        this.ny = 0;
    }
    return Point;
}());
exports.Point = Point;
var SNode = (function () {
    function SNode() {
        this.loc = new Point();
        this.pivot = new Point();
    }
    SNode.prototype.getX = function () { return this.loc.nx + this.pivot.nx; };
    SNode.prototype.getY = function () { return this.loc.ny + this.pivot.ny; };
    SNode.prototype.setNumber = function (num) {
        this.unique = num;
    };
    return SNode;
}());
exports.SNode = SNode;
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
exports.Sprite = Sprite;
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
exports.Stage = Stage;
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
    // ���ڴ� ������ �Ǵ°�? �����÷ο��Ǹ�? �ذ�å��? 
    // Number�� �� ������ �ȵǴ°ǰ�? (���굵 �ȵǴ� ����Ÿ���� ���������� �����ΰ�?)
    // var a = 10; 
    // var b : Number = 10;
    // ���� �������� ? 
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
exports.Scene = Scene;
/////////////////////////////////////////////////////////////////////////////
var scmButton = (function (_super) {
    __extends(scmButton, _super);
    function scmButton() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.btnState = 0;
        _this.callBackFunc = null;
        _this.text = null;
        _this.width = 0;
        _this.height = 0;
        _this.font = "40pt ����ü";
        _this.fontColor = "#ff0000";
        _this.btnUpColor = "#0000ff";
        _this.btnDownColor = "#5555ff";
        return _this;
    }
    scmButton.prototype.loadImage = function (name) {
        _super.prototype.loadImage.call(this, name);
        this.imgUp = this.img;
    };
    scmButton.prototype.setText = function (text) { this.text = text; };
    scmButton.prototype.setSize = function (width, height) { this.width = width; this.height = height; };
    scmButton.prototype.mouseDown = function (event) {
        var width = 0;
        var height = 0;
        if (this.text && this.text.length > 0) {
            width = this.width;
            height = this.height;
        }
        else {
            width = this.img && this.img.width || 0;
            height = this.img && this.img.height || 0;
        }
        if (event.x > this.getX() && event.x < (this.getX() + width)
            && event.y > this.getY() && event.y < (this.getY() + height))
            this.btnState = 1;
        if (this.imgDown && this.btnState == 1)
            this.img = this.imgDown;
    };
    scmButton.prototype.mouseUp = function (event) {
        var width = 0;
        var height = 0;
        if (this.text && this.text.length > 0) {
            width = this.width;
            height = this.height;
        }
        else {
            width = this.img && this.img.width || 0;
            height = this.img && this.img.height || 0;
        }
        if (event.x > this.getX() && event.x < (this.getX() + width)
            && event.y > this.getY() && event.y < (this.getY() + height)) {
            this.OnClick();
        }
        if (this.btnState == 1)
            this.btnState = 0;
        if (this.imgUp && this.btnState == 0)
            this.img = this.imgUp;
    };
    scmButton.prototype.setImageD = function (img) {
        this.imgDown = new Image();
        this.imgDown.onload = function () { };
        this.imgDown.src = img.toString();
    };
    scmButton.prototype.OnUpdate = function (ctx, tm) {
        if (this.text && this.text.length > 0) {
            var font = ctx.font;
            var fStyle = ctx.fillStyle;
            var dx = 0;
            var dy = 0;
            if (this.btnState == 1) {
                dx = 3;
                dy = 3;
            }
            //console.log("text is" + this.text);
            ctx.fillStyle = (this.btnState == 0) ? this.btnUpColor : this.btnDownColor;
            ctx.fillRect(this.getX() + dx, this.getY() + dy, this.width, this.height);
            var x = this.width / 2;
            var y = this.height / 2;
            ctx.font = this.font;
            ctx.fillStyle = this.fontColor;
            ctx.fillText(this.text, this.getX() + x + dx, this.getY() + y + 20 + dy, this.width);
            ctx.textAlign = "center";
            ctx.font = font;
            ctx.fillStyle = fStyle;
        }
        else
            _super.prototype.OnUpdate.call(this, ctx, tm);
    };
    scmButton.prototype.OnClick = function () {
        if (this.callBackFunc != null)
            this.callBackFunc();
        //console.log("Good" + this.unique);
    };
    return scmButton;
}(Sprite));
exports.scmButton = scmButton;
/////////////////////////////////////////////////////////////////////////////
