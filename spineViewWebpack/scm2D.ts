import * as tsSpine from "./scmSpine";

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
        return this;
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
    scmSp : tsSpine.scmSpine = null;
    private mNum  = 0;

    // default Scene
    private defaultScene : Scene = new Scene();
    getDefaultScene() { return this.defaultScene; }

    // Before OnUpdate
    callBackFunc : () => void = null;
    setCallBackTimeFunc(callBackFunc : () => void) { this.callBackFunc = callBackFunc; }

    constructor() {
        this.AddScene(this.defaultScene);
        this.OnUpdate(0);
    }

    initSpine(skName : string, timeScale? : number) {
        this.scmSp = new tsSpine.scmSpine();
        this.scmSp.setTimeScale(timeScale);
        this.scmSp.init(skName);
    }

    setCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");

        var me = this;
        this.canvas.addEventListener("mousedown", function(event: MouseEvent) { me.mouseDown(event); }, false);
        this.canvas.addEventListener("mouseup", function(event: MouseEvent) { me.mouseUp(event); }, false);
        
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
            if(this.scmSp == null)
                this.ctx.fillStyle = "#ffffff";
            else
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

        }
        var av = this;
        requestAnimationFrame(function(tm) { av.OnUpdate(tm); });	

    }

}



class SpriteList {
    private arr : Sprite[] = [];

    AddNode(sp : Sprite) {
        this.arr.push(sp);
    }

    DeleteNode(sp : Sprite) {
        for(var idx in this.arr) {
            if(this.arr[idx] == sp)
            {
                var ret = this.arr.splice(Number(idx),1);
                console.log(ret);
                console.log(this.arr);
                break;
            }
        }

    }
    GetNodeList() {
        return this.arr;
    }
}

class SpriteManager {
    arr: { [keycode: number]: SpriteList } = {};
    
    AddSprite(s : Sprite, num? : number) {
        if(num == null) num = 10;
        if(this.arr[num] == null)
        {
            let arrSub : SpriteList = new SpriteList();
            this.arr[num] = arrSub;     
            arrSub.AddNode(s);
        }
        else 
            this.arr[num].AddNode(s);

        return s;
    }

    RemoveSprite(s:Sprite) {
        for(var idx in this.arr) {
            this.arr[idx].DeleteNode(s);
        }
    }

    RemoveAllSprite() {
        this.arr = {};
    }

    Loop(callBackFunc : (s:Sprite) => void) {
        for(var idx in this.arr) {
            let arr : Sprite[] = this.arr[idx].GetNodeList();
            for(var idx2 in arr) {
                if(callBackFunc != null) 
                    callBackFunc(arr[idx2]);
            }
        }
    }

    GetChildCount(): number  {
        let cnt : number = 0;
        for(var idx in this.arr) {
            cnt = cnt + this.arr[idx].GetNodeList.length;
        }
        return cnt;
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

    // public mSprite: { [keycode: number]: Sprite; } = {};
    mSpriteManager : SpriteManager = new SpriteManager();
    
    private mNum  = 0;
    AddSprite(sprite : Sprite) {
        this.mNum = this.mNum + 1;
        sprite.setNumber(this.mNum);
        sprite.setParent(this);
        this.mSpriteManager.AddSprite(sprite);
    }

    RemoveSprite(sprite : Sprite) {
        this.mSpriteManager.RemoveSprite(sprite);
    }

    RemoveAllSprite() {
        this.mSpriteManager.RemoveAllSprite();
    }

    GetChildCount(): number  {
        return this.mSpriteManager.GetChildCount();
    }


    OnUpdate(ctx : CanvasRenderingContext2D, tm) : void {
        this.mSpriteManager.Loop( function(s:Sprite) {
            s.OnUpdate(ctx,tm);
        });
    }

    mouseDown(event: MouseEvent): void { 
        this.mSpriteManager.Loop( function(s:Sprite) {
            s.mouseDown(event);
        });
    }
    mouseUp(event: MouseEvent): void { 
        this.mSpriteManager.Loop( function(s:Sprite) {
            s.mouseUp(event);
        });   
    }
}


export class scmSpineAni extends Sprite {
    spine : tsSpine.scmSpine = null;

    setDebug(num : number) {
        this.spine.debugLine = num;
    }

    initSpine(skName : string, timeScale? : number) {
        this.spine = new tsSpine.scmSpine();
        this.spine.setTimeScale(timeScale);
        this.spine.init(skName);
    }

    OnUpdate(ctx :CanvasRenderingContext2D,tm) : void {
        var me = this;
        if(me.spine != null) {
            if(me.spine.skeleton) {
                this.spine.skeleton.x = this.getX();
                this.spine.skeleton.y = this.getY();       
            }
            me.spine.OnUpdate(ctx,tm);
        }
    }    

    setLocation(x,y) : scmSpineAni {
        this.loc.nx = x;
        this.loc.ny = y;
        //this.spine.skeleton.x = x;
        //this.spine.skeleton.y = y;
        return this;
    }

}

export class scmButton extends Sprite {
    imgUp : HTMLImageElement = null;
    imgDown : HTMLImageElement = null;
    btnState = 0;

    callBackFunc : () => void = null;

    text : string = null;
    width = 0;
    height = 0;
    font : string = "pt 굴림체";
    fontSize : number = 40;
    fontColor : string = "#ff0000";
    btnUpColor : string = "#8888ff";
    btnDownColor : string = "#4433ff";

    constructor(upimg? : string, downimg? : string) {
        super();

        if(upimg)
            this.loadImage(upimg);
        if(downimg)
            this.setImageD(downimg);
    }

    loadImage(name : String) {
        super.loadImage(name);
        this.imgUp = this.img;
        return this;
    }

    setImageD(img : String) {
        this.imgDown = new Image();
        this.imgDown.onload = function() { }
        this.imgDown.src = img.toString();               
    }    

    setFontSize(sz): scmButton { this.fontSize = sz; return this; }
    setText(text : string):scmButton {  this.text = text; return this; }
    getText():string { return this.text; }
    setSize(width , height):scmButton { this.width = width; this.height = height; return this; }
    setCallBackFunc(callBackFunc : () => void) { this.callBackFunc = callBackFunc; return this; }
    setBtnUpColor(str : string) { this.btnUpColor = str; return this; }
    setBtnDownColor(str : string) { this.btnDownColor = str; return this; }


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