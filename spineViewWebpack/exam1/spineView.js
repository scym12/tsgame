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
    var scene = stage.getDefaultScene();
    var btn = new ts2D.scmButton();
    btn.setFontSize(20);
    btn.setText("Click Me!");
    btn.setSize(100, 50);
    btn.setCallBackFunc(func);
    btn.setLocation(100, 100);
    scene.AddSprite(btn);
    scene.AddSprite((new ts2D.scmButton('./images/btn1_up.png', './images/btn1_down.png')).setCallBackFunc(function () { console.log("Click Image Button"); }).setLocation(300, 100));
}
InitData();
