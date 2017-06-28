// Q1 : ts에서 다른 ts를 import를 어떻게 하나? (여러가지 테스트를 통해서 아래와 같이 import "./test2.ts" 를 사용했는데 맞는 사용법인가?)
// Q2 : web에서 test1.html을 로드하면 에러발생.. 그래서 이 코드를 넣어서 해결..맞는방법인가?  <script> var exports = {}; </script>
// Q3 : 이 소스를 빌드하면 test1.js가 만들어지는데, require("./test2.ts"); 이 라인에서 에러가 발생함 

// import { test1 } from "test2.ts";
// import * as test1 from "./test2.ts";
import "./test2.ts"

export class test2 {
    func() {
       var a : test1 = new test1();
       a.func();

        console.log("test1");
    }
}

var val = new test2();
val.func();