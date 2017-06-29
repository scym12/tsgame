class Sprite {
    constructor(val : number) {
        this.x = val;
    }
    x : number = 10;
    func() {
        console.log("x = " + this.x);
    }
}

/*
var arrTest : string[] = [];

arrTest[1] = "abc";
console.log(arrTest[1]);
*/

// var arr : [number, Sprite];
// var arr : Sprite[] = {};
// var arrSub: {[keycode: number]: Sprite; } = {};
// mScene: { [keycode: number]: Scene; } = {};

class SpriteList {
    private arr : Sprite[] = [];

    AddNode(sp : Sprite) {
        this.arr.push(sp);
    }

    DeleteNode(sp : Sprite) {
        for(var idx in this.arr) {
            if(this.arr[idx] == sp)
            {
                var ret = this.arr.splice(Number(idx),1);
                console.log(ret);
                console.log(this.arr);
                break;
            }
        }

    }
    GetNodeList() {
        return this.arr;
    }
}


class SpriteManager {
    arr: { [keycode: number]: SpriteList } = {};
    
    AddSprite(s : Sprite, num? : number) {
        if(num == null) num = 10;
        if(this.arr[num] == null)
        {
            let arrSub : SpriteList = new SpriteList();
            this.arr[num] = arrSub;     
            arrSub.AddNode(s);
        }
        else 
            this.arr[num].AddNode(s);

        return s;
    }

    RemoveSprite(s:Sprite) {
        for(var idx in this.arr) {
            this.arr[idx].DeleteNode(s);
        }
    }

    RemoveAllSprite() {
        this.arr = {};
    }

    LoopManager(callBackFunc : (s:Sprite) => void) {
        for(var idx in this.arr) {
            console.log("===> " +idx);
            console.log(this.arr[idx]);

            let arr : Sprite[] = this.arr[idx].GetNodeList();
            for(var idx2 in arr) {
                //console.log(this.arr[idx]);
                //console.log(idx + ":" + idx2);
                //this.arr[idx].arr[idx2].func();
                if(callBackFunc != null) 
                    callBackFunc(arr[idx2]);

            }

        }

    }

}

var manager : SpriteManager = new SpriteManager();    

manager.AddSprite(new Sprite(100), 10);
manager.AddSprite(new Sprite(1120), 77);
manager.AddSprite(new Sprite(150), 5);
manager.AddSprite(new Sprite(120), 7);
manager.AddSprite(new Sprite(15), 15);
var sp : Sprite = manager.AddSprite(new Sprite(300), 7);
manager.AddSprite(new Sprite(125), 7);
manager.AddSprite(new Sprite(129), 7);
manager.AddSprite(new Sprite(320), 7);
manager.AddSprite(new Sprite(1234), 77);


manager.LoopManager(function() { });

console.log("===============");
manager.RemoveSprite(sp);