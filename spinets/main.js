"use strict";
//import * as spine from "./build/spine-canvas.d.ts";
//import { spine } from './build/spine-canvas.d.ts'
//import * as spine from "./spine-canvas";
exports.__esModule = true;
//require("./build/spine-canvas");
var scmAnimationStateListener = (function () {
    function scmAnimationStateListener() {
    }
    scmAnimationStateListener.prototype.start = function (entry) { };
    scmAnimationStateListener.prototype.interrupt = function (entry) { };
    scmAnimationStateListener.prototype.end = function (entry) { };
    scmAnimationStateListener.prototype.dispose = function (entry) { };
    scmAnimationStateListener.prototype.complete = function (entry) { };
    scmAnimationStateListener.prototype.event = function (entry, event) { };
    return scmAnimationStateListener;
}());
;
var scmSpine = (function () {
    function scmSpine() {
        this.lastFrameTime = Date.now() / 1000;
        this.canvas = null;
        this.context = null;
        this.assetManager = null;
        this.skeleton = null;
        this.state = null;
        this.skeletonRenderer = null;
        /*
            skelName: string  = "spineboy";
            animName: string  = "walk";
            skinName: string  = "default";
        */
        this.skelName = "hero-mesh";
        this.animName = "Idle";
        this.skinName = "default";
        this.eventListener = null;
    }
    scmSpine.prototype.init = function () {
        this.eventListener = new scmAnimationStateListener();
        this.canvas = document.getElementById("canvas");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext("2d");
        this.skeletonRenderer = new spine.canvas.SkeletonRenderer(this.context);
        // enable debug rendering
        this.skeletonRenderer.debugRendering = false;
        // enable the triangle renderer, supports meshes, but may produce artifacts in some browsers
        this.skeletonRenderer.triangleRendering = false;
        this.skeletonRenderer.debugRendering = false;
        this.skeletonRenderer.triangleRendering = true;
        this.assetManager = new spine.canvas.AssetManager();
        this.assetManager.loadText("assets/" + this.skelName + ".json");
        this.assetManager.loadText("assets/" + this.skelName + ".atlas");
        this.assetManager.loadTexture("assets/" + this.skelName + ".png");
        var me = this;
        requestAnimationFrame(function () { me.load(); });
    };
    scmSpine.prototype.load = function () {
        var me = this;
        if (me != null && me.assetManager != null && this.assetManager.isLoadingComplete()) {
            console.log("loadSkeleton : " + this.skelName + ":" + this.animName);
            var data = this.loadSkeleton(this.skelName, this.animName, this.skinName);
            this.skeleton = data.skeleton;
            this.state = data.state;
            this.bounds = data.bounds;
            requestAnimationFrame(function () { me.render(); });
        }
        else {
            requestAnimationFrame(function () { me.load(); });
        }
    };
    scmSpine.prototype.loadSkeleton = function (name, initialAnimation, skin) {
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
        skeleton.flipY = true;
        var bounds = me.calculateBounds(skeleton);
        skeleton.setSkinByName(skin);
        // Create an AnimationState, and set the initial animation in looping mode.
        var animationState = new spine.AnimationState(new spine.AnimationStateData(skeleton.data));
        animationState.setAnimation(0, initialAnimation, true);
        animationState.addListener(me.eventListener);
        // Pack everything up and return to caller.
        return { skeleton: skeleton, state: animationState, bounds: bounds };
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
        var now = Date.now() / 1000;
        var delta = now - this.lastFrameTime;
        this.lastFrameTime = now;
        this.resize();
        this.context.save();
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.fillStyle = "#cccccc";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.restore();
        this.state.update(delta);
        this.state.apply(this.skeleton);
        this.skeleton.updateWorldTransform();
        this.skeleton.flipX = true;
        this.skeletonRenderer.draw(this.skeleton);
        this.context.strokeStyle = "green";
        this.context.beginPath();
        this.context.moveTo(-1000, 0);
        this.context.lineTo(1000, 0);
        this.context.moveTo(0, -1000);
        this.context.lineTo(0, 1000);
        this.context.stroke();
        var me = this;
        requestAnimationFrame(function () { me.render(); });
    };
    scmSpine.prototype.resize = function () {
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
        this.context.translate(width / 2, height / 2);
    };
    return scmSpine;
}());
var scmSp = new scmSpine();
scmSp.init();
