let number = 337733;
let numString = number.toString().split("");
let reversedNum;
let counter = numString.length();

numString.forEach(num=>{
    reversedNum[counter] = num;
    counter--;
});

if(reversedNum.join("") === numString.join("")){
    console.log("the number is palindrom")
}
else{
console.log("the number is not palindrom");
}

