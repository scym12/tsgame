//import "./main.ts"
import { scmAnimationStateListener, scmSpine } from "./main"

//import "./scmSprite.ts"
import { Sprite,Point,Stage,Scene,scmButton } from "./scmSprite";



class GameManager {

    setCharState(state) {
    }

    charIdle() {
    }
    
    charWalk() {
        
    }
    charAttack() {
        
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

    {
        let btn = new scmButton();
    //    btn.setText("한글 가나다라 테스트1234");
        btn.loadImage("./images/btnN.png");
        btn.setImageD("./images/btnD.png");
        scene.AddSprite(btn);
        btn.setLocation(500,50);

        let btn2 = new scmButton();
        btn2.setText("Idle");
        btn2.setSize(200, 50);
        scene.AddSprite(btn2);
        btn2.setLocation(500,110);
        btn2.callBackFunc = function() {  }  ;

        let btn3 = new scmButton();
        btn3.setText("Walk");
        btn3.setSize(200, 50);
        scene.AddSprite(btn3);
        btn3.setLocation(500,170);
        btn3.callBackFunc = function() {  }  ;
    }

    {
        let btn = new scmButton();
        btn.setText("Attack");
        btn.setSize(200, 50);
        scene.AddSprite(btn);
        btn.setLocation(500,230);
        btn.callBackFunc = function() {  }  ;

    }

}

gameInit();

var scmSp = new scmSpine();
scmSp.init();