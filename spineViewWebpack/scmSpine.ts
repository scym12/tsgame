import  "./build/spine-canvas";

export class scmAnimationStateListener implements spine.AnimationStateListener2 
{
	start(entry: spine.TrackEntry) { }
	interrupt(entry: spine.TrackEntry) { }
	end(entry: spine.TrackEntry) { }
	dispose(entry: spine.TrackEntry) { }
	complete(entry: spine.TrackEntry) { 
        //console.log("Complete"); 
        //if(entry.animation.name == "Attack")
        //    stage.scmSp.state.setAnimation(0,"Idle",true);
    }
	event(entry: spine.TrackEntry, event: spine.Event) { }

};

export class scmSpine { 
	lastFrameTime : number = Date.now() / 1000;
	canvas: HTMLCanvasElement = null;
	context: CanvasRenderingContext2D = null;
	assetManager: spine.AssetManager = null;
	skeleton: spine.Skeleton = null;
    skeletonData:spine.SkeletonData = null;
	state: spine.AnimationState = null;
	bounds;
	skeletonRenderer: spine.canvas.SkeletonRenderer = null;
    x : number = 0;
    y : number = 0;

	// Attack Crouch Fall Headturn Idle Jump Run Walk 
	//skelName: string  = "hero-mesh";
	skelName: string  = "hero";
	animName: string  = "Idle";
	skinName: string  = "default";

    animArr: { [keycode: string]: string; } = {};
    skinArr: { [keycode: string]: string; } = {};

    private timeScale : number = 1;
    traceEntry: spine.TrackEntry = null;    
    setTimeScale(ts) { 
        this.timeScale = ts; 
        if(this.traceEntry != null)
            this.traceEntry.timeScale = ts;
    }

	eventListener:scmAnimationStateListener = null;
    LoadingCompleteCallBackFunc : () => void = null;
    setLoadingCompleteCallBackFunc(callBackFunc : () => void) { this.LoadingCompleteCallBackFunc = callBackFunc; }

	init (skelName:string) {
        this.skelName = skelName; 

		this.eventListener = new scmAnimationStateListener();

		this.canvas = <HTMLCanvasElement>document.getElementById("canvas");
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
	}

    OnUpdate(ctx : CanvasRenderingContext2D, tm) {
		var me = this;
        if (me.bounds == null)
            me.load();
        if (me != null && me.assetManager != null &&  this.assetManager.isLoadingComplete()) 
            me.render();
            
    }

	load () {
		var me = this;
		if (me != null && me.assetManager != null && this.assetManager.isLoadingComplete()) {
			console.log("loadSkeleton : " + this.skelName + " : " + this.animName);
			var data = this.loadSkeleton(this.skelName, this.animName, this.skinName);
			this.skeleton = data.skeleton;
			this.state = data.state;
			this.bounds = data.bounds;
            this.skeletonData = data.skeletonData;
            if(this.LoadingCompleteCallBackFunc != null)
                this.LoadingCompleteCallBackFunc();
			//requestAnimationFrame( function() { me.render(); } );

            //this.bounds.skeleton.
            //skeleton.setSkinByName("A");



		} else {
			//requestAnimationFrame( function() { me.load(); } );
		}
	}


	loadSkeleton (name, initialAnimation, skin) {
        console.log("loadSkeleton");

        this.animArr = {};
        this.skinArr = {};

		var me = this;
		if (skin === undefined) skin = "default";

		// Load the texture atlas using name.atlas and name.png from the AssetManager.
		// The function passed to TextureAtlas is used to resolve relative paths.
		var atlas = new spine.TextureAtlas(me.assetManager.get("assets/" + name + ".atlas"), function(path) {
			return me.assetManager.get("assets/" + path);
		});

		// Create a AtlasAttachmentLoader, which is specific to the WebGL backend.
		var atlasLoader = new spine.AtlasAttachmentLoader(atlas);

		// Create a SkeletonJson instance for parsing the .json file.
		var skeletonJson = new spine.SkeletonJson(atlasLoader);

		// Set the scale to apply during parsing, parse the file, and create a new skeleton.
		var skeletonData:spine.SkeletonData = skeletonJson.readSkeletonData(me.assetManager.get("assets/" + name + ".json"));
		var skeleton:spine.Skeleton = new spine.Skeleton(skeletonData);

        var defaultAni:string = null;
        for(let key in skeletonData.animations) 
        {
            let name = skeletonData.animations[key].name;
            if(defaultAni == null) defaultAni = name; 
            this.animArr[name] = name;
        }

        var defaultSkin:string = null;
        for(let key in skeletonData.skins) {
            let name = skeletonData.skins[key].name;
            if(defaultSkin == null) defaultSkin = name; 
            this.skinArr[name] = name;
        }

        if(this.animArr[initialAnimation] == null)
            initialAnimation = this.animArr[defaultAni];
        if(this.skinArr[skin] == null)
            skin = this.skinArr[defaultSkin];
		skeleton.flipY = true;
		var bounds = me.calculateBounds(skeleton);

        if(skin != null) {
    		skeleton.setSkinByName(skin);
        }

        // Create an AnimationState, and set the initial animation in looping mode.
        var animationState = new spine.AnimationState(new spine.AnimationStateData(skeleton.data));
        if(initialAnimation != null)
        {
            this.traceEntry = animationState.setAnimation(0, initialAnimation, true);
            this.traceEntry.timeScale = this.timeScale;
        }
        animationState.addListener(me.eventListener);

		// Pack everything up and return to caller.
		return { skeleton: skeleton, state: animationState, bounds: bounds , skeletonData: skeletonData};
	}

	calculateBounds(skeleton:spine.Skeleton) {
		var data:spine.SkeletonData = skeleton.data;
		skeleton.setToSetupPose();
		skeleton.updateWorldTransform();
		var offset:spine.Vector2 = new spine.Vector2();
		var size:spine.Vector2 = new spine.Vector2();
		skeleton.getBounds(offset, size);
		
		return { offset: offset, size: size } ;
	}


	render () {
        if(this.bounds == null) return;
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
		this.skeleton.flipX=true;
		this.skeletonRenderer.draw(this.skeleton);



		//var me = this;
		//requestAnimationFrame( function() { me.render(); } );
	}

	resize () {
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
		var scale=1;
		var width = this.canvas.width;
		var height = this.canvas.height;

		//this.context.resetTransform();
		this.context.setTransform(1, 0, 0, 1, 0, 0);

		this.context.scale(1 / scale, 1 / scale);
		this.context.translate(-centerX, -centerY);
		this.context.translate(width / 2 + this.x, height / 2 + this.y);
	}
}


