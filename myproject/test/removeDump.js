function removeDump(arr) {
    let k = 0;
    for (let i = 1; i < arr.length; i++) {
        if(arr[i] > arr[k]){
            // 交换
            let tmp = arr[k];
            arr[k] = arr[i];
            arr[i] = tmp;
            k++;
        } else if(arr[i] == arr[k]){
            //不变
            k++
        }
    }
    console.log("arr:", arr);

}

removeDump([]);
removeDump([1]);
removeDump([1,1,2,3]);

