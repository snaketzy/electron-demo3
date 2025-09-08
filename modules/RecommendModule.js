// const {
//   BrowserWindow,
//   app,
//   session
// } = require("electron");
// const pie = require("puppeteer-in-electron")
// const puppeteer = require("puppeteer-core");
import { BrowserWindow, app, session } from "electron";
import pie from "puppeteer-in-electron";
import puppeteer from "puppeteer-core";

/** 推荐牛人模块处理逻辑 */
export const handleRecommendModule = (page, geekList, resolve) => {
  console.log(geekList[0])
  const elementArray = [{...geekList[0]}]
  elementArray.forEach((geek) => {
    // console.log(geek,page)
    locationGeekItem(geek,page)
    console.log(`向${geek.geekCard.geekName}打招呼`)
    
  });
}

// 定位每个牛人
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
    // 打招呼按钮
    const greetingBtnTxt = await getGreetingBtn(frame,geek)
    
    debugger

    // 确认dialog
    // const confirmBtn = await getConfirmBtn(frame,geek)
  }
}

const getGreetingBtn = async(frame,geek) => {
  await frame.waitForSelector(`div[data-geekid="${geek.encryptGeekId}"]`,{
    visible: true
  })
  const geekElement =await frame.$(`div[data-geekid="${geek.encryptGeekId}"]`)
  const parentHandle = await geekElement.evaluateHandle(node => node.parentNode);
  const buttonElement = await parentHandle.$('.btn-greet'); // 使用类选择器
  const text = await buttonElement.evaluate(node => node.textContent);
  return text.trim();
}

const getConfirmBtn = async(frame,geek) => {
  await frame.waitForSelector("div.dialog-chat-greeting .btn", {
    timeout: 5000,
    visible: true
  })
  const dialogChatGreeting = await frame.$("div.dialog-chat-greeting .btn");
  if(dialogChatGreeting) {
    await dialogChatGreeting.click({delay: 1000})
  }
}