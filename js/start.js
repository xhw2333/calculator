// 主要函数
let {writeFile, readFile, getWriteArr} = require("./js/handleFile.js")
let {checkAnswer} = require("./js/checkAnswer.js")
let { getRes } = require('./js/Expression/answer')
let { getAllExpress } = require('./js/Expression/expression')
//主要数据
let topicArr = [] //存放题目的数组
let answerArr = []   //存放答案的数组
let gradeArr = []    //存放结果的数组
let topicNum = 10 //题目数量，初始化为10
let isTopicShow = false //是否有题目出现


//获得主界面的元素
let con = document.getElementsByClassName('body-context')[0]
//提交功能提示的元素
let subAttentionDom = document.getElementsByClassName('submitAttention')[0]

//监听页面的点击事件
con.onclick = (e) => {

  //获取点击的元素
  let target = e.target
  let clickFuncName = target.getAttribute('click')

  //根据函数名来判断要执行哪些函数
  if(clickFuncName === 'createTopic'){
    changeTopicNum()
  }  
  else if(clickFuncName === 'commit'){
    commit()
    // console.log('commit')
  }
}

//1、 切换题目数量

//获取展示题目的元素
let topicCon = document.getElementsByClassName('topic-context')[0]

const changeTopicNum = () => {
  //获取题目数量
  let inputNumVal = document.getElementsByClassName('topic-num-input')[0].value
  //获取数字范围
  let inputRangeVal = document.getElementsByClassName('num-range-input')[0].value
  let attention = document.getElementsByClassName('attention')[0]
  //去除原来的题目
  if(topicCon.innerHTML !== ''){
    topicCon.innerHTML = ''
  }
  let judgeNumRes =  judgeInputVal(inputNumVal,attention)

  //题目数量合法后再检测数字范围
  if(judgeNumRes) {
    let judgeRangeRes = judgeInputRange(inputRangeVal,attention)

    //两个输入都合法后执行生成题目函数
    if(judgeNumRes && judgeRangeRes){
      subAttentionDom.style.display = 'none'
        //更新全局变量的题目数量
        topicNum = inputNumVal
        createTopic(inputNumVal,inputRangeVal)
        isTopicShow = true
    }
  }
}

//判断用户的题目数量输入是否合法
const judgeInputVal = (inputVal,target) => {
  let reg = /(^[1-9]\d*$)/
  if(inputVal === ''){
    poinError('请输入题目数量',target)
    isTopicShow = false
    return false
  }
  else if(!reg.test(inputVal)){
    poinError('请输入正整数',target)
    isTopicShow = false
    return false
  }
  else if(inputVal > 10000){
    poinError('输入值不能大于10000',target)
    isTopicShow = false
    return false
  }
  else{
    target.style.display = 'none'
    return true
  }
}

//判断用户输入的数字范围是否合法
function judgeInputRange(inputVal,target) {
  let reg = /(^[1-9]\d*$)/
  if(inputVal === ''){
    poinError('数字范围不能为空',target)
    isTopicShow = false
    return false
  }
  else if(!reg.test(inputVal)){
    poinError('数字范围请输入正整数',target)
    isTopicShow = false
    return false
  }
  else if(inputVal > 10000){
    poinError('数字范围输入值不能大于10000',target)
    isTopicShow = false
    return false
  }
  else{
    target.style.display = 'none'
    return true
  }
}

//提示用户输入错误
const poinError = (msg,target) => {
  
   let htmlStr = 
    `
    <h3>${msg}</h3>
    `
    target.innerHTML = htmlStr
    target.style.display = 'block'
}

//生成题目与答案
const createTopic = (num,range) => {
  //生成题目
  topicArr = getAllExpress(num,range)
  //获得对应题目的答案
  answerArr = []
  for(let item of topicArr){
    answerArr.push(item.ans)
  }
  showTopic(topicArr)

  //将题目与答案写入文件
  writeFile(topicArr,0).then(() => {
    // console.log(readFile(0))
  })
  writeFile(topicArr,1).then(() => {
    // console.log(readFile(0))
  })
}

//显示题目
const showTopic = (topics) => {
  let htmlStr = ''
  let len = topics.length
  topicCon.innerHTML = '' 
  for(let i = 0 ; i < len ; i++){
    htmlStr += 
		`<span class="topic">
			<span>${i+1}、  </span>	
			<p>${topics[i].expression}</p>
			<input class="topic-write" type="text">
			<div class="topic-judeg"></div>
		</span>`
  }
  topicCon.innerHTML = htmlStr
}

//提交答案
const commit = () => {
  if(!isTopicShow){
    poinError('请输入合法的题目数量',subAttentionDom)
    // dom.innerHTML = htmlStr
    return 
  }
  subAttentionDom.style.display = 'none'
  let writeArr = []
  let writeDomArr = document.getElementsByClassName('topic-write')
  let len =  writeDomArr.length
  for(let i = 0; i < len; i++) {
		writeArr.push(writeDomArr[i].value);
	}

  //判断答案是否正确
  judeg(writeArr, answerArr)
}

//验证函数
const judeg = (writeArr, answerArr) => {
  console.log(writeArr);
  console.log(answerArr)
  let len = writeArr.length
  let topicJudgeArr = document.getElementsByClassName('topic-judeg')
  let correctArr = []
	let wrongArr = []
  for(let i = 0 ; i < len ; i++){
    if(writeArr[i] == answerArr[i]){
      topicJudgeArr[i].innerHTML = '√'
      topicJudgeArr[i].style.color = '#080'
      correctArr.push(i+1)
    }else{
      topicJudgeArr[i].innerHTML = 'X'
      topicJudgeArr[i].style.color = '#f40'
      wrongArr.push(i+1)
    }
  }
  gradeArr = [`Correct:(${correctArr.length}) (${getStr(correctArr)})`, `Wrong:(${wrongArr.length}) (${getStr(wrongArr)})`,]
	writeFile(gradeArr, 2)
}

function getStr(dataArr) {
	let str = '';
	let len = dataArr.length;
	for(let i = 0; i < len; i++) {
		if(i+1 == len) {
			str += ` ${dataArr[i]}`;
		}else {
			str += ` ${dataArr[i]},`;
		}
	}
	return str;
}
