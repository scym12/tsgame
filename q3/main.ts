//import * as spine from "./build/spine-canvas.d.ts";
//import { spine } from './build/spine-canvas.d.ts'
//import * as spine from "./spine-canvas";

import  "./build/spine-canvas";


var lastFrameTime = Date.now() / 1000;
var canvas, context;
var assetManager;
var skeleton, state, bounds;
var skeletonRenderer;

var skelName = "spineboy";
var animName = "test";

function init () {
	canvas = document.getElementById("canvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	context = canvas.getContext("2d");

	skeletonRenderer = new spine.canvas.SkeletonRenderer(context);
	// enable debug rendering
	skeletonRenderer.debugRendering = true;
	// enable the triangle renderer, supports meshes, but may produce artifacts in some browsers
	skeletonRenderer.triangleRendering = false;

	assetManager = new spine.canvas.AssetManager();

	assetManager.loadText("assets/" + skelName + ".json");
	assetManager.loadText("assets/" + skelName + ".atlas");
	assetManager.loadTexture("assets/" + skelName + ".png");

	requestAnimationFrame(load);
}

function load () {
	if (assetManager.isLoadingComplete()) {
		var data = loadSkeleton(skelName, animName, "default");
		skeleton = data.skeleton;
		state = data.state;
		bounds = data.bounds;
		requestAnimationFrame(render);
	} else {
		requestAnimationFrame(load);
	}
}


class scmAnimationStateListener implements spine.AnimationStateListener2 
{
        start(entry: spine.TrackEntry) { }
        interrupt(entry: spine.TrackEntry) { }
        end(entry: spine.TrackEntry) { }
        dispose(entry: spine.TrackEntry) { }
        complete(entry: spine.TrackEntry) { }
        event(entry: spine.TrackEntry, event: spine.Event) { }

};

var eventListener = new scmAnimationStateListener();

function loadSkeleton (name, initialAnimation, skin) {
	if (skin === undefined) skin = "default";

	// Load the texture atlas using name.atlas and name.png from the AssetManager.
	// The function passed to TextureAtlas is used to resolve relative paths.
	var atlas = new spine.TextureAtlas(assetManager.get("assets/" + name + ".atlas"), function(path) {
		return assetManager.get("assets/" + path);
	});

	// Create a AtlasAttachmentLoader, which is specific to the WebGL backend.
	var atlasLoader = new spine.AtlasAttachmentLoader(atlas);

	// Create a SkeletonJson instance for parsing the .json file.
	var skeletonJson = new spine.SkeletonJson(atlasLoader);

	// Set the scale to apply during parsing, parse the file, and create a new skeleton.
	var skeletonData = skeletonJson.readSkeletonData(assetManager.get("assets/" + name + ".json"));
	var skeleton = new spine.Skeleton(skeletonData);
	skeleton.flipY = true;
	var bounds = calculateBounds(skeleton);
	skeleton.setSkinByName(skin);

	// Create an AnimationState, and set the initial animation in looping mode.
	var animationState = new spine.AnimationState(new spine.AnimationStateData(skeleton.data));
	animationState.setAnimation(0, initialAnimation, true);
	animationState.addListener(eventListener);

	// Pack everything up and return to caller.
	return { skeleton: skeleton, state: animationState, bounds: bounds };
}

function calculateBounds(skeleton) {
	var data = skeleton.data;
	skeleton.setToSetupPose();
	skeleton.updateWorldTransform();
	var offset = new spine.Vector2();
	var size = new spine.Vector2();
	skeleton.getBounds(offset, size);
	return { offset: offset, size: size };
}

function render () {
	var now = Date.now() / 1000;
	var delta = now - lastFrameTime;
	lastFrameTime = now;

	resize();

	context.save();
	context.setTransform(1, 0, 0, 1, 0, 0);
	context.fillStyle = "#cccccc";
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.restore();

	state.update(delta);
	state.apply(skeleton);
	skeleton.updateWorldTransform();
	skeletonRenderer.draw(skeleton);

	context.strokeStyle = "green";
	context.beginPath();
	context.moveTo(-1000, 0);
	context.lineTo(1000, 0);
	context.moveTo(0, -1000);
	context.lineTo(0, 1000);
	context.stroke();

	requestAnimationFrame(render);
}

function resize () {
	var w = canvas.clientWidth;
	var h = canvas.clientHeight;
	if (canvas.width != w || canvas.height != h) {
		canvas.width = w;
		canvas.height = h;
	}

	// magic
	var centerX = bounds.offset.x + bounds.size.x / 2;
	var centerY = bounds.offset.y + bounds.size.y / 2;
	var scaleX = bounds.size.x / canvas.width;
	var scaleY = bounds.size.y / canvas.height;
	var scale = Math.max(scaleX, scaleY) * 1.2;
	if (scale < 1) scale = 1;
	var width = canvas.width;
	var height = canvas.height;

	context.resetTransform();
	context.scale(1 / scale, 1 / scale);
	context.translate(-centerX, -centerY);
	context.translate(width / 2, height / 2);
}


init();
