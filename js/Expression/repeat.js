// 判断生成的表达式里是否有重复的
function ifRepeat(hash,expression,ans){
    for(const [key,value] of hash){
        // 表达式长度不一样
        if(key.length !== expression.length) continue;
        // 表达式长度一样但答案不同
        if(key.length === expression.length && value !== ans) continue;
        if(ifSame(key.split("|"),expression.split("|"))) return true;
    }

    return false;
}

// 判断两个式子是否相同，思路类似两个单词是否为变位词
function ifSame(one,two){
    // 前面以保证了one和two长度相等

    const map = new Map(); //存储每个字符出现的次数
    
    for(const item of one){
        map.set(item,(map.get(item)||0)+1);
    }

    for(const item of two){
        if(!map.has(item)) return false;
        const count = map.get(item);
        // count为1说明这个项要删除
        if(count === 1) {
            map.delete(item);
            continue;
        }
        map.set(item,count-1);
    }

    // hash一定此时为空，说明两个式子大概率相同
    return true;
}

module.exports = {
    ifRepeat,
}