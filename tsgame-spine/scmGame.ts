//---------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------
// main.ts 
//---------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------
import  "./build/spine-canvas";

export class scmAnimationStateListener implements spine.AnimationStateListener2 
{
	start(entry: spine.TrackEntry) { }
	interrupt(entry: spine.TrackEntry) { }
	end(entry: spine.TrackEntry) { }
	dispose(entry: spine.TrackEntry) { }
	complete(entry: spine.TrackEntry) { 
        //console.log("Complete"); 
        if(entry.animation.name == "Attack")
            stage.scmSp.state.setAnimation(0,"Idle",true);
    }
	event(entry: spine.TrackEntry, event: spine.Event) { }

};

export class scmSpine { 
	lastFrameTime : number = Date.now() / 1000;
	canvas: HTMLCanvasElement = null;
	context: CanvasRenderingContext2D = null;
	assetManager: spine.AssetManager = null;
	skeleton: spine.Skeleton = null;
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

	eventListener:scmAnimationStateListener = null;

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
			//requestAnimationFrame( function() { me.render(); } );
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
		skeleton.setSkinByName(skin);

		// Create an AnimationState, and set the initial animation in looping mode.
		var animationState = new spine.AnimationState(new spine.AnimationStateData(skeleton.data));
		animationState.setAnimation(0, initialAnimation, true);
		animationState.addListener(me.eventListener);

		// Pack everything up and return to caller.
		return { skeleton: skeleton, state: animationState, bounds: bounds };
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








//---------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------
// scmSprite.ts 
//---------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------
export class Point {
    nx = 0;
    ny = 0;
}

export class SNode {
    loc : Point; 
    unique : Number;
    pivot : Point;

    tag : Number;   // User Define value 
    tagBool : boolean; // User Define Value

    visible : boolean = true;

    constructor() {
        this.loc = new Point();
        this.pivot = new Point();

        this.tagBool = true;
    }

    getX() { return this.loc.nx + this.pivot.nx; }
    getY() { return this.loc.ny + this.pivot.ny; }
    

    setNumber(num) {
        this.unique = num;
    }
}


//////////////////////////////////////////////////////////////////////

export class Sprite extends SNode {
    parent : Scene = null;
    setParent(p : Scene) { this.parent = p; }

    img : HTMLImageElement = null;

    loadImage(name : String) {
        //console.log("sprite loadImage");
        this.img = new Image();
        this.img.onload = function() {
            
        }
        this.img.src = name.toString();
    }

    setLocation(x,y) : Sprite {
        this.loc.nx = x;
        this.loc.ny = y;
        return this;
    }

    OnUpdate(ctx :CanvasRenderingContext2D,tm) : void {
        if(this.visible == false) return;
       // console.log("sprite onupdate" + ctx)
        if(ctx && this.img) {
            let x = this.getX() + (this.parent && this.parent.node.getX() || 0);
            let y = this.getY() + (this.parent && this.parent.node.getY() || 0);
            ctx.drawImage(this.img,x,y);
        }     
    }

    mouseDown(event: MouseEvent): void {       
        if(this.visible == false) return;
        var x: number = event.x;
        var y: number = event.y;

        console.log("Sprite down : " + x + ":" + y);            
    }    
    mouseUp(event: MouseEvent): void {       
        if(this.visible == false) return;
        var x: number = event.x;
        var y: number = event.y;

        console.log("Sprite Up : " + x + ":" + y);            
    }    
}


/////////////////////////////////////////////////////////////////////////////


export class Stage {

    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    scmSp : scmSpine = null;
    private mNum  = 0;

    callBackFunc : () => void = null;
    setCallBackTimeFunc(callBackFunc : () => void) { this.callBackFunc = callBackFunc; }


    constructor() {
        this.OnUpdate(0);
    }

    initSpine(skName : string) {
        this.scmSp = new scmSpine();
        this.scmSp.init(skName);
    }

    setCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
    }

    public mScene: { [keycode: number]: Scene; } = {};
    

    AddScene(scene:Scene) {
        this.mNum = this.mNum + 1;
        scene.setNumber(this.mNum);
        this.mScene[this.mNum] = scene;
        scene.setParent(this,this.mNum);
    }

    RemoveScene(num:number) {
        this.mScene[num] = null;
    }


    /////////// Mouse Event ////////////////////////////
    mouseDown(event: MouseEvent): void {
        for (var key in this.mScene) {           
            this.mScene[key].mouseDown(event);
        }        
    }

    mouseUp(event: MouseEvent): void {
        for (var key in this.mScene) {           
            this.mScene[key].mouseUp(event);
        }        
    }
    
    /////////////////////////////////////////////////////


    OnUpdate = function OnUpdate(tm) {
        if(this.callBackFunc != null)
            this.callBackFunc();

        //console.log("stage onupdate  " + tm + " " + typeof(tm));
        if(this.canvas) {            
            
            let a = this.canvas.width;
            let b = this.canvas.height;
            //console.log("canvas : " + a + ":" + b);
            //this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.ctx.scale(1,1);
            this.ctx.save();
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
//            this.ctx.fillStyle = "black";
//            this.ctx.fillRect(0, 0, 1280, 720);
            this.ctx.fillStyle = "#cccccc";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);            
            this.ctx.restore();
            
            if(this.scmSp != null)
                this.scmSp.OnUpdate();

            for (var key in this.mScene) {           
                var scene: Scene = this.mScene[key];
                if(scene)
                    scene.OnUpdate(this.ctx,tm);
            }

            var av = this;
            requestAnimationFrame(function(tm) { av.OnUpdate(tm); });	
        }

    }

}



export class Scene {
    parent : Stage = null;
    mySceneNum:number = 0; 
    setParent(p : Stage, num : number) { this.parent = p; this.mySceneNum = num; }

    node : SNode;

    constructor() {
        this.node = new SNode();
    }

    setNumber(num) {
        this.node.setNumber(num);
    }

    public mSprite: { [keycode: number]: Sprite; } = {};
    
    private mNum  = 0;
    AddSprite(sprite : Sprite) {
        this.mNum = this.mNum + 1;
        sprite.setNumber(this.mNum);
        this.mSprite[this.mNum] = sprite;
        sprite.setParent(this);
    }

    RemoveSprite(num) {
        this.mSprite[num] = null; 
    }

    RemoveAllSprite() {
        this.mSprite = {};
    }

    GetChildCount(): number  {
        let cnt = 0;
        for (var key in this.mSprite) {           
            cnt = cnt + 1;
        }
        return cnt;
    }


    OnUpdate(ctx : CanvasRenderingContext2D, tm) : void {
        //console.log("scene update"+ ctx);
        for (var key in this.mSprite) {           
            var sprite: Sprite = this.mSprite[key];
            sprite.OnUpdate(ctx,tm);
        }
    }

    mouseDown(event: MouseEvent): void { 
        for (var key in this.mSprite) {           
            this.mSprite[key].mouseDown(event);
        }        
    }
    mouseUp(event: MouseEvent): void { 
        for (var key in this.mSprite) {           
            this.mSprite[key].mouseUp(event);
        }        
    }
}



/////////////////////////////////////////////////////////////////////////////
export class scmButton extends Sprite {
    imgUp : HTMLImageElement;
    imgDown : HTMLImageElement;
    btnState = 0;

    callBackFunc : () => void = null;

    text : string = null;
    width = 0;
    height = 0;
    font : string = "pt 굴림체";
    fontSize : number = 40;
    fontColor : string = "#ff0000";
    btnUpColor : string = "#0000ff";
    btnDownColor : string = "#5555ff";

    loadImage(name : String) {
        super.loadImage(name);
        this.imgUp = this.img;
    }

    setFontSize(sz): scmButton { this.fontSize = sz; return this; }
    setText(text : string):scmButton {  this.text = text; return this; }
    getText():string { return this.text; }
    setSize(width , height):scmButton { this.width = width; this.height = height; return this; }
    setCallBackFunc(callBackFunc : () => void) { this.callBackFunc = callBackFunc; return this; }


    mouseDown(event: MouseEvent): void {  
        if(this.visible == false) return;
        let width = 0;
        let height = 0;
        if(this.text && this.text.length > 0) {
            width = this.width; 
            height = this.height;
        }
        else {
            width = this.img && this.img.width || 0; 
            height = this.img && this.img.height || 0;
        }
        

        if(event.x > this.getX() && event.x < (this.getX() + width) 
            && event.y > this.getY() && event.y < (this.getY() + height)  )
                this.btnState = 1;
        if(this.imgDown && this.btnState == 1) 
            this.img = this.imgDown;

    }

    mouseUp(event: MouseEvent): void { 
        if(this.visible == false) return;
        let width = 0;
        let height = 0;
        if(this.text && this.text.length > 0) {
            width = this.width; 
            height = this.height;
        }
        else {
            width = this.img && this.img.width || 0; 
            height = this.img && this.img.height || 0;
        }

        if(event.x > this.getX() && event.x < (this.getX() + width) 
            && event.y > this.getY() && event.y < (this.getY() + height)  )
            {
                this.OnClick();
            }
        
        if(this.btnState == 1) this.btnState = 0;
        if(this.imgUp && this.btnState == 0) this.img = this.imgUp;
    }    

    setImageD(img : String) {
        this.imgDown = new Image();
        this.imgDown.onload = function() { }
        this.imgDown.src = img.toString();               
    }

    OnUpdate(ctx :CanvasRenderingContext2D,tm) : void {
        if(this.visible == false) return;
        if(this.text && this.text.length > 0)
        {
            ctx.scale(1,1);
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);

            let font = ctx.font;
            let fStyle = ctx.fillStyle;

            let dx=0; let dy=0;
            if(this.btnState == 1) 
            {
                dx = 3; dy = 3;
            }
            //console.log("text is" + this.text);
            ctx.fillStyle = (this.btnState == 0 ) ? this.btnUpColor : this.btnDownColor;
            ctx.fillRect(this.getX() + dx, this.getY() + dy, this.width, this.height);

            let x = this.width / 2;
            let y = this.height / 2;
            

            ctx.font = this.fontSize + this.font;
            ctx.fillStyle = this.fontColor;
            ctx.textAlign = "center";
            ctx.fillText(this.text, this.getX() + x + dx,this.getY() + y + (this.fontSize/2) + dy,this.width);

            ctx.font = font;
            ctx.fillStyle = fStyle;   

		    ctx.restore();


        }
        else
            super.OnUpdate(ctx,tm);
    }    

    OnClick() {
        if(this.visible == false) return;
        if(this.callBackFunc != null) 
            this.callBackFunc();
        //console.log("Good" + this.unique);
    }
}

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


class GameManager {
    fileList : string[];

    setCharState(state) {
    }

    charIdle() {
    }
    
    charWalk() {
        
    }
    charAttack() {
        
    }

}

class myStage extends Stage {
    scene:Scene ;
    sceneBtn:Scene ;

    debugRenderingBtn:scmButton = new scmButton();
    triangleRenderingBtn:scmButton = new scmButton();

    InitData() {
        this.scene = new Scene();
        this.AddScene(this.scene);
        this.sceneBtn = new Scene();
        this.AddScene(this.sceneBtn);
    }

    InitAnimationButton() {
        if(this.sceneBtn.GetChildCount() > 0 || this.scmSp == null)
            return;

        let a = this.canvas.width;
        let b = this.canvas.height;
  
        var x = a - 300;
        var y = 10;
        var me = this;

        for(var key in this.scmSp.animArr) {
            let btn:scmButton = new scmButton();
            this.sceneBtn.AddSprite(btn.setFontSize(20).setText(key).setSize(200,30).setCallBackFunc(
                function() { 
                    let str = key;
                    stage.scmSp.state.setAnimation(0,btn.getText(),true);  
                }).setLocation(x,y));
            y = y + 60;
        }

        y = 10;
        x = x - 250;
        for(var key in this.scmSp.skinArr) {
            let btn:scmButton = new scmButton();
            this.sceneBtn.AddSprite(btn.setFontSize(20).setText(key).setSize(200,30).setCallBackFunc(
                function() { 
                    let str = key;
                    stage.scmSp.skeleton.setSkinByName(btn.getText());
                }).setLocation(x,y));
            y = y + 60;
            
        }
    }

    UpdateRenderButton() {
        var me = this;
        if(me.scmSp == null) return;
        if(me.scmSp.skeletonRenderer.debugRendering != me.debugRenderingBtn.tagBool )
            me.scmSp.skeletonRenderer.debugRendering = me.debugRenderingBtn.tagBool;
        me.debugRenderingBtn.setText("debugRendering : " + me.scmSp.skeletonRenderer.debugRendering);

        if(me.scmSp.skeletonRenderer.triangleRendering != me.triangleRenderingBtn.tagBool)
            me.scmSp.skeletonRenderer.triangleRendering = me.triangleRenderingBtn.tagBool;

        me.triangleRenderingBtn.setText("triangleRendering : " + me.scmSp.skeletonRenderer.triangleRendering);
    }

    initSpineEx(fname:string) {
        this.sceneBtn.RemoveAllSprite();
        //this.RemoveScene(this.sceneBtn.mySceneNum);
        //this.sceneBtn = new Scene();
        //this.AddScene(this.sceneBtn);

        this.initSpine(fname);
    }

    LoadSpineFileList() {
        this.scene.RemoveAllSprite();
 
        let x = 10;
        let y = 10;
        for (var key in manager.fileList) {   
            if(manager.fileList[key] && manager.fileList[key].length > 1)  
            {
                let sz = manager.fileList[key].length;
                let fname = manager.fileList[key].substr(0,sz-6);
                //console.log("FileList1 : [" + manager.fileList[key]+ "]");
                //console.log("FileList2 : " + manager.fileList[key].substr(0,sz-6));
                var me = this;
                this.scene.AddSprite((new scmButton()).setFontSize(20).setText(fname).setSize(200,30).setCallBackFunc(function() { me.initSpineEx(fname); }).setLocation(x,y));
                y = y + 40;

            }
        }
        

        /////////////////////////////////////////////////////////////////////////////////
        // ETC Button 
        /////////////////////////////////////////////////////////////////////////////////

        let a = this.canvas.width - 400;
        y = 10;
        var me = this;

        //var debugRenderingBtn:scmButton = new scmButton();
        //var triangleRenderingBtn:scmButton = new scmButton();

        this.scene.AddSprite(this.debugRenderingBtn.setFontSize(20).setText("debugRendering : off").setSize(300,30).setCallBackFunc(function() { 
            if(me.scmSp == null) return;
            if(me.debugRenderingBtn.tagBool == true)
                me.debugRenderingBtn.tagBool = false;
            else
                me.debugRenderingBtn.tagBool = true;
        }).setLocation(a/2+150,y));

        y = y + 35;
        this.scene.AddSprite(this.triangleRenderingBtn.setFontSize(20).setText("triangleRendering : off").setSize(300,30).setCallBackFunc(function() { 
            if(me.scmSp == null) return;
            if(me.triangleRenderingBtn.tagBool == true)
                me.triangleRenderingBtn.tagBool = false;
            else
                me.triangleRenderingBtn.tagBool = true;
        }).setLocation(a/2+150,y));
        
        this.UpdateRenderButton();
    }

    LoadSpine(fname : string) : void {


    }

    OnUpdateEx() : void {
        this.UpdateRenderButton();
        if(manager.fileList != null)
        {
            this.LoadSpineFileList();
            manager.fileList = null;
        }

        if(this.scmSp && this.scmSp.animArr != null) {
            this.InitAnimationButton();
        }

        if(this.scmSp)
        {

        }
    }

}


var stage: myStage = new myStage(); 
var manager:GameManager = new GameManager();

stage.setCallBackTimeFunc( function() { stage.OnUpdateEx(); } );


window.onload = () => {
    var canvas: HTMLCanvasElement;
    canvas = <HTMLCanvasElement>document.getElementById('canvas');
    stage.setCanvas(canvas);
    stage.OnUpdate(0);

    canvas.addEventListener("mousedown", function(event: MouseEvent) { stage.mouseDown(event); }, false);
    canvas.addEventListener("mouseup", function(event: MouseEvent) { stage.mouseUp(event); }, false);

    console.log("window.onload");

};


function gameInit() {
    stage.InitData();

    /*
    var scene = new Scene();
    stage.AddScene(scene);
    var x = 700;
    var y = 110;
    {
        let btn2 = new scmButton();
        btn2.setText("Idle");
        btn2.setSize(200, 50);
        scene.AddSprite(btn2);
        btn2.setLocation(x,y);
        btn2.callBackFunc = function() { stage.scmSp.state.setAnimation(0,"Idle",true); }  ;

        let btn3 = new scmButton();
        btn3.setText("Walk");
        btn3.setSize(200, 50);
        scene.AddSprite(btn3);
        btn3.setLocation(x,y+60);
        btn3.callBackFunc = function() { stage.scmSp.state.setAnimation(0,"Walk",true); }  ;
    }

    {
        let btn = new scmButton();
        btn.setText("Attack");
        btn.setSize(200, 50);
        scene.AddSprite(btn);
        btn.setLocation(x,y+120);
        btn.callBackFunc = function() { stage.scmSp.state.setAnimation(0,"Attack",false); }  ;

    }

    scene.AddSprite((new scmButton()).setText("Run").setSize(200,50).setCallBackFunc(function() { stage.scmSp.state.setAnimation(0,"Run",true);    }).setLocation(x,y+180));
    scene.AddSprite((new scmButton()).setText("Crouch").setSize(200,50).setCallBackFunc(function() { stage.scmSp.state.setAnimation(0,"Crouch",true);    }).setLocation(x,y+240));
    scene.AddSprite((new scmButton()).setText("Jump").setSize(200,50).setCallBackFunc(function() { stage.scmSp.state.setAnimation(0,"Jump",true);    }).setLocation(x,y+300));

    console.log("game init");
    */
    // stage.initSpine();
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


function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                var allText2 = rawFile.response;
                var ret : string[] = allText.split("\n");
                //console.log(allText);
                //console.log(allText2);
                manager.fileList = ret ;
            }
        }
    }
    rawFile.send(null);
}

readTextFile("list.txt");

//----------------------------------------------------------------------------------------------------------------------------------------------











