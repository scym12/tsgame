class Sprite {
    constructor(val : number) {
        this.x = val;
    }
    x : number = 10;
    func() {
        console.log("x = " + this.x);
    }
}

var arrTest : string[] = [];

arrTest[1] = "abc";
console.log(arrTest[1]);

// var arr : [number, Sprite];
// var arr : Sprite[] = {};
// var arrSub: {[keycode: number]: Sprite; } = {};
// mScene: { [keycode: number]: Scene; } = {};

class scmList {
    constructor() {

    }
    arr : Sprite[] = [];

    AddNode(sp : Sprite) {
        this.arr.push(sp);
    }

    GetNodeList() {
        return this.arr;
    }
}

var arr: { [keycode: number]: scmList } = {};
    

function AddSprite(s : Sprite, num? : number) {
    if(num == null) num = 10;
    if(arr[num] == null)
    {
        let arrSub : scmList = new scmList();
        arr[num] = arrSub;     
        arrSub.AddNode(s);
    }
    else 
        arr[num].AddNode(s);
}

AddSprite(new Sprite(100), 10);
AddSprite(new Sprite(1120), 77);
AddSprite(new Sprite(150), 5);
AddSprite(new Sprite(120), 7);
AddSprite(new Sprite(15), 15);
AddSprite(new Sprite(300), 7);
AddSprite(new Sprite(1234), 77);


for(var idx in arr) {
    //console.log("===> " +idx);
    //console.log(arr[idx]);
    for(var idx2 in arr[idx].arr) {
        console.log(idx + ":" + idx2);
        arr[idx].arr[idx2].func();
    }

}
