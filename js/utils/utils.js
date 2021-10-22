/**
 * @description: 生成min~max范围的整数
 * @param {*} min
 * @param {*} max
 * @return {*} 一个【min，max】区间的随机数
 */
function getRandomNum(min, max) {
    return min + Math.round(Math.random() * (max - min));
}

/**
 * @description: 化简两个数
 * @param {*} num1
 * @param {*} num2
 * @return {*} 化简后的两个数
 */
function simplifyNum(num1, num2) {
    // 本质上就是求出两个数的最大公约数，然后进行化简
    if (num1 < num2) {
        const [temp1, temp2] = simplifyNum(num2, num1);
        return [temp2, temp1];
    }

    let b = gcd(num1, num2);

    return [Math.floor(num1 / b), Math.floor(num2 / b)]
}

/**
 * @description: 求最大公约数
 * @param {*} a
 * @param {*} b
 * @return {*} a，b的最大公约数
 */
function gcd(a, b) {
    if(a === 0 || b == 0) throw new Error("0没有公约数")
    while (a % b !== 0) {
        const temp = a % b;
        a = b;
        b = temp;
    }

    return b;
}

/**
 * @description: 求最小公倍数
 * @param {*} num1
 * @param {*} num2
 * @return {*} num1，num2的最小公倍数
 */
function leastCommonMultiple(num1, num2) {
    return num1 * num2 / gcd(num1, num2);
}


module.exports = {
    getRandomNum,
    simplifyNum,
    leastCommonMultiple,

}