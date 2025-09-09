import { BrowserWindow, app, session, net } from "electron";
import pie from "puppeteer-in-electron";
import puppeteer from "puppeteer-core";
import { delay } from "../utils/Tools.js";

/** 沟通模块处理逻辑 */
export const handleChatModule = async(page, updateHistoryMsg, userInfo, resolve) => {
  console.log("沟通模块处理逻辑")
  await page.waitForSelector("div.chat-message-filter-left :last-child",{
      visible: true
    })
  const unreadButton = await page.$("div.chat-message-filter-left :last-child");
  await delay(2000)
  await unreadButton.click({debugHighlight:true})
  const response = await fetchToken();
  console.log("请求token接口：", response)
  await locationUnreadItem(page,updateHistoryMsg)
  resolve("本轮沟通模块业务处理完毕")
}

/** 定位每个未读对话，并获得对应的对话记录 */
const locationUnreadItem = async(page,updateHistoryMsg) => {
  const unreadItems = await page.$$("div.user-list div[role='group'] > div");
  return "全部对话完成"
  if(unreadItems && unreadItems.length > 0) {
    unreadItems.forEach(async(item, index) => {
      // await item.click()
      // const historyMsg = await updateHistoryMsg();
      const text = await item.evaluate(item => item.textContent);
      if(index === 0 && text.trim().includes("汤")) {
        console.log(text.trim())
        const [response] = await Promise.all([
          page.waitForResponse(response => 
            response.url().includes('historyMsg') && response.status() === 200),
          item.click(), // 触发网络请求的操作
        ]);
        // await item.click()
        const historyMsgResult = await response.json();
        const chatContext = await fetchContext(historyMsgResult);
        const replyMessageResult = await replyMessage(page,chatContext);
        console.log(replyMessageResult)
        if(index === 0) {
          return "全部对话完成"
        }
      }
    })
  }
}

/** 根据对话上下文，从接口获取话术 */
const fetchContext = async(historyMsgResult) => {
  try {
    const response = await net.fetch('https://test-moss.zhenyetong.com/home-server/auth/userAndCompany');
    if(response.ok) {
      const body = await response.json()
      return "测试对话答复"
    }
  } catch(error) {
    return error || "response failure"
  }
}

/** 定位消息输入框，并回复 */
const replyMessage = async(page, chatContext) => {
  const textArea = await page.$("div.boss-chat-editor-input");
  await page.type("div.boss-chat-editor-input", chatContext ,{delay: 1000})
  await page.keyboard.press('Enter');
  return "回复成功"
}

/** 获取token */
const fetchToken = async() => {
  try {
    const response = await net.fetch('https://test-moss.zhenyetong.com/home-server/auth/userAndCompany');
    if(response.ok) {
      const body = await response.json()
      return "response ok"
    }
  } catch(error) {
    return error || "response failure"
  }
}