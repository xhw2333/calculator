function checkAnswer(writeStr, answerStr) {
	if(!writeStr) {
		return false;
	}
	// let testStr = /^(\d+\'\d+|\d+)\/\d+$/
	if(Number.isNaN(Number(writeStr))) {
		writeStr = strToNum(writeStr)
		if(writeStr === false){
			return false
		}
	} 
	if(Number.isNaN(Number(answerStr))){
		answerStr = strToNum(answerStr)
		if(answerStr === false){
			return false
		}
	}

	let res = ifApproximate(writeStr, answerStr);
	return res

}

function strToNum(str){
	let testStr1 = /^\d+\'\d+\/\d+$/
	let testStr2 = /^\d+\/\d+$/
	// 非自然数或小数
	let arr = str.split('/');
	// console.log(arr)
	if(!testStr1.test(str) && !testStr2.test(str) || Number(arr[1]) <= 0) {
		// 非分数
		return false;
	}
	if(testStr1.test(str)) {
		// 分数大于一
		let num1 = Number(arr[0].split("\'")[0]);
		let num2 = Number(arr[0].split("\'")[1]);
		let num3 = Number(arr[1]);
		if(num2 > num3 || commonDivisor1(num2, num3)!=1) {
			// 输入不规范
			return false;
		}
		let num = num1 + num2/num3;
		console.log(num)  
		return num
	} else {
		// 分数小于一
		let num1 = Number(arr[0]);
		let num2 = Number(arr[1]);
		if(num1 > num2 || commonDivisor1(num1, num2)!=1) {
			return false;
		}
		let num = num1/num2;
		console.log(num)
		return num
	}
}

function ifApproximate(num1, num2) {
	let diff = Number(num1) - Number(num2);
	return (diff >= -0.01 && diff <= 0.01);
}

function commonDivisor1(num1,num2) {
	if ((num1-num2) < 0) {
		let k = num1;
		num1 = num2;
		num2 = k;
	} 
	while (num2 !=0) {
		let remainder = num1%num2;
		num1 = num2;
		num2 = remainder;
	}
	return num1;
}
module.exports = {
    checkAnswer: checkAnswer,
}