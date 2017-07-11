"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
//---------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------
// main.ts 
//---------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------
require("./build/spine-canvas");
var ts2D = require("./scm2D");
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
var myStage = (function (_super) {
    __extends(myStage, _super);
    function myStage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.debugRenderingBtn = new ts2D.scmButton();
        _this.triangleRenderingBtn = new ts2D.scmButton();
        _this.speedBtn0_25X = new ts2D.scmButton();
        _this.speedBtn0_5X = new ts2D.scmButton();
        _this.speedBtn1X = new ts2D.scmButton();
        _this.speedBtn2X = new ts2D.scmButton();
        _this.speedBtn4X = new ts2D.scmButton();
        _this.timeScale = 1;
        return _this;
    }
    myStage.prototype.InitData = function () {
        this.scene = new ts2D.Scene();
        this.AddScene(this.scene);
        this.sceneBtn = new ts2D.Scene();
        this.AddScene(this.sceneBtn);
    };
    myStage.prototype.InitAnimationButton = function () {
        if (this.sceneBtn.GetChildCount() > 0 || this.scmSp == null)
            return;
        var a = this.canvas.width;
        var b = this.canvas.height;
        var x = a - 300;
        var y = 10;
        var me = this;
        var _loop_1 = function () {
            var btn = new ts2D.scmButton();
            this_1.sceneBtn.AddSprite(btn.setFontSize(20).setText(key).setSize(200, 30).setCallBackFunc(function () {
                var str = key;
                stage.scmSp.traceEntry = stage.scmSp.state.setAnimation(0, btn.getText(), true);
                stage.scmSp.traceEntry.timeScale = me.timeScale;
                // alpha : 1
                // animationEnd : 0.533...
                // delay
                // mixTime : 0
                // mixDuration : 0
                /// timeScale : 1
            }).setLocation(x, y));
            y = y + 60;
        };
        var this_1 = this;
        for (var key in this.scmSp.animArr) {
            _loop_1();
        }
        y = 10;
        x = x - 250;
        var _loop_2 = function () {
            var btn = new ts2D.scmButton();
            this_2.sceneBtn.AddSprite(btn.setFontSize(20).setText(key).setSize(200, 30).setCallBackFunc(function () {
                var str = key;
                stage.scmSp.skeleton.setSkinByName(btn.getText());
            }).setLocation(x, y));
            y = y + 60;
        };
        var this_2 = this;
        for (var key in this.scmSp.skinArr) {
            _loop_2();
        }
    };
    myStage.prototype.UpdateRenderButton = function () {
        var me = this;
        if (me.scmSp == null)
            return;
        if (me.scmSp.skeletonRenderer.debugRendering != me.debugRenderingBtn.tagBool)
            me.scmSp.skeletonRenderer.debugRendering = me.debugRenderingBtn.tagBool;
        me.debugRenderingBtn.setText("debugRendering : " + me.scmSp.skeletonRenderer.debugRendering);
        if (me.scmSp.skeletonRenderer.triangleRendering != me.triangleRenderingBtn.tagBool)
            me.scmSp.skeletonRenderer.triangleRendering = me.triangleRenderingBtn.tagBool;
        me.triangleRenderingBtn.setText("triangleRendering : " + me.scmSp.skeletonRenderer.triangleRendering);
    };
    myStage.prototype.initSpineEx = function (fname) {
        this.sceneBtn.RemoveAllSprite();
        //this.RemoveScene(this.sceneBtn.mySceneNum);
        //this.sceneBtn = new Scene();
        //this.AddScene(this.sceneBtn);
        var me = this;
        var timeScale = 1;
        this.initSpine(fname, me.timeScale);
        this.scmSp.setLoadingCompleteCallBackFunc(function () { });
    };
    myStage.prototype.LoadSpineFileList = function () {
        this.scene.RemoveAllSprite();
        var x = 10;
        var y = 10;
        var _loop_3 = function () {
            if (manager.fileList[key] && manager.fileList[key].length > 1) {
                var sz = manager.fileList[key].length;
                var fname_1 = manager.fileList[key].substr(0, sz - 6);
                //console.log("FileList1 : [" + manager.fileList[key]+ "]");
                //console.log("FileList2 : " + manager.fileList[key].substr(0,sz-6));
                me = this_3;
                this_3.scene.AddSprite((new ts2D.scmButton()).setFontSize(20).setText(fname_1).setSize(200, 30).setCallBackFunc(function () { me.initSpineEx(fname_1); }).setLocation(x, y));
                y = y + 40;
            }
        };
        var this_3 = this, me;
        for (var key in manager.fileList) {
            _loop_3();
        }
        /////////////////////////////////////////////////////////////////////////////////
        // ETC Button 
        /////////////////////////////////////////////////////////////////////////////////
        var a = this.canvas.width - 600;
        y = 10;
        var me = this;
        this.scene.AddSprite(this.debugRenderingBtn.setFontSize(20).setText("debugRendering : off").setSize(300, 30).setCallBackFunc(function () {
            if (me.scmSp == null)
                return;
            if (me.debugRenderingBtn.tagBool == true)
                me.debugRenderingBtn.tagBool = false;
            else
                me.debugRenderingBtn.tagBool = true;
        }).setLocation(a / 2 + 150, y));
        y = y + 35;
        this.scene.AddSprite(this.triangleRenderingBtn.setFontSize(20).setText("triangleRendering : off").setSize(300, 30).setCallBackFunc(function () {
            if (me.scmSp == null)
                return;
            if (me.triangleRenderingBtn.tagBool == true)
                me.triangleRenderingBtn.tagBool = false;
            else
                me.triangleRenderingBtn.tagBool = true;
        }).setLocation(a / 2 + 150, y));
        this.UpdateRenderButton();
        /////////////////////////////////////////////////////////////////////////////////
        // Speed Button 
        /////////////////////////////////////////////////////////////////////////////////
        y = 90;
        x = a / 2 + 100;
        this.scene.AddSprite(this.speedBtn0_25X.setFontSize(20).setText("x4").setSize(60, 30).setCallBackFunc(function () {
            me.timeScale = 0.25;
            if (me.scmSp != null && me.scmSp.traceEntry != null)
                me.scmSp.traceEntry.timeScale = me.timeScale;
        }).setLocation(x, y));
        x = x + 80;
        this.scene.AddSprite(this.speedBtn0_5X.setFontSize(20).setText("x2").setSize(60, 30).setCallBackFunc(function () {
            me.timeScale = 0.5;
            if (me.scmSp != null && me.scmSp.traceEntry != null)
                me.scmSp.traceEntry.timeScale = me.timeScale;
        }).setLocation(x, y));
        x = x + 80;
        this.scene.AddSprite(this.speedBtn1X.setFontSize(20).setText("x1").setSize(60, 30).setCallBackFunc(function () {
            me.timeScale = 1;
            if (me.scmSp != null && me.scmSp.traceEntry != null)
                me.scmSp.traceEntry.timeScale = me.timeScale;
        }).setLocation(x, y));
        x = x + 80;
        this.scene.AddSprite(this.speedBtn2X.setFontSize(20).setText("0.5").setSize(60, 30).setCallBackFunc(function () {
            me.timeScale = 2;
            if (me.scmSp != null && me.scmSp.traceEntry != null)
                me.scmSp.traceEntry.timeScale = me.timeScale;
        }).setLocation(x, y));
        x = x + 80;
        this.scene.AddSprite(this.speedBtn4X.setFontSize(20).setText("0.25").setSize(60, 30).setCallBackFunc(function () {
            me.timeScale = 4;
            if (me.scmSp != null && me.scmSp.traceEntry != null)
                me.scmSp.traceEntry.timeScale = me.timeScale;
        }).setLocation(x, y));
        x = x + 80;
    };
    myStage.prototype.LoadSpine = function (fname) {
    };
    myStage.prototype.OnUpdateEx = function () {
        this.UpdateRenderButton();
        if (manager.fileList != null) {
            this.LoadSpineFileList();
            manager.fileList = null;
        }
        if (this.scmSp && this.scmSp.animArr != null) {
            this.InitAnimationButton();
        }
    };
    return myStage;
}(ts2D.Stage));
var stage = new myStage();
var manager = new GameManager();
stage.setCallBackTimeFunc(function () { stage.OnUpdateEx(); });
window.onload = function () {
    var canvas;
    canvas = document.getElementById('canvas');
    stage.setCanvas(canvas);
    console.log("window.onload");
};
function gameInit() {
    stage.InitData();
}
gameInit();
//----------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------
function readTextFile(file) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;
                var allText2 = rawFile.response;
                var ret = allText.split("\n");
                //console.log(allText);
                //console.log(allText2);
                manager.fileList = ret;
            }
        }
    };
    rawFile.send(null);
}
readTextFile("list.txt");
//----------------------------------------------------------------------------------------------------------------------------------------------
