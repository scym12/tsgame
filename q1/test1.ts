import { test1 } from "./test2";


export class test2 {
    func() {
        var a : test1 = new test1();
        a.func();

        console.log("test1");
    }
}

var val = new test2();
val.func();