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
    // entry:spine.TrackEntry = null;    
    private mNum  = 0;

    // Before OnUpdate
    callBackFunc : () => void = null;
    setCallBackTimeFunc(callBackFunc : () => void) { this.callBackFunc = callBackFunc; }


    constructor() {
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



export class scmButton extends Sprite {
    imgUp : HTMLImageElement;
    imgDown : HTMLImageElement;
    btnState = 0;

    callBackFunc : () => void = null;

    text : string = null;
    width = 0;
    height = 0;
    font : string = "pt ±¼¸²Ã¼";
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