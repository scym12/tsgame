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

    // Image button
    scene.AddSprite((new ts2D.scmButton('./images/btn1_up.png','./images/btn1_down.png')).setCallBackFunc(function() { console.log("Click Image Button");}).setLocation(300,100));        
}

InitData();

