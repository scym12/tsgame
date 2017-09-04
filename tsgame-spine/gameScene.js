"use strict";
exports.__esModule = true;
//import "./scmSprite.ts"
var scmSprite_1 = require("./scmSprite");
var GameManager = (function () {
    function GameManager() {
    }
    GameManager.prototype.setCharState = function (state) {
    };
    GameManager.prototype.charIdle = function () {
    };
    GameManager.prototype.charWalk = function () {
    };
    GameManager.prototype.charAttack = function () {
    };
    return GameManager;
}());
var stage = new scmSprite_1.Stage();
var manager = new GameManager();
window.onload = function () {
    var canvas;
    canvas = document.getElementById('cnvs');
    stage.setCanvas(canvas);
    stage.OnUpdate(0);
    canvas.addEventListener("mousedown", function (event) { stage.mouseDown(event); }, false);
    canvas.addEventListener("mouseup", function (event) { stage.mouseUp(event); }, false);
    console.log("window.onload");
};
function gameInit() {
    var scene = new scmSprite_1.Scene();
    stage.AddScene(scene);
    {
        var btn = new scmSprite_1.scmButton();
        //    btn.setText("한글 가나다라 테스트1234");
        btn.loadImage("./images/btnN.png");
        btn.setImageD("./images/btnD.png");
        scene.AddSprite(btn);
        btn.setLocation(500, 50);
        var btn2 = new scmSprite_1.scmButton();
        btn2.setText("Idle");
        btn2.setSize(200, 50);
        scene.AddSprite(btn2);
        btn2.setLocation(500, 110);
        btn2.callBackFunc = function () { };
        var btn3 = new scmSprite_1.scmButton();
        btn3.setText("Walk");
        btn3.setSize(200, 50);
        scene.AddSprite(btn3);
        btn3.setLocation(500, 170);
        btn3.callBackFunc = function () { };
    }
    {
        var btn = new scmSprite_1.scmButton();
        btn.setText("Attack");
        btn.setSize(200, 50);
        scene.AddSprite(btn);
        btn.setLocation(500, 230);
        btn.callBackFunc = function () { };
    }
    console.log("game init");
}
gameInit();
//var scmSp = new scmSpine();
//scmSp.init();
