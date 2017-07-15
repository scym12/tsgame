//---------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------
// main.ts 
//---------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------
import "./build/spine-canvas";
import * as tsSpine from "./scmSpine";
import * as ts2D from "./scm2D";

class GameManager {
    fileList : string[];

    setCharState(state) {
    }

    charIdle() {
    }
    
    charWalk() {
        
    }
    charAttack() {
        
    }

}

class myStage extends ts2D.Stage {
    scene:ts2D.Scene ;
    sceneBtn:ts2D.Scene ;

    debugRenderingBtn:ts2D.scmButton = new ts2D.scmButton();
    triangleRenderingBtn:ts2D.scmButton = new ts2D.scmButton();

    speedBtn0_25X:ts2D.scmButton = new ts2D.scmButton();
    speedBtn0_5X:ts2D.scmButton = new ts2D.scmButton();
    speedBtn1X:ts2D.scmButton = new ts2D.scmButton();
    speedBtn2X:ts2D.scmButton = new ts2D.scmButton();
    speedBtn4X:ts2D.scmButton = new ts2D.scmButton();
    timeScale:number = 1;


    InitData() {
        this.scene = new ts2D.Scene();
        this.AddScene(this.scene);
        this.sceneBtn = new ts2D.Scene();
        this.AddScene(this.sceneBtn);
    }

    InitAnimationButton() {
        if(this.sceneBtn.GetChildCount() > 0 || this.scmSp == null)
            return;

        let a = this.canvas.width;
        let b = this.canvas.height;
  
        var x = a - 300;
        var y = 10;
        var me = this;

        for(var key in this.scmSp.animArr) {
            let btn:ts2D.scmButton = new ts2D.scmButton();
            this.sceneBtn.AddSprite(btn.setFontSize(20).setText(key).setSize(200,30).setCallBackFunc(
                function() { 
                    let str = key;
                    stage.scmSp.traceEntry = stage.scmSp.state.setAnimation(0,btn.getText(),true);  
                    stage.scmSp.traceEntry.timeScale = me.timeScale;
                    // alpha : 1
                    // animationEnd : 0.533...
                    // delay
                    // mixTime : 0
                    // mixDuration : 0
                    /// timeScale : 1
                }).setLocation(x,y));
            y = y + 60;
        }

        y = 10;
        x = x - 250;
        for(var key in this.scmSp.skinArr) {
            let btn:ts2D.scmButton = new ts2D.scmButton();
            this.sceneBtn.AddSprite(btn.setFontSize(20).setText(key).setSize(200,30).setCallBackFunc(
                function() { 
                    let str = key;
                    stage.scmSp.skeleton.setSkinByName(btn.getText());
                }).setLocation(x,y));
            y = y + 60;
            
        }
    }

    UpdateRenderButton() {
        var me = this;
        if(me.scmSp == null) return;
        if(me.scmSp.skeletonRenderer.debugRendering != me.debugRenderingBtn.tagBool)
            me.scmSp.skeletonRenderer.debugRendering = me.debugRenderingBtn.tagBool;
        me.debugRenderingBtn.setText("debugRendering : " + me.scmSp.skeletonRenderer.debugRendering);

        if(me.scmSp.skeletonRenderer.triangleRendering != me.triangleRenderingBtn.tagBool)
            me.scmSp.skeletonRenderer.triangleRendering = me.triangleRenderingBtn.tagBool;

        me.triangleRenderingBtn.setText("triangleRendering : " + me.scmSp.skeletonRenderer.triangleRendering);
    }

    initSpineEx(fname:string) {
        this.sceneBtn.RemoveAllSprite();
        //this.RemoveScene(this.sceneBtn.mySceneNum);
        //this.sceneBtn = new Scene();
        //this.AddScene(this.sceneBtn);
        let me = this;
        let timeScale = 1;
        this.initSpine(fname, me.timeScale);


        this.scmSp.setLoadingCompleteCallBackFunc( function() { 
            let a = me.canvas.width;
            let b = me.canvas.height;            
            me.scmSp.skeleton.x = a/2;
            me.scmSp.skeleton.y = b - b/4;

         });



        


    }

    LoadSpineFileList() {
        this.scene.RemoveAllSprite();
 
        let x = 10;
        let y = 10;
        for (var key in manager.fileList) {   
            if(manager.fileList[key] && manager.fileList[key].length > 1)  
            {
                let sz = manager.fileList[key].length;
                let fname = manager.fileList[key].substr(0,sz-6);
                //console.log("FileList1 : [" + manager.fileList[key]+ "]");
                //console.log("FileList2 : " + manager.fileList[key].substr(0,sz-6));
                var me = this;
                this.scene.AddSprite((new ts2D.scmButton()).setFontSize(20).setText(fname).setSize(200,30).setCallBackFunc(function() { me.initSpineEx(fname); }).setLocation(x,y));
                y = y + 40;

            }
        }
        

        /////////////////////////////////////////////////////////////////////////////////
        // ETC Button 
        /////////////////////////////////////////////////////////////////////////////////

        let a = this.canvas.width - 600;
        y = 10;
        var me = this;

        this.scene.AddSprite(this.debugRenderingBtn.setFontSize(20).setText("debugRendering : off").setSize(300,30).setCallBackFunc(function() { 
            if(me.scmSp == null) return;
            if(me.debugRenderingBtn.tagBool == true)
                me.debugRenderingBtn.tagBool = false;
            else
                me.debugRenderingBtn.tagBool = true;
        }).setLocation(a/2+150,y));

        y = y + 35;
        this.scene.AddSprite(this.triangleRenderingBtn.setFontSize(20).setText("triangleRendering : off").setSize(300,30).setCallBackFunc(function() { 
            if(me.scmSp == null) return;
            if(me.triangleRenderingBtn.tagBool == true)
                me.triangleRenderingBtn.tagBool = false;
            else
                me.triangleRenderingBtn.tagBool = true;
        }).setLocation(a/2+150,y));        
        this.UpdateRenderButton();


        /////////////////////////////////////////////////////////////////////////////////
        // Speed Button 
        /////////////////////////////////////////////////////////////////////////////////
        y = 90;
        x = a/2 + 100;

        this.scene.AddSprite(this.speedBtn0_25X.setFontSize(20).setText("x4").setBtnUpColor('#9999aa').setSize(60,30).setCallBackFunc(function() { 
            me.timeScale = 0.25;
            if(me.scmSp != null && me.scmSp.traceEntry != null) me.scmSp.traceEntry.timeScale = me.timeScale;
        }).setLocation(x,y));
        x = x + 80
        this.scene.AddSprite(this.speedBtn0_5X.setFontSize(20).setText("x2").setBtnUpColor('#9999aa').setSize(60,30).setCallBackFunc(function() { 
            me.timeScale = 0.5;
            if(me.scmSp != null && me.scmSp.traceEntry != null) me.scmSp.traceEntry.timeScale = me.timeScale;
        }).setLocation(x,y));
        x = x + 80
        this.scene.AddSprite(this.speedBtn1X.setFontSize(20).setText("x1").setBtnUpColor('#9999aa').setSize(60,30).setCallBackFunc(function() { 
            me.timeScale = 1;
            if(me.scmSp != null && me.scmSp.traceEntry != null) me.scmSp.traceEntry.timeScale = me.timeScale;
        }).setLocation(x,y));
        x = x + 80
        this.scene.AddSprite(this.speedBtn2X.setFontSize(20).setText("0.5").setBtnUpColor('#9999aa').setSize(60,30).setCallBackFunc(function() { 
            me.timeScale = 2;
            if(me.scmSp != null && me.scmSp.traceEntry != null) me.scmSp.traceEntry.timeScale = me.timeScale;
        }).setLocation(x,y));
        x = x + 80
        this.scene.AddSprite(this.speedBtn4X.setFontSize(20).setText("0.25").setBtnUpColor('#9999aa').setSize(60,30).setCallBackFunc(function() { 
            me.timeScale = 4;
            if(me.scmSp != null && me.scmSp.traceEntry != null) me.scmSp.traceEntry.timeScale = me.timeScale;
        }).setLocation(x,y));
        x = x + 80

        
    }

    LoadSpine(fname : string) : void {


    }

    OnUpdateEx() : void {
        this.UpdateRenderButton();
        if(manager.fileList != null)
        {
            this.LoadSpineFileList();
            manager.fileList = null;
        }

        if(this.scmSp && this.scmSp.animArr != null) {
            this.InitAnimationButton();
        }
    }

}


var stage: myStage = new myStage(); 
var manager:GameManager = new GameManager();

stage.setCallBackTimeFunc( function() { stage.OnUpdateEx(); } );


window.onload = () => {
    var canvas: HTMLCanvasElement;
    canvas = <HTMLCanvasElement>document.getElementById('canvas');
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


function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                var allText2 = rawFile.response;
                var ret : string[] = allText.split("\n");
                //console.log(allText);
                //console.log(allText2);
                manager.fileList = ret ;
            }
        }
    }
    rawFile.send(null);
}

readTextFile("list.txt");

//----------------------------------------------------------------------------------------------------------------------------------------------











