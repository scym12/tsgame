import "../build/spine-canvas";
import * as tsSpine from "../scmSpine";
import * as ts2D from "../scm2D";

var stage: ts2D.Stage = new ts2D.Stage(); 

window.onload = () => {
    var canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas');
    stage.setCanvas(canvas);
};

function func() {
    console.log("Click!!!");
}

function  InitData() {
    // Text Button
    var scene : ts2D.Scene = stage.getDefaultScene();
    var btn : ts2D.scmButton = new ts2D.scmButton();
    btn.setFontSize(20);
    btn.setText("Click Me!");
    btn.setSize(100,50);
    btn.setCallBackFunc(func);
    btn.setLocation(100,100);
    scene.AddSprite(btn);

    //stage.initSpine("hero", 1);

    var spine = new ts2D.scmSpineAni();
    spine.initSpine("hero",1);
    spine.setLocation(500,500);
    scene.AddSprite(spine);
    
    var spine2 = new ts2D.scmSpineAni();
    spine2.initSpine("hero",1);
    spine2.setLocation(800,600);
    scene.AddSprite(spine2);
    
}

InitData();

