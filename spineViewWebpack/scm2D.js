"use strict";
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
var tsSpine = require("./scmSpine");
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
        this.visible = true;
        this.loc = new Point();
        this.pivot = new Point();
        this.tagBool = true;
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
        return this;
    };
    Sprite.prototype.OnUpdate = function (ctx, tm) {
        if (this.visible == false)
            return;
        // console.log("sprite onupdate" + ctx)
        if (ctx && this.img) {
            var x = this.getX() + (this.parent && this.parent.node.getX() || 0);
            var y = this.getY() + (this.parent && this.parent.node.getY() || 0);
            ctx.drawImage(this.img, x, y);
        }
    };
    Sprite.prototype.mouseDown = function (event) {
        if (this.visible == false)
            return;
        var x = event.x;
        var y = event.y;
        console.log("Sprite down : " + x + ":" + y);
    };
    Sprite.prototype.mouseUp = function (event) {
        if (this.visible == false)
            return;
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
        this.scmSp = null;
        this.mNum = 0;
        // default Scene
        this.defaultScene = new Scene();
        // Before OnUpdate
        this.callBackFunc = null;
        this.mScene = {};
        /////////////////////////////////////////////////////
        this.OnUpdate = function OnUpdate(tm) {
            if (this.callBackFunc != null)
                this.callBackFunc();
            //console.log("stage onupdate  " + tm + " " + typeof(tm));
            if (this.canvas) {
                var a = this.canvas.width;
                var b = this.canvas.height;
                //console.log("canvas : " + a + ":" + b);
                //this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.scale(1, 1);
                this.ctx.save();
                this.ctx.setTransform(1, 0, 0, 1, 0, 0);
                //            this.ctx.fillStyle = "black";
                //            this.ctx.fillRect(0, 0, 1280, 720);
                if (this.scmSp == null)
                    this.ctx.fillStyle = "#ffffff";
                else
                    this.ctx.fillStyle = "#cccccc";
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.restore();
                if (this.scmSp != null)
                    this.scmSp.OnUpdate();
                for (var key in this.mScene) {
                    var scene = this.mScene[key];
                    if (scene)
                        scene.OnUpdate(this.ctx, tm);
                }
            }
            var av = this;
            requestAnimationFrame(function (tm) { av.OnUpdate(tm); });
        };
        this.AddScene(this.defaultScene);
        this.OnUpdate(0);
    }
    Stage.prototype.getDefaultScene = function () { return this.defaultScene; };
    Stage.prototype.setCallBackTimeFunc = function (callBackFunc) { this.callBackFunc = callBackFunc; };
    Stage.prototype.initSpine = function (skName, timeScale) {
        this.scmSp = new tsSpine.scmSpine();
        this.scmSp.setTimeScale(timeScale);
        this.scmSp.init(skName);
    };
    Stage.prototype.setCanvas = function (canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        var me = this;
        this.canvas.addEventListener("mousedown", function (event) { me.mouseDown(event); }, false);
        this.canvas.addEventListener("mouseup", function (event) { me.mouseUp(event); }, false);
    };
    Stage.prototype.AddScene = function (scene) {
        this.mNum = this.mNum + 1;
        scene.setNumber(this.mNum);
        this.mScene[this.mNum] = scene;
        scene.setParent(this, this.mNum);
    };
    Stage.prototype.RemoveScene = function (num) {
        this.mScene[num] = null;
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
var SpriteList = (function () {
    function SpriteList() {
        this.arr = [];
    }
    SpriteList.prototype.AddNode = function (sp) {
        this.arr.push(sp);
    };
    SpriteList.prototype.DeleteNode = function (sp) {
        for (var idx in this.arr) {
            if (this.arr[idx] == sp) {
                var ret = this.arr.splice(Number(idx), 1);
                console.log(ret);
                console.log(this.arr);
                break;
            }
        }
    };
    SpriteList.prototype.GetNodeList = function () {
        return this.arr;
    };
    return SpriteList;
}());
var SpriteManager = (function () {
    function SpriteManager() {
        this.arr = {};
    }
    SpriteManager.prototype.AddSprite = function (s, num) {
        if (num == null)
            num = 10;
        if (this.arr[num] == null) {
            var arrSub = new SpriteList();
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
    SpriteManager.prototype.RemoveAllSprite = function () {
        this.arr = {};
    };
    SpriteManager.prototype.Loop = function (callBackFunc) {
        for (var idx in this.arr) {
            var arr = this.arr[idx].GetNodeList();
            for (var idx2 in arr) {
                if (callBackFunc != null)
                    callBackFunc(arr[idx2]);
            }
        }
    };
    return SpriteManager;
}());
var Scene = (function () {
    function Scene() {
        this.parent = null;
        this.mySceneNum = 0;
        this.mSprite = {};
        this.mSpriteManager = new SpriteManager();
        this.mNum = 0;
        this.node = new SNode();
    }
    Scene.prototype.setParent = function (p, num) { this.parent = p; this.mySceneNum = num; };
    Scene.prototype.setNumber = function (num) {
        this.node.setNumber(num);
    };
    Scene.prototype.AddSprite = function (sprite) {
        this.mNum = this.mNum + 1;
        sprite.setNumber(this.mNum);
        this.mSprite[this.mNum] = sprite;
        sprite.setParent(this);
        this.mSpriteManager.AddSprite(sprite);
    };
    Scene.prototype.RemoveSprite2 = function (sprite) {
        this.mSpriteManager.RemoveSprite(sprite);
    };
    Scene.prototype.RemoveSprite = function (num) {
        this.mSprite[num] = null;
    };
    Scene.prototype.RemoveAllSprite = function () {
        this.mSprite = {};
    };
    Scene.prototype.GetChildCount = function () {
        var cnt = 0;
        for (var key in this.mSprite) {
            cnt = cnt + 1;
        }
        return cnt;
    };
    Scene.prototype.OnUpdate = function (ctx, tm) {
        //console.log("scene update"+ ctx);
        //        for (var key in this.mSprite) {           
        //            var sprite: Sprite = this.mSprite[key];
        //            sprite.OnUpdate(ctx,tm);
        //        }
        this.mSpriteManager.Loop(function (s) {
            s.OnUpdate(ctx, tm);
        });
    };
    Scene.prototype.mouseDown = function (event) {
        this.mSpriteManager.Loop(function (s) {
            s.mouseDown(event);
        });
        //        for (var key in this.mSprite) {           
        //            this.mSprite[key].mouseDown(event);
        //        }        
    };
    Scene.prototype.mouseUp = function (event) {
        this.mSpriteManager.Loop(function (s) {
            s.mouseUp(event);
        });
        //        for (var key in this.mSprite) {           
        //            this.mSprite[key].mouseUp(event);
        //        }        
    };
    return Scene;
}());
exports.Scene = Scene;
var scmSpineAni = (function (_super) {
    __extends(scmSpineAni, _super);
    function scmSpineAni() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.spine = null;
        return _this;
    }
    scmSpineAni.prototype.setDebug = function (num) {
        this.spine.debugLine = num;
    };
    scmSpineAni.prototype.initSpine = function (skName, timeScale) {
        this.spine = new tsSpine.scmSpine();
        this.spine.setTimeScale(timeScale);
        this.spine.init(skName);
    };
    scmSpineAni.prototype.OnUpdate = function (ctx, tm) {
        var me = this;
        if (me.spine != null) {
            if (me.spine.skeleton) {
                this.spine.skeleton.x = this.getX();
                this.spine.skeleton.y = this.getY();
            }
            me.spine.OnUpdate(ctx, tm);
        }
    };
    scmSpineAni.prototype.setLocation = function (x, y) {
        this.loc.nx = x;
        this.loc.ny = y;
        //this.spine.skeleton.x = x;
        //this.spine.skeleton.y = y;
        return this;
    };
    return scmSpineAni;
}(Sprite));
exports.scmSpineAni = scmSpineAni;
var scmButton = (function (_super) {
    __extends(scmButton, _super);
    function scmButton(upimg, downimg) {
        var _this = _super.call(this) || this;
        _this.imgUp = null;
        _this.imgDown = null;
        _this.btnState = 0;
        _this.callBackFunc = null;
        _this.text = null;
        _this.width = 0;
        _this.height = 0;
        _this.font = "pt ����ü";
        _this.fontSize = 40;
        _this.fontColor = "#ff0000";
        _this.btnUpColor = "#0000ff";
        _this.btnDownColor = "#5555ff";
        if (upimg)
            _this.loadImage(upimg);
        if (downimg)
            _this.setImageD(downimg);
        return _this;
    }
    scmButton.prototype.loadImage = function (name) {
        _super.prototype.loadImage.call(this, name);
        this.imgUp = this.img;
    };
    scmButton.prototype.setImageD = function (img) {
        this.imgDown = new Image();
        this.imgDown.onload = function () { };
        this.imgDown.src = img.toString();
    };
    scmButton.prototype.setFontSize = function (sz) { this.fontSize = sz; return this; };
    scmButton.prototype.setText = function (text) { this.text = text; return this; };
    scmButton.prototype.getText = function () { return this.text; };
    scmButton.prototype.setSize = function (width, height) { this.width = width; this.height = height; return this; };
    scmButton.prototype.setCallBackFunc = function (callBackFunc) { this.callBackFunc = callBackFunc; return this; };
    scmButton.prototype.mouseDown = function (event) {
        if (this.visible == false)
            return;
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
        if (this.visible == false)
            return;
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
    scmButton.prototype.OnUpdate = function (ctx, tm) {
        if (this.visible == false)
            return;
        if (this.text && this.text.length > 0) {
            ctx.scale(1, 1);
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
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
            ctx.font = this.fontSize + this.font;
            ctx.fillStyle = this.fontColor;
            ctx.textAlign = "center";
            ctx.fillText(this.text, this.getX() + x + dx, this.getY() + y + (this.fontSize / 2) + dy, this.width);
            ctx.font = font;
            ctx.fillStyle = fStyle;
            ctx.restore();
        }
        else
            _super.prototype.OnUpdate.call(this, ctx, tm);
    };
    scmButton.prototype.OnClick = function () {
        if (this.visible == false)
            return;
        if (this.callBackFunc != null)
            this.callBackFunc();
        //console.log("Good" + this.unique);
    };
    return scmButton;
}(Sprite));
exports.scmButton = scmButton;
