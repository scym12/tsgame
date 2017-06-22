"use strict";
exports.__esModule = true;
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
        //if(entry.animation.name == "Attack")
        //    stage.scmSp.state.setAnimation(0,"Idle",true);
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
