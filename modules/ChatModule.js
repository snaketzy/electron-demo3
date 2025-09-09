import { BrowserWindow, app, session, net } from "electron";
import pie from "puppeteer-in-electron";
import puppeteer from "puppeteer-core";
import { delay } from "../utils/Tools.js";

/** 沟通模块处理逻辑 */
export const handleChatModule = async(page, updateHistoryMsg, resolve) => {
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
}

/** 定位每个未读对话，并获得对应的对话记录 */
const locationUnreadItem = async(page,updateHistoryMsg) => {
  const unreadItems = await page.$$("div.user-list div[role='group'] > div");
  if(unreadItems && unreadItems.length > 0) {
    unreadItems.forEach(async(item, index) => {
      // await item.click()
      // const historyMsg = await updateHistoryMsg();
      const text = await item.evaluate(item => item.textContent);
      if(index === 0 && text.trim().includes("汤")) {
        console.log(text.trim())
        await item.click()
      }
    })
  }
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