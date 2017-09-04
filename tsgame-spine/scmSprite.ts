
//////////////////////////////////////////////////////////////////////

export class Point {
    nx = 0;
    ny = 0;
}

export class SNode {
    loc : Point; 
    unique : Number;
    pivot : Point;

    tag : Number;

    constructor() {
        this.loc = new Point();
        this.pivot = new Point();
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

    setLocation(x,y) {
        this.loc.nx = x;
        this.loc.ny = y;
    }

    OnUpdate(ctx :CanvasRenderingContext2D,tm) : void {
       // console.log("sprite onupdate" + ctx)
        if(ctx && this.img) {
            let x = this.getX() + (this.parent && this.parent.node.getX() || 0);
            let y = this.getY() + (this.parent && this.parent.node.getY() || 0);
            ctx.drawImage(this.img,x,y);
        }     
    }

    mouseDown(event: MouseEvent): void {       
        var x: number = event.x;
        var y: number = event.y;

        console.log("Sprite down : " + x + ":" + y);            
    }    
    mouseUp(event: MouseEvent): void {       
        var x: number = event.x;
        var y: number = event.y;

        console.log("Sprite Up : " + x + ":" + y);            
    }    
}


/////////////////////////////////////////////////////////////////////////////


export class Stage {

    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    private mNum  = 0;

    constructor() {
        this.OnUpdate(0);
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
        scene.setParent(this);
    }

    RemoveScene() {
        
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
        
        //console.log("stage onupdate  " + tm + " " + typeof(tm));
        if(this.canvas) {
            this.ctx.fillStyle = "black";
            this.ctx.fillRect(0, 0, 1280, 720);

            var av = this;
            requestAnimationFrame(function(tm) { av.OnUpdate(tm); });	

            for (var key in this.mScene) {           
                var scene: Scene = this.mScene[key];
                scene.OnUpdate(this.ctx,tm);
            }
        }

    }

}



export class Scene {
    parent : Stage = null; 
    setParent(p : Stage) { this.parent = p; }

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

// ���ڴ� ����� �Ǵ°�? �����÷ο�Ǹ�? �ذ�å��? 


// Number�� �� ����� �ȵǴ°ǰ�? (��굵 �ȵǴ� ����Ÿ���� ���������� �����ΰ�?)
// var a = 10; 
// var b : Number = 10;
// ���� �������� ? 


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
    font : string = "40pt 굴림체";
    fontColor : string = "#ff0000";
    btnUpColor : string = "#0000ff";
    btnDownColor : string = "#5555ff";

    loadImage(name : String) {
        super.loadImage(name);
        this.imgUp = this.img;
    }

    setText(text : string) {  this.text = text;  }
    setSize(width , height) { this.width = width; this.height = height; }


    mouseDown(event: MouseEvent): void {  
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
        if(this.text && this.text.length > 0)
        {
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
            

            ctx.font = this.font;
            ctx.fillStyle = this.fontColor;
            ctx.fillText(this.text, this.getX() + x + dx,this.getY() + y + 20 + dy,this.width);
            ctx.textAlign = "center";

            ctx.font = font;
            ctx.fillStyle = fStyle;            
        }
        else
            super.OnUpdate(ctx,tm);
    }    

    OnClick() {
        if(this.callBackFunc != null) 
            this.callBackFunc();
        //console.log("Good" + this.unique);
    }
}

/////////////////////////////////////////////////////////////////////////////
