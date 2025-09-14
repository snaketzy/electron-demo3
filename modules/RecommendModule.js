import { BrowserWindow, app, session } from "electron";
import pie from "puppeteer-in-electron";
import puppeteer from "puppeteer-core";

/** 推荐牛人模块处理逻辑 */
export const handleRecommendModule = (page, geekList, userInfo, resolve) => {
  console.log(geekList[0])
  const elementArray = [{...geekList[0]}]
  elementArray.forEach(async(geek, index) => {
    // console.log(geek,page)
    await locationGeekItem(geek,page)
    console.log(`向${geek.geekCard.geekName}打招呼`)
    if(index === elementArray.length - 1) {
      resolve("完成")
    }
  });
  
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
    // 1、定位打招呼按钮
    const greetingBtnTxt = await getGreetingBtn(frame,geek)
    console.log("1、定位打招呼按钮", greetingBtnTxt)

    // 2、定位确认dialog
    const confirmBtn = await getConfirmBtn(frame,geek)
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

/** 定位打招呼确认按钮 */
const getConfirmBtn = async(frame,geek) => {
  await frame.waitForSelector("div.dialog-chat-greeting .btn", {
    timeout: 5000,
    visible: true
  })
  const dialogChatGreeting = await frame.$("div.dialog-chat-greeting .btn");
  debugger
  return
  if(dialogChatGreeting) {
    await dialogChatGreeting.click({delay: 1000})
  }
}