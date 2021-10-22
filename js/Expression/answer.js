const { simplifyNum, leastCommonMultiple } = require('../utils/utils')

// 计算结果
function getRes(expression) {
    // 获取转换后的后缀表达式
    const res = midToAfter(expression);
    // 再进行运算
    return evalRPN(res);
}

// 中缀表达式转后缀
function midToAfter(expression) {
    const res = [], //结果
        stack = [];

    for (const ele of expression) {
        switch (ele) {
            case '+':
            case '-':
                while (stack[stack.length - 1] === '*' || stack[stack.length - 1] === '÷') {
                    res.push(stack.pop());
                }
                stack.push(ele);
                break;
            case '÷':
            case '*':
            case '(':
                stack.push(ele);
                break;
            case ')':
                while (stack.length) {
                    const temp = stack.pop();
                    if (temp === '(') break;
                    res.push(temp);
                }
                break;
            default:
                if ((/\'/g).test(ele)) {
                    res.push(changeNum1(ele));
                } else {
                    res.push(ele);
                }
                break;
        }
    }
    while (stack.length) {
        res.push(stack.pop());
    }
    return res;
}

// 逆波兰求值(部分值有带有分数)
function evalRPN(expression) {
    const stack = [];

    for (const ele of expression) {
        switch (ele) {
            case '+':
            case '-':
            case '*':
            case '÷':
                const one = stack.pop(),
                    two = stack.pop();
                if (one === 0 && ele === '÷') throw new Error("题目没意义");
                stack.push(calculateIfFrac(two, one, ele))
                break;
            default:
                stack.push(ele);
                break;
        }
    }
    let res = stack.pop();
    if(/\//.test(res)) res = changeNum2(res);
    return res;
}

// 根据是否是分数计算
function calculateIfFrac(one, two, opera) {
    // 带有分数的情况
    if (/\//g.test(one) && /\//g.test(two)) {
        let [x1, y1] = one.split('\/'),
            [x2, y2] = two.split('\/');

        x1 = +x1;
        x2 = +x2;
        y1 = +y1;
        y2 = +y2;

        let num1, num2, temp, temp1, temp2, res;
        switch (opera) {
            case '*':
                [num1, num2] = simplifyNum(x1 * x2, y1 * y2);
                return num1 % num2 === 0 ? parseInt(num1 / num2) : num1 + '/' + num2;
            case '÷':
                [num1, num2] = simplifyNum(x1 * y2, y1 * x2);
                return num1 % num2 === 0 ? parseInt(num1 / num2) : num1 + '/' + num2;
            case '+':
                temp = leastCommonMultiple(y1, y2);
                temp1 = Math.floor(temp / y1);
                temp2 = Math.floor(temp / y2);
                res = x1 * temp1 + x2 * temp2;
                return res % temp === 0 ? parseInt(res / temp) : res + '/' + temp;
            case '-':
                temp = leastCommonMultiple(y1, y2);
                temp1 = Math.floor(temp / y1);
                temp2 = Math.floor(temp / y2);
                res = x1 * temp1 - x2 * temp2;
                return res % temp === 0 ? parseInt(res / temp) : res + '/' + temp;
        }

    } else if (/\//g.test(one)) {
        let [x1, y1] = one.split('\/');
        two = +two;
        x1 = +x1;
        y1 = +y1;

        switch (opera) {
            case '*':
                [x1, y1] = simplifyNum(x1 * two, y1);
                return x1 % y1 === 0 ? parseInt(x1 / y1) : x1 + '/' + y1;
            case '÷':
                [x1, y1] = simplifyNum(x1, y1 * two);
                return x1 % y1 === 0 ? parseInt(x1 / y1) : x1 + '/' + y1;
            case '+':
                [x1, y1] = simplifyNum(x1 + two * y1, y1)
                return x1 % y1 === 0 ? parseInt(x1 / y1) : x1 + '/' + y1;
            case '-':
                [x1, y1] = simplifyNum(x1 - two * y1, y1);
                return x1 % y1 === 0 ? parseInt(x1 / y1) : x1 + '/' + y1;
        }

    } else if (/\//g.test(two)) {
        // console.log(3);
        let [x2, y2] = two.split('\/');

        one = +one;
        x2 = +x2;
        y2 = +y2;

        switch (opera) {
            case '*':
                [x2, y2] = simplifyNum(x2 * one, y2);
                return x2 % y2 === 0 ? parseInt(x2 / y2) : x2 + '/' + y2;
            case '÷':
                [x2, y2] = simplifyNum(y2 * one, x2);
                return x2 % y2 === 0 ? parseInt(x2 / y2) : x2 + '/' + y2;
            case '+':
                [x2, y2] = simplifyNum(one * y2 + x2, y2);
                return x2 % y2 === 0 ? parseInt(x2 / y2) : x2 + '/' + y2;
            case '-':
                [x2, y2] = simplifyNum(one * y2 - x2, y2);
                return x2 % y2 === 0 ? parseInt(x2 / y2) : x2 + '/' + y2;
        }
    }

    // 两个都不带有分数，先转换为整型
    one = +one;
    two = + two;
    if (opera === '+') {
        return one + two;
    } else if (opera === '-') {
        return one - two;
    } else if (opera === '*') {
        return two * one;
    } else {
        // 除法的情况,转换为分数
        return one % two == 0 ? parseInt(one / two) : one + '/' + two;
    }
}

// 分数转换成整数相除
function changeNum1(fraction) {
    let [one, two] = fraction.split("\'");
    let [x, y] = two.split("\/");

    one = +one;
    x = +x;
    y = +y;

    return one * y + x + '/' + y;
}

// 假分数转真分数
function changeNum2(str) {
    str = '' + str;
    let [x, y] = str.split("\/");
    x = +x;
    y = +y;

    if (x % y === 0) return parseInt(x / y);

    if(x < y) return str;

    const zheng = parseInt(x/y),
        yu = x % y;
    return zheng + '\'' + yu + '/' + y;

}


// console.log(getRes("7 ÷ 4 * 6/6".split(" ")));
// console.log(midToAfter('1+2*2-(3*5)'.split('')))
// console.log(calculateIfFrac('2', '21/2', '*'));
// console.log(changeNum1("1'1/2"))

module.exports = {
    getRes,
}