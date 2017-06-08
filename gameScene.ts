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


class exSprite extends Sprite {
    speed = 80;  
    tm : number;
    state = 0; // Idle, walk, attack , run

    setSpeed(sp) { this.speed = sp; }


    setAnimationImageArray(arr : String[], state) {
        let imgArray : HTMLImageElement [];

        this.tm = 0;
        imgArray = new Array(arr.length);
        if(state == 0)
        {
            this.idleArrow = 1;
            this.idle = imgArray;
            this.idleIndex = 0;
        }
        else if(state == 1)
        {
            this.walk = imgArray;
            this.walkIndex = 0;
        }
        else if(state == 2)
        {
            this.attack = imgArray;
            this.attackIndex = 0;
        }

        for(let i = 0; i< imgArray.length; i++) {
            imgArray[i] = new Image();
            imgArray[i].onload = function() { }
            imgArray[i].src = arr[i].toString();            
        }
    }

    ///////////////////////////// idle ///////////////////////////////////////////
    idle : HTMLImageElement [];
    idleIndex = 0;
    idleArrow = 1;
    idlePivot : Point = new Point();
    setIdlePivot(x,y) { this.idlePivot.nx = x; this.idlePivot.ny = y; }

    private IdleProcess(tm) {
        if((this.idleIndex+1) >= this.idle.length) { this.idleIndex = 0; }
        
        /*
        if((this.idleIndex+1) >= this.idle.length) { this.idleArrow = -1; }
        if(this.idleIndex <= 0) this.idleArrow = 1;
        */
        
        // console.log("idle : " + this.idleIndex);
        this.pivot.nx = this.idlePivot.nx;
        this.pivot.ny = this.idlePivot.ny;
        this.img = this.idle[this.idleIndex];
        let diff = tm - this.tm;
        if(diff > this.speed)
        {
            this.tm = tm;
            this.idleIndex = this.idleIndex + this.idleArrow;
        }
    }

    ///////////////////////////// walk ///////////////////////////////////////////
    walk : HTMLImageElement [];
    walkIndex = 0;
    walkPivot : Point = new Point();
    setWalkPivot(x,y) { this.walkPivot.nx = x; this.walkPivot.ny = y; }

    private WalkProcess(tm) {
        if((this.walkIndex+1) >= this.walk.length) { this.walkIndex = 0; }
        
        this.pivot.nx = this.walkPivot.nx;
        this.pivot.ny = this.walkPivot.ny;
        this.img = this.walk[this.walkIndex];
        let diff = tm - this.tm;
        if(diff > this.speed)
        {
            this.tm = tm;
            this.walkIndex = this.walkIndex + 1;
        }
    }

    ///////////////////////////// run  ///////////////////////////////////////////
    run : HTMLImageElement [];
    runIndex = 0;
    private RunProcess(tm) {

    }


    ///////////////////////////// attack ///////////////////////////////////////////
    attack : HTMLImageElement [];
    attackIndex = 0;
    attackPivot : Point = new Point();
    setAttackPivot(x,y) { this.attackPivot.nx = x; this.attackPivot.ny = y; }

    private AttackProcess(tm) {
        if((this.attackIndex+1) >= this.attack.length) { this.attackIndex = 0; this.state = 0; }

        this.pivot.nx = this.attackPivot.nx;
        this.pivot.ny = this.attackPivot.ny;        
        this.img = this.attack[this.attackIndex];
        let diff = tm - this.tm;
        if(diff > this.speed)
        {
            this.tm = tm;
            this.attackIndex = this.attackIndex + 1;
        }
    }


    OnUpdate(ctx :CanvasRenderingContext2D,tm) : void {        
        if(this.state == 0) 
            this.IdleProcess(tm);
        else if(this.state == 1)
            this.WalkProcess(tm);
        else if(this.state == 2)
            this.AttackProcess(tm);
        

        super.OnUpdate(ctx,tm);
    }

    mouseDown(event: MouseEvent): void {       
    }    

    mouseUp(event: MouseEvent): void {       
    }    

}


class GameManager {
    mChar : exSprite; 

    setCharState(state) {
        this.mChar.state = state;
    }

    charIdle() {
        this.mChar.state = 0;
        //this.setCharState(0);
    }
    
    charWalk() {
        this.mChar.state = 1;
        //this.setCharState(1);
        
    }
    charAttack() {
        this.mChar.state = 2;
        //this.setCharState(1);
        
    }

}


var stage: Stage = new Stage(); 
var manager:GameManager = new GameManager();

window.onload = () => {
    var canvas: HTMLCanvasElement;
    canvas = <HTMLCanvasElement>document.getElementById('cnvs');
    stage.setCanvas(canvas);
    stage.OnUpdate(0);

    canvas.addEventListener("mousedown", function(event: MouseEvent) { stage.mouseDown(event); }, false);
    canvas.addEventListener("mouseup", function(event: MouseEvent) { stage.mouseUp(event); }, false);

};


function gameInit() {
    var scene = new Scene();
    stage.AddScene(scene);


    let sprite = new exSprite();
    sprite.loadImage("./images/ship.png");
    scene.AddSprite(sprite);
    sprite.setLocation(50,50);

    var arr = new Array(11);
    for(let i=0;i<10;i++)
        arr[i] = "./images/BlueKnight_entity_000_Idle_00"+(i)+".png";
    arr[10]= "./images/BlueKnight_entity_000_Idle_010.png"; 
    sprite.setAnimationImageArray(arr,0);
    sprite.state = 0;
    sprite.setIdlePivot(79,62);

    var arrWalk = new Array(10);
    for(let i=0;i<10;i++)
        arrWalk[i] = "./images/BlueKnight_entity_000_walk_00"+(i)+".png";
    sprite.setAnimationImageArray(arrWalk,1);
    sprite.setWalkPivot(25,60);

    var arrAttack = new Array(10);
    for(let i=0;i<10;i++)
        arrAttack[i] = "./images/BlueKnight_entity_000_basic attack 1_00"+(i)+".png";
    sprite.setAnimationImageArray(arrAttack,2);
    sprite.setAttackPivot(0,0);


    manager.mChar = sprite;

    let btn = new scmButton();
//    btn.setText("한글 가나다라 테스트1234");
    btn.loadImage("./images/btnN.png");
    btn.setImageD("./images/btnD.png");
    scene.AddSprite(btn);
    btn.setLocation(500,50);

    let btn2 = new scmButton();
//    btn.setText("한글 가나다라 테스트1234");
    btn2.setText("Idle");
    btn2.setSize(200, 50);
    scene.AddSprite(btn2);
    btn2.setLocation(500,110);
    btn2.callBackFunc = function() { manager.charIdle(); }  ;

    let btn3 = new scmButton();
//    btn.setText("한글 가나다라 테스트1234");
    btn3.setText("Walk");
    btn3.setSize(200, 50);
    scene.AddSprite(btn3);
    btn3.setLocation(500,170);
    btn3.callBackFunc = function() { manager.charWalk(); }  ;

    {
        let btn = new scmButton();
    //    btn.setText("한글 가나다라 테스트1234");
        btn.setText("Attack");
        btn.setSize(200, 50);
        scene.AddSprite(btn);
        btn.setLocation(500,230);
        btn.callBackFunc = function() { manager.charAttack(); }  ;

    }

}


gameInit();

// 아래는 질문이 완료되면 지울것 
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

/*
    a : string;
    b : String;
    a , b 의 차이는?
*/