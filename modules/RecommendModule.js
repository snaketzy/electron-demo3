import { BrowserWindow, app, session, net } from "electron";
import pie from "puppeteer-in-electron";
import puppeteer from "puppeteer-core";
import { consoleColor, token } from "../config.js";
import { delay } from "../utils/Tools.js";

/** 
 * 推荐牛人模块处理逻辑 
 * @param page ptr的page对象
 * @param geekList  牛人列表
 * @param userInfo  当前招聘专员信息
 * @param jobInfo 当前查询的岗位信息
 * @param resolve promise
 */
export const handleRecommendModule = async(page, geekList, userInfo, jobInfo, resolve) => {
  console.log(geekList[0])
  for(const [index,geek] of geekList.entries()) {
    try {
      await locationGeekItem(geek, page);
      console.log(consoleColor["蓝色"],`向${geek.geekCard.geekName}打招呼`);
      
      await candidateInsert(geek, userInfo, jobInfo);
      
      if (index === geekList.length - 1) {
        resolve("完成");
      }
    }catch(error) {
      console.error(`处理第 ${index + 1} 个geek时出错:`, error);
    }
  }
}

/** 定位每个符合条件的牛人,并打招呼 */
const locationGeekItem = async(geek, page) => {
  const frames = page.frames();
  let frame = null;
  for (const currentFrame of frames) {
    if (currentFrame.url().includes('/web/frame/recommend')) {
      frame = currentFrame;
      break;
    }
  }
  if(frame) {
    // 1、判断是否打过招呼
    const isGreeted = await checkCandidate(frame,geek);
    if(!isGreeted) {
      // 2、对未打过招呼的牛人，定位打招呼按钮
      const greetingBtn = await getGreetingBtn(frame,geek)
      console.log(consoleColor["蓝色"],"2、定位打招呼按钮", greetingBtn)
      // await greetingBtn.click({debugHighlight:true})
      
      // 3、定位确认dialog
      const confirmBtn = await getConfirmBtn(frame,geek)
      console.log(consoleColor["蓝色"],"3、定位确认dialog", confirmBtn)
      return true;
    } 
  } else {
    console.log(consoleColor["红色"],"定位确认失败")
    return false;
  }
}

/** 判断是否打过招呼 */
const checkCandidate = async(frame,geek) => {
  const response = await net.fetch(`http://192.168.2.6:8080/api/Candidate/CheckCandidate?bossCandidateID=${geek.geekCard.geekId}`, {
    method:"get",
    headers: {
      'Content-Type': "application/json",
      'Authorization': token,
    }
  });
  if(response.ok) {
    const body = await response.json();
    if(body.data !== "0") {
      return false
    } else {
      return true;
    }
  }
}

/** 定位打招呼按钮 */
const getGreetingBtn = async(frame,geek) => {
  await frame.waitForSelector(`div[data-geekid="${geek.encryptGeekId}"]`,{
    timeout: 5000,
    visible: true
  })
  const geekElement =await frame.$(`div[data-geekid="${geek.encryptGeekId}"]`)
  const parentHandle = await geekElement.evaluateHandle(node => node.parentNode);
  const buttonElement = await parentHandle.$('.btn-greet'); // 使用类选择器
  console.log(consoleColor["红色"], new Date().toLocaleTimeString())
  await buttonElement.click({debugHighlight:true,delay: 3000})
  console.log(consoleColor["红色"], new Date().toLocaleTimeString())
  // const text = await buttonElement.evaluate(node => node.textContent);
  return true;
}

/** 定位打招呼确认按钮 */
const getConfirmBtn = async(frame,geek) => {
  await frame.waitForSelector("div.dialog-chat-greeting .btn", {
    timeout: 5000,
    visible: true
  })
  const dialogChatGreetingBtn = await frame.$("div.dialog-chat-greeting .btn");
  // debugger
  if(dialogChatGreetingBtn) {
    console.log(consoleColor["红色"], new Date().toLocaleTimeString())
    await dialogChatGreetingBtn.click({debugHighlight:true,delay: 3000})
    console.log(consoleColor["红色"], new Date().toLocaleTimeString())
    return true;
  }
}

/** 插入牛人 */
const candidateInsert = async(geek, userInfo, jobInfo) => {
  const response = await net.fetch("http://192.168.2.6:8080/api/Candidate/candidateInsert", {
    method:"post",
    headers: {
      'Content-Type': "application/json",
      'Authorization': token,
    },
    body: JSON.stringify({
      candidateName: geek.geekCard.geekName ,
      robotCode: `${userInfo.userId}`,
      bossCandidateID: geek.geekCard.geekId,
      bossJobName: jobInfo.jobName
    })
  });
  if(response.ok) {
    const body = await response.json()
    if(body.result === 0) {
      console.log(consoleColor["蓝色"], body.detail)
      return true
    }
  }
}