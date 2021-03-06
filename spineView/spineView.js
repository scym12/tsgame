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
//---------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------
// main.ts 
//---------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------
require("./build/spine-canvas");
var scmAnimationStateListener = (function () {
    function scmAnimationStateListener() {
    }
    scmAnimationStateListener.prototype.start = function (entry) { };
    scmAnimationStateListener.prototype.interrupt = function (entry) { };
    scmAnimationStateListener.prototype.end = function (entry) { };
    scmAnimationStateListener.prototype.dispose = function (entry) { };
    scmAnimationStateListener.prototype.complete = function (entry) {
        //console.log("Complete"); 
        if (entry.animation.name == "Attack")
            stage.scmSp.state.setAnimation(0, "Idle", true);
    };
    scmAnimationStateListener.prototype.event = function (entry, event) { };
    return scmAnimationStateListener;
}());
exports.scmAnimationStateListener = scmAnimationStateListener;
;
var scmSpine = (function () {
    function scmSpine() {
        this.lastFrameTime = Date.now() / 1000;
        this.canvas = null;
        this.context = null;
        this.assetManager = null;
        this.skeleton = null;
        this.skeletonData = null;
        this.state = null;
        this.skeletonRenderer = null;
        this.x = 0;
        this.y = 0;
        // Attack Crouch Fall Headturn Idle Jump Run Walk 
        //skelName: string  = "hero-mesh";
        this.skelName = "hero";
        this.animName = "Idle";
        this.skinName = "default";
        this.animArr = {};
        this.skinArr = {};
        this.timeScale = 1;
        this.traceEntry = null;
        this.eventListener = null;
        this.LoadingCompleteCallBackFunc = null;
    }
    scmSpine.prototype.setTimeScale = function (ts) {
        this.timeScale = ts;
        if (this.traceEntry != null)
            this.traceEntry.timeScale = ts;
    };
    scmSpine.prototype.setLoadingCompleteCallBackFunc = function (callBackFunc) { this.LoadingCompleteCallBackFunc = callBackFunc; };
    scmSpine.prototype.init = function (skelName) {
        this.skelName = skelName;
        this.eventListener = new scmAnimationStateListener();
        this.canvas = document.getElementById("canvas");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext("2d");
        this.skeletonRenderer = new spine.canvas.SkeletonRenderer(this.context);
        // enable debug rendering
        //this.skeletonRenderer.debugRendering = false;
        // enable the triangle renderer, supports meshes, but may produce artifacts in some browsers
        //this.skeletonRenderer.triangleRendering = false;
        this.skeletonRenderer.debugRendering = false;
        this.skeletonRenderer.triangleRendering = false;
        this.assetManager = new spine.canvas.AssetManager();
        this.assetManager.loadText("assets/" + this.skelName + ".json");
        this.assetManager.loadText("assets/" + this.skelName + ".atlas");
        this.assetManager.loadTexture("assets/" + this.skelName + ".png");
        var me = this;
        // requestAnimationFrame(function() { me.load(); } );
        this.animArr = {};
        this.skinArr = {};
        //var traceEntry : spine.TrackEntry = null;
        console.log("scmSpine init");
    };
    scmSpine.prototype.OnUpdate = function (ctx, tm) {
        var me = this;
        if (me.bounds == null)
            me.load();
        if (me != null && me.assetManager != null && this.assetManager.isLoadingComplete())
            me.render();
    };
    scmSpine.prototype.load = function () {
        var me = this;
        if (me != null && me.assetManager != null && this.assetManager.isLoadingComplete()) {
            console.log("loadSkeleton : " + this.skelName + " : " + this.animName);
            var data = this.loadSkeleton(this.skelName, this.animName, this.skinName);
            this.skeleton = data.skeleton;
            this.state = data.state;
            this.bounds = data.bounds;
            this.skeletonData = data.skeletonData;
            if (this.LoadingCompleteCallBackFunc != null)
                this.LoadingCompleteCallBackFunc();
            //requestAnimationFrame( function() { me.render(); } );
            //this.bounds.skeleton.
            //skeleton.setSkinByName("A");
        }
        else {
            //requestAnimationFrame( function() { me.load(); } );
        }
    };
    scmSpine.prototype.loadSkeleton = function (name, initialAnimation, skin) {
        console.log("loadSkeleton");
        this.animArr = {};
        this.skinArr = {};
        var me = this;
        if (skin === undefined)
            skin = "default";
        // Load the texture atlas using name.atlas and name.png from the AssetManager.
        // The function passed to TextureAtlas is used to resolve relative paths.
        var atlas = new spine.TextureAtlas(me.assetManager.get("assets/" + name + ".atlas"), function (path) {
            return me.assetManager.get("assets/" + path);
        });
        // Create a AtlasAttachmentLoader, which is specific to the WebGL backend.
        var atlasLoader = new spine.AtlasAttachmentLoader(atlas);
        // Create a SkeletonJson instance for parsing the .json file.
        var skeletonJson = new spine.SkeletonJson(atlasLoader);
        // Set the scale to apply during parsing, parse the file, and create a new skeleton.
        var skeletonData = skeletonJson.readSkeletonData(me.assetManager.get("assets/" + name + ".json"));
        var skeleton = new spine.Skeleton(skeletonData);
        var defaultAni = null;
        for (var key in skeletonData.animations) {
            var name_1 = skeletonData.animations[key].name;
            if (defaultAni == null)
                defaultAni = name_1;
            this.animArr[name_1] = name_1;
        }
        var defaultSkin = null;
        for (var key in skeletonData.skins) {
            var name_2 = skeletonData.skins[key].name;
            if (defaultSkin == null)
                defaultSkin = name_2;
            this.skinArr[name_2] = name_2;
        }
        if (this.animArr[initialAnimation] == null)
            initialAnimation = this.animArr[defaultAni];
        if (this.skinArr[skin] == null)
            skin = this.skinArr[defaultSkin];
        skeleton.flipY = true;
        var bounds = me.calculateBounds(skeleton);
        if (skin != null) {
            skeleton.setSkinByName(skin);
        }
        // Create an AnimationState, and set the initial animation in looping mode.
        var animationState = new spine.AnimationState(new spine.AnimationStateData(skeleton.data));
        if (initialAnimation != null) {
            this.traceEntry = animationState.setAnimation(0, initialAnimation, true);
            this.traceEntry.timeScale = this.timeScale;
        }
        animationState.addListener(me.eventListener);
        // Pack everything up and return to caller.
        return { skeleton: skeleton, state: animationState, bounds: bounds, skeletonData: skeletonData };
    };
    scmSpine.prototype.calculateBounds = function (skeleton) {
        var data = skeleton.data;
        skeleton.setToSetupPose();
        skeleton.updateWorldTransform();
        var offset = new spine.Vector2();
        var size = new spine.Vector2();
        skeleton.getBounds(offset, size);
        return { offset: offset, size: size };
    };
    scmSpine.prototype.render = function () {
        if (this.bounds == null)
            return;
        var now = Date.now() / 1000;
        var delta = now - this.lastFrameTime;
        this.lastFrameTime = now;
        this.resize();
        this.context.save();
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        //		this.context.fillStyle = "#cccccc";
        //		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.restore();
        this.context.strokeStyle = "green";
        this.context.beginPath();
        this.context.moveTo(-1000, 0);
        this.context.lineTo(1000, 0);
        this.context.moveTo(0, -1000);
        this.context.lineTo(0, 1000);
        this.context.stroke();
        this.state.update(delta);
        this.state.apply(this.skeleton);
        this.skeleton.updateWorldTransform();
        this.skeleton.flipX = true;
        this.skeletonRenderer.draw(this.skeleton);
        //var me = this;
        //requestAnimationFrame( function() { me.render(); } );
    };
    scmSpine.prototype.resize = function () {
        // this.context.scale(1,1);
        var w = this.canvas.clientWidth;
        var h = this.canvas.clientHeight;
        if (this.canvas.width != w || this.canvas.height != h) {
            this.canvas.width = w;
            this.canvas.height = h;
        }
        // magic
        var centerX = this.bounds.offset.x + this.bounds.size.x / 2;
        var centerY = this.bounds.offset.y + this.bounds.size.y / 2;
        //var scaleX = this.bounds.size.x / this.canvas.width;
        //var scaleY = this.bounds.size.y / this.canvas.height;
        //var scale = Math.max(scaleX, scaleY) * 1.2;
        //if (scale < 1) scale = 1;
        var scale = 1;
        var width = this.canvas.width;
        var height = this.canvas.height;
        //this.context.resetTransform();
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.scale(1 / scale, 1 / scale);
        this.context.translate(-centerX, -centerY);
        this.context.translate(width / 2 + this.x, height / 2 + this.y);
    };
    return scmSpine;
}());
exports.scmSpine = scmSpine;
//---------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------
// scmSprite.ts 
//---------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------
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
        // entry:spine.TrackEntry = null;    
        this.mNum = 0;
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
                var av = this;
                requestAnimationFrame(function (tm) { av.OnUpdate(tm); });
            }
        };
        this.OnUpdate(0);
    }
    Stage.prototype.setCallBackTimeFunc = function (callBackFunc) { this.callBackFunc = callBackFunc; };
    Stage.prototype.initSpine = function (skName, timeScale) {
        this.scmSp = new scmSpine();
        this.scmSp.setTimeScale(timeScale);
        this.scmSp.init(skName);
    };
    Stage.prototype.setCanvas = function (canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
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
var Scene = (function () {
    function Scene() {
        this.parent = null;
        this.mySceneNum = 0;
        this.mSprite = {};
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
        _this.font = "pt ����ü";
        _this.fontSize = 40;
        _this.fontColor = "#ff0000";
        _this.btnUpColor = "#0000ff";
        _this.btnDownColor = "#5555ff";
        return _this;
    }
    scmButton.prototype.loadImage = function (name) {
        _super.prototype.loadImage.call(this, name);
        this.imgUp = this.img;
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
    scmButton.prototype.setImageD = function (img) {
        this.imgDown = new Image();
        this.imgDown.onload = function () { };
        this.imgDown.src = img.toString();
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
/////////////////////////////////////////////////////////////////////////////
//---------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------
var GameManager = (function () {
    function GameManager() {
    }
    GameManager.prototype.setCharState = function (state) {
    };
    GameManager.prototype.charIdle = function () {
    };
    GameManager.prototype.charWalk = function () {
    };
    GameManager.prototype.charAttack = function () {
    };
    return GameManager;
}());
var myStage = (function (_super) {
    __extends(myStage, _super);
    function myStage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.debugRenderingBtn = new scmButton();
        _this.triangleRenderingBtn = new scmButton();
        _this.speedBtn0_25X = new scmButton();
        _this.speedBtn0_5X = new scmButton();
        _this.speedBtn1X = new scmButton();
        _this.speedBtn2X = new scmButton();
        _this.speedBtn4X = new scmButton();
        _this.timeScale = 1;
        return _this;
    }
    myStage.prototype.InitData = function () {
        this.scene = new Scene();
        this.AddScene(this.scene);
        this.sceneBtn = new Scene();
        this.AddScene(this.sceneBtn);
    };
    myStage.prototype.InitAnimationButton = function () {
        if (this.sceneBtn.GetChildCount() > 0 || this.scmSp == null)
            return;
        var a = this.canvas.width;
        var b = this.canvas.height;
        var x = a - 300;
        var y = 10;
        var me = this;
        var _loop_1 = function () {
            var btn = new scmButton();
            this_1.sceneBtn.AddSprite(btn.setFontSize(20).setText(key).setSize(200, 30).setCallBackFunc(function () {
                var str = key;
                stage.scmSp.traceEntry = stage.scmSp.state.setAnimation(0, btn.getText(), true);
                stage.scmSp.traceEntry.timeScale = me.timeScale;
                // alpha : 1
                // animationEnd : 0.533...
                // delay
                // mixTime : 0
                // mixDuration : 0
                /// timeScale : 1
            }).setLocation(x, y));
            y = y + 60;
        };
        var this_1 = this;
        for (var key in this.scmSp.animArr) {
            _loop_1();
        }
        y = 10;
        x = x - 250;
        var _loop_2 = function () {
            var btn = new scmButton();
            this_2.sceneBtn.AddSprite(btn.setFontSize(20).setText(key).setSize(200, 30).setCallBackFunc(function () {
                var str = key;
                stage.scmSp.skeleton.setSkinByName(btn.getText());
            }).setLocation(x, y));
            y = y + 60;
        };
        var this_2 = this;
        for (var key in this.scmSp.skinArr) {
            _loop_2();
        }
    };
    myStage.prototype.UpdateRenderButton = function () {
        var me = this;
        if (me.scmSp == null)
            return;
        if (me.scmSp.skeletonRenderer.debugRendering != me.debugRenderingBtn.tagBool)
            me.scmSp.skeletonRenderer.debugRendering = me.debugRenderingBtn.tagBool;
        me.debugRenderingBtn.setText("debugRendering : " + me.scmSp.skeletonRenderer.debugRendering);
        if (me.scmSp.skeletonRenderer.triangleRendering != me.triangleRenderingBtn.tagBool)
            me.scmSp.skeletonRenderer.triangleRendering = me.triangleRenderingBtn.tagBool;
        me.triangleRenderingBtn.setText("triangleRendering : " + me.scmSp.skeletonRenderer.triangleRendering);
    };
    myStage.prototype.initSpineEx = function (fname) {
        this.sceneBtn.RemoveAllSprite();
        //this.RemoveScene(this.sceneBtn.mySceneNum);
        //this.sceneBtn = new Scene();
        //this.AddScene(this.sceneBtn);
        var me = this;
        var timeScale = 1;
        this.initSpine(fname, me.timeScale);
        this.scmSp.setLoadingCompleteCallBackFunc(function () { });
    };
    myStage.prototype.LoadSpineFileList = function () {
        this.scene.RemoveAllSprite();
        var x = 10;
        var y = 10;
        var _loop_3 = function () {
            if (manager.fileList[key] && manager.fileList[key].length > 1) {
                var sz = manager.fileList[key].length;
                var fname_1 = manager.fileList[key].substr(0, sz - 6);
                //console.log("FileList1 : [" + manager.fileList[key]+ "]");
                //console.log("FileList2 : " + manager.fileList[key].substr(0,sz-6));
                me = this_3;
                this_3.scene.AddSprite((new scmButton()).setFontSize(20).setText(fname_1).setSize(200, 30).setCallBackFunc(function () { me.initSpineEx(fname_1); }).setLocation(x, y));
                y = y + 40;
            }
        };
        var this_3 = this, me;
        for (var key in manager.fileList) {
            _loop_3();
        }
        /////////////////////////////////////////////////////////////////////////////////
        // ETC Button 
        /////////////////////////////////////////////////////////////////////////////////
        var a = this.canvas.width - 600;
        y = 10;
        var me = this;
        this.scene.AddSprite(this.debugRenderingBtn.setFontSize(20).setText("debugRendering : off").setSize(300, 30).setCallBackFunc(function () {
            if (me.scmSp == null)
                return;
            if (me.debugRenderingBtn.tagBool == true)
                me.debugRenderingBtn.tagBool = false;
            else
                me.debugRenderingBtn.tagBool = true;
        }).setLocation(a / 2 + 150, y));
        y = y + 35;
        this.scene.AddSprite(this.triangleRenderingBtn.setFontSize(20).setText("triangleRendering : off").setSize(300, 30).setCallBackFunc(function () {
            if (me.scmSp == null)
                return;
            if (me.triangleRenderingBtn.tagBool == true)
                me.triangleRenderingBtn.tagBool = false;
            else
                me.triangleRenderingBtn.tagBool = true;
        }).setLocation(a / 2 + 150, y));
        this.UpdateRenderButton();
        /////////////////////////////////////////////////////////////////////////////////
        // Speed Button 
        /////////////////////////////////////////////////////////////////////////////////
        y = 90;
        x = a / 2 + 100;
        this.scene.AddSprite(this.speedBtn0_25X.setFontSize(20).setText("x4").setSize(60, 30).setCallBackFunc(function () {
            me.timeScale = 0.25;
            if (me.scmSp != null && me.scmSp.traceEntry != null)
                me.scmSp.traceEntry.timeScale = me.timeScale;
        }).setLocation(x, y));
        x = x + 80;
        this.scene.AddSprite(this.speedBtn0_5X.setFontSize(20).setText("x2").setSize(60, 30).setCallBackFunc(function () {
            me.timeScale = 0.5;
            if (me.scmSp != null && me.scmSp.traceEntry != null)
                me.scmSp.traceEntry.timeScale = me.timeScale;
        }).setLocation(x, y));
        x = x + 80;
        this.scene.AddSprite(this.speedBtn1X.setFontSize(20).setText("x1").setSize(60, 30).setCallBackFunc(function () {
            me.timeScale = 1;
            if (me.scmSp != null && me.scmSp.traceEntry != null)
                me.scmSp.traceEntry.timeScale = me.timeScale;
        }).setLocation(x, y));
        x = x + 80;
        this.scene.AddSprite(this.speedBtn2X.setFontSize(20).setText("0.5").setSize(60, 30).setCallBackFunc(function () {
            me.timeScale = 2;
            if (me.scmSp != null && me.scmSp.traceEntry != null)
                me.scmSp.traceEntry.timeScale = me.timeScale;
        }).setLocation(x, y));
        x = x + 80;
        this.scene.AddSprite(this.speedBtn4X.setFontSize(20).setText("0.25").setSize(60, 30).setCallBackFunc(function () {
            me.timeScale = 4;
            if (me.scmSp != null && me.scmSp.traceEntry != null)
                me.scmSp.traceEntry.timeScale = me.timeScale;
        }).setLocation(x, y));
        x = x + 80;
    };
    myStage.prototype.LoadSpine = function (fname) {
    };
    myStage.prototype.OnUpdateEx = function () {
        this.UpdateRenderButton();
        if (manager.fileList != null) {
            this.LoadSpineFileList();
            manager.fileList = null;
        }
        if (this.scmSp && this.scmSp.animArr != null) {
            this.InitAnimationButton();
        }
    };
    return myStage;
}(Stage));
var stage = new myStage();
var manager = new GameManager();
stage.setCallBackTimeFunc(function () { stage.OnUpdateEx(); });
window.onload = function () {
    var canvas;
    canvas = document.getElementById('canvas');
    stage.setCanvas(canvas);
    stage.OnUpdate(0);
    canvas.addEventListener("mousedown", function (event) { stage.mouseDown(event); }, false);
    canvas.addEventListener("mouseup", function (event) { stage.mouseUp(event); }, false);
    console.log("window.onload");
};
function gameInit() {
    stage.InitData();
}
gameInit();
//----------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------
function readTextFile(file) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;
                var allText2 = rawFile.response;
                var ret = allText.split("\n");
                //console.log(allText);
                //console.log(allText2);
                manager.fileList = ret;
            }
        }
    };
    rawFile.send(null);
}
readTextFile("list.txt");
//----------------------------------------------------------------------------------------------------------------------------------------------
