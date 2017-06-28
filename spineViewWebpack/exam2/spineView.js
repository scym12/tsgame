"use strict";
exports.__esModule = true;
require("../build/spine-canvas");
var ts2D = require("../scm2D");
var stage = new ts2D.Stage();
window.onload = function () {
    var canvas = document.getElementById('canvas');
    stage.setCanvas(canvas);
};
function func() {
    console.log("Click!!!");
}
function InitData() {
    // Text Button
    var scene = stage.getDefaultScene();
    var btn = new ts2D.scmButton();
    btn.setFontSize(20);
    btn.setText("Click Me!");
    btn.setSize(100, 50);
    btn.setCallBackFunc(func);
    btn.setLocation(100, 100);
    scene.AddSprite(btn);
    //stage.initSpine("hero", 1);
    var spine = new ts2D.scmSpineAni();
    spine.initSpine("hero", 1);
    spine.setLocation(500, 500);
    scene.AddSprite(spine);
    var spine2 = new ts2D.scmSpineAni();
    spine2.initSpine("hero", 1);
    spine2.setLocation(800, 600);
    scene.AddSprite(spine2);
}
InitData();
