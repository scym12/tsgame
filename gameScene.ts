/*
import { Point, SNode } from "./scmNode";
import { Sprite } from "./scmSprite";
*/

//////////////////////////////////////////////////////////////////////

class Point {
    nx = 0;
    ny = 0;
}

class SNode {
    loc : Point; 
    unique : Number;

    tag : Number;

    constructor() {
        this.loc = new Point();
    }

    getX() { return this.loc.nx; }
    getY() { return this.loc.ny; }

    setNumber(num) {
        this.unique = num;
    }
}


//////////////////////////////////////////////////////////////////////

class Sprite extends SNode {
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


class Stage {

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



class Scene {
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

// 숫자는 몇까지 되는가? 오버플로우되면? 해결책은? 


// Number는 왜 계산이 안되는건가? (계산도 안되는 숫자타입을 만든이유는 무엇인가?)
// var a = 10; 
// var b : Number = 10;
// 둘의 차이점은 ? 


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


class scmButton extends Sprite {
    imgUp : HTMLImageElement;
    imgDown : HTMLImageElement;
    btnState = 0;

    loadImage(name : String) {
        //console.log("scmbutton loadimage");
        super.loadImage(name);
        this.imgUp = this.img;
    }


    mouseDown(event: MouseEvent): void {  
        if(this.img && event.x > this.getX() && event.x < (this.getX() + this.img.width) 
            && event.y > this.getY() && event.y < (this.getY() + this.img.height)  )
                this.btnState = 1;
        if(this.imgDown && this.btnState == 1) 
            this.img = this.imgDown;

    }

    mouseUp(event: MouseEvent): void { 
        if(this.img && event.x > this.getX() && event.x < (this.getX() + this.img.width) 
            && event.y > this.getY() && event.y < (this.getY() + this.img.height)  )
            {
                this.OnClick();
            }

        if(this.imgUp && this.btnState == 1) {
            this.btnState = 0;
            this.img = this.imgUp;
        }
    }    

    setImageD(img : String) {
        this.imgDown = new Image();
        this.imgDown.onload = function() { }
        this.imgDown.src = img.toString();               
    }

    OnClick() {
        console.log("Good");
    }
}

/////////////////////////////////////////////////////////////////////////////




class exSprite extends Sprite {
    speed = 80;  
    tm : number;
    state = 0; // Idle, walk, run, attack 

    setSpeed(sp) { this.speed = sp; }
    ///////////////////////////// idle ///////////////////////////////////////////
    idle : HTMLImageElement [];
    idleIndex = 0;
    idleArrow = 1;

    setIdle(arr : String[])
    {
        this.tm = 0;
        this.idleArrow = 1;
        this.idle = new Array(arr.length);
        for(let i = 0; i< arr.length; i++) {
            //console.log("arr " + i + " : " + arr[i]);
            this.idle[i] = new Image();
            this.idle[i].onload = function() { }
            this.idle[i].src = arr[i].toString();            
        }
        //console.log(this.idle);
        this.idleIndex = 0;
    }


    private IdleProcess(tm) {
        if((this.idleIndex+1) >= this.idle.length) { this.idleArrow = -1; }
        if(this.idleIndex <= 0) this.idleArrow = 1;
        
        this.img = this.idle[this.idleIndex];
        let diff = tm - this.tm;
        if(diff > this.speed)
        {
            this.tm = tm;
            this.idleIndex = this.idleIndex + this.idleArrow;
        }
    }



    private WalkProcess(tm) {

    }

    private RunProcess(tm) {

    }

    private AttackProcess(tm) {

    }

    OnUpdate(ctx :CanvasRenderingContext2D,tm) : void {
        // IDLE
        this.IdleProcess(tm);

        super.OnUpdate(ctx,tm);
    }

    mouseDown(event: MouseEvent): void {       
    }    

    mouseUp(event: MouseEvent): void {       
    }    



}

var canvas: HTMLCanvasElement;
var ctx: CanvasRenderingContext2D;
var img: HTMLImageElement;
var x: number = 50;
var y: number = 50;


// 게임루프 
function gameLoop(): void {
    requestAnimationFrame(gameLoop);	// 해당 함수가 다시 호출됨.
    keyInput.inputLoop();

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 1280, 720);

    ctx.save();
    ctx.translate(x, y);
    ctx.drawImage(img, 0, 0, img.width, img.height);
    ctx.restore();
}


// Keyboard처리 클래스 
class cKeyboardInput {
    public keyCallback: { [keycode: number]: () => void; } = {};
    public keyDown: { [keycode: number]: boolean; } = {};
    constructor() {
        document.addEventListener('keydown', this.keyboardDown);
        document.addEventListener('keyup', this.keyboardUp);
    }

    public addKeycodeCallback = (keycode: number, f: () => void): void => {
        this.keyCallback[keycode] = f;
        this.keyDown[keycode] = false;
    }

    public keyboardDown = (event: KeyboardEvent): void => {
        if (this.keyCallback[event.keyCode] != null) {
            event.preventDefault();
        }
        this.keyDown[event.keyCode] = true;
    }

    public keyboardUp = (event: KeyboardEvent): void => {
        this.keyDown[event.keyCode] = false;
    }

    public inputLoop = (): void => {
        for (var key in this.keyDown) {
            var is_down: boolean = this.keyDown[key];

            if (is_down) {
                var callback: () => void = this.keyCallback[key];
                if (callback != null) {
                    callback();
                }
            }
        }
    }
}

function shipUp(): void {
    y -= 2;
}

function shipDown(): void {
    y += 2;
}

function shipLeft(): void {
    x -= 2;
}

function shipRight(): void {
    x += 2;
}

var keyInput: cKeyboardInput;


var sp : Sprite  = new Sprite();
//console.log(sp);



var stage: Stage = new Stage(); 

/*
function mouseDown(event: MouseEvent): void {
   var x: number = event.x;
   var y: number = event.y;

   console.log("down : " + x + ":" + y);
}

function mouseUp(event: MouseEvent): void {
   var x: number = event.x;
   var y: number = event.y;

   console.log("Up : " +  x + ":" + y);
}
*/


window.onload = () => {
    // img = <HTMLImageElement>document.getElementById('spaceship');
    canvas = <HTMLCanvasElement>document.getElementById('cnvs');
/*
    ctx = canvas.getContext("2d");
    keyInput = new cKeyboardInput();
    
    // PRESS LEFT ARROW OR 'A' KEY
    keyInput.addKeycodeCallback(37, shipLeft);
    keyInput.addKeycodeCallback(65, shipLeft);

    // PRESS UP ARROW OR 'W' KEY
    keyInput.addKeycodeCallback(38, shipUp);
    keyInput.addKeycodeCallback(87, shipUp);

    // PRESS RIGHT ARROW OR 'D' KEY
    keyInput.addKeycodeCallback(39, shipRight);
    keyInput.addKeycodeCallback(68, shipRight);

    // PRESS DOWN ARROW OR 'S' KEY
    keyInput.addKeycodeCallback(40, shipDown);
    keyInput.addKeycodeCallback(83, shipDown);

    gameLoop();
*/
    stage.setCanvas(canvas);
    stage.OnUpdate(0);



    canvas.addEventListener("mousedown", function(event: MouseEvent) { stage.mouseDown(event); }, false);
    canvas.addEventListener("mouseup", function(event: MouseEvent) { stage.mouseUp(event); }, false);

};


{
    var scene = new Scene();
    stage.AddScene(scene);

    let sprite = new exSprite();
    sprite.loadImage("./images/ship.png");
    scene.AddSprite(sprite);
    sprite.setLocation(50,50);

    var arr = new Array(10);
    for(let i=0;i<9;i++)
        arr[i] = "./images/BlueKnight_entity_000_Idle_00"+(i+1)+".png";
    arr[9]= "./images/BlueKnight_entity_000_Idle_010.png"; 

    sprite.setIdle(arr);


    let btn = new scmButton();
    btn.loadImage("./images/btnN.png");
    btn.setImageD("./images/btnD.png");
    scene.AddSprite(btn);
    btn.setLocation(250,50);

}


//var pt = new Point();
//var pt2 = new Point(1,2);



//console.log(pt.nx, pt2.nx);

//////////////////////////////////////////////////////////////////
/*
let : for() 문을 벗어나면 사라지는 변수
var : for() 문을 벗어나도 변수값이 존재함

function theDifference(){
    for(let emre = 0; emre < 10; emre++){
    // emre is only visible inside of this for()
    }
    console.log(emre);
// emre is NOT visible here.
}

function theDifference2(){
    for(var emre = 0; emre < 10; emre++){
    // emre is visible inside of this for()
    }
    console.log(emre);
// emre is visible here too.

}
*/
//////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////
// typescript는 Map없나?
//let my = new Map();
//my.set('a',1);
//my.set('b',2);

//let ret  = my.get('a');
//console.log(ret);
/////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////
/*
// 숫자계산이 잘 되네?? 노트북에서는 숫자계산이 안되었는데... 

let num1 : number = 10;
let num2 : number = 20;
let num3 : number;

num3 = num1 + num2; 
console.log(num3);

num3 = num3 + 1;
console.log(num3);
*/
/////////////////////////////////////////////////////////////////
