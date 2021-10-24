const { getRandomNum } = require("../utils/utils.js");
const { getRes } = require("./answer.js");
const {ifRepeat} = require("./repeat.js");

const operators = ['+', '-', '*', '÷'];

// 生成算术表达式
function getExpression(max,hash) {
    let expression = [];

    let count = getRandomNum(2, 4), //题目包含的数字数
        bracket = getRandomNum(0, 1) ? getRandomNum(0, count - 2) : 0, //括号数
        b_in = bracket ? getRandomNum(2, count - 1 < 2 ? 2 : count - 1) : 0, //括号里包含的数
        b_start = bracket ? getRandomNum(0, count - b_in) : 0, //括号生成位置
        index = 0;
    // console.log(`数字数${count},括号数${bracket},括号包含数${b_in},括号位置${b_start}`)
    while (index < count) {
        if (bracket === 1 && b_start == index) {
            expression.push("(");
        }
        // 运算符
        const key = getRandomNum(0, 3);
        //是否生成分数
        const ifFen = getRandomNum(0, 1);
        // 数字
        let num;
        if (ifFen) {
            num = getFraction(max);
        } else {
            num = getRandomNum(0, max);
        }
        expression.push(num);
        if (bracket === 1 && b_start + b_in === index + 1) {
            expression.push(")");
        }
        if (index < count - 1)
            expression.push(operators[key]);
        index++;
    }

    // 当括号数为2时，只能有一种情况，即（1+1）+（1+1）
    if (bracket === 2 && b_in === 2) {
        expression.splice(3, 0, ")");
        expression.splice(5, 0, "(");
        expression.unshift("(");
        expression.push(")");
    }

    // console.log("结果:" + getRes(expression));
    ans = getRes(expression);
    if (/-/g.test(ans)) throw new Error(`答案${ans}，不能为负数`);

    // 去重操作
    const formatExp = expression.join("|");
    if(ifRepeat(hash,formatExp,ans)) throw new Error(`表达式【${formatExp}】重复`);
    hash.set(formatExp,ans);

    expression.push("=");
    return {
        expression: expression.join(" "),
        ans
    };
}

// 生成分数
function getFraction(max) {
    let num1 = getRandomNum(1, max),
        num2 = getRandomNum(1, max);

    // 返回真分数
    if (num1 <= num2) return '' + num1 + '/' + num2;

    let i = 0;
    // 防止真分数出现分子为0的情况
    while (num1 % num2 === 0) {
        // console.log(num1,num2);
        num2 = getRandomNum(1, max);
        if(i === 2) return parseInt(num1/num2);
        i++;
    }

    // 会出现生成num1<num2的情况，如果在循环中直接设置num2属于[1，num1]，有可能出现死循环，经过再三考虑决定这样设计
    if (num1 <= num2) return '' + num1 + '/' + num2;

    const numerator = num1 % num2,
        x = Math.floor(num1 / num2);
    return '' + x + '\'' + numerator + '/' + num2;
}

/**
 * @description: 获取一定数量的表达式
 * @param {*} num //表达式数量
 * @param {*} range //范围【0，range】
 * @return {*} [{expression,ans},...] expression为表达式，ans为答案
 */
function getAllExpress(num, range) {
    let time = new Date().getTime();
    const res = [],
        hash = new Map();
    for (let i = 0; i < num; i++) {
        try {
            const the = getExpression(range,hash);
            res.push(the);
            console.log(i, '表达式：' + the.expression, '答案：' + the.ans);
        } catch (error) {
            console.log(error.message)
            i--;
        }
    }
    console.log("生成题目时间：" + (new Date().getTime() - time) + 'ms');
    return res;
}

module.exports = {
    getAllExpress
}


/* // 生成分数(废弃)
function getFraction_NoUsed(max) {
    let num1 = getRandomNum(1, max),
        num2;
    // 生成不相等的两个数
    let temp;
    do {
        temp = num1;
        num2 = getRandomNum(2, max);
        // 化简两数
        [temp, num2] = simplifyNum(temp, num2);

    } while (temp === num2 || num2 === 1) //这里num2是1的话就没有【生成分数】的意义了，

    num1 = temp;
    // console.log(num1, num2);

    // 返回真分数
    if (num1 < num2) return '' + num1 + '/' + num2;

    const numerator = num1 % num2,
        x = Math.floor(num1 / num2);
    return '' + x + '\'' + numerator + '/' + num2;
} */

