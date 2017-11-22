let index = 0;

class Test {

    test(){
        console.log(index++);
        if(index > 10) {
            return index;
        } else {
            return this.test();
        }
    }
}



let t = new Test();

let result = t.test();

console.log("result:", result);