import { BrowserWindow, app, session, net } from "electron";
import pie from "puppeteer-in-electron";
import puppeteer from "puppeteer-core";
import { delay, getRandomSecondsPrecise } from "../utils/Tools.js";
import {ComponentsObject, consoleColor, dashboardWindow, timeoutInterval, token, typeDelay,} from "../config.js";
import dayjs from 'dayjs';
import {applyCellPhoneAndWechat, fetchContext, replyMessage} from "./Common.js";


/** 沟通模块处理主逻辑 */
export const handleChatModule = async(page, updateHistoryMsg, userInfo, resolve) => {
  try {
    // resolve("本轮沟通模块业务处理完毕")
    return

    console.log(consoleColor["蓝色"], "handleChatModule -> 开始【沟通】模块处理逻辑")
    // 切换到未读消息
    await page.waitForSelector("div.chat-message-filter-left :last-child",{
      timeout: timeoutInterval,
      visible: true
    })
    const unreadButton = await page.$("div.chat-message-filter-left :last-child");
    // await delay(getRandomSecondsPrecise())
    await delay(timeoutInterval)
    await unreadButton.click({debugHighlight:true})
    dashboardWindow.webContents.send("sendMessageToRender", {
      module: ComponentsObject["沟通"].name,
      action: "切换到【未读】标签",
    });
    await delay(timeoutInterval)
    const locationResult = await locationUnreadItem(page,updateHistoryMsg, userInfo)
    if(locationResult) {
      dashboardWindow.webContents.send("sendMessageToRender", {
        module: ComponentsObject["沟通"].name,
        action: "本轮【沟通】模块业务处理完毕",
      });
      await delay(timeoutInterval);
      resolve("本轮沟通模块业务处理完毕")
    }
  } catch (error) {
    console.error(error);
  }
}

/** 定位每个未读对话，并获得对应的对话记录 */
const locationUnreadItem = async(page,updateHistoryMsg, userInfo) => {
  await page.waitForSelector("div.user-list div[role='group'] > div, div.no-data",{
    timeout: 5000,
    visible: true
  });
  const unreadItems = await page.$$("div.user-list div[role='group'] > div");
  dashboardWindow.webContents.send("sendMessageToRender", {
    module: ComponentsObject["沟通"].name,
    action: "定位【沟通】模块的所有【未读】消息",
  });
  await delay(timeoutInterval);
  // return "全部对话完成"
  if(unreadItems && unreadItems.length > 0) {
    for(const [index,item] of unreadItems.entries()) {
      try {
        // await item.click()
        // const historyMsg = await updateHistoryMsg();
        const text = await item.evaluate(item => item.textContent);
        // if(index === 0 && text.trim().includes("汤哲")) {
        // if(true) {
          console.log(text.trim())
          await item.click({debugHighlight:true})
          dashboardWindow.webContents.send("sendMessageToRender", {
            module: ComponentsObject["沟通"].name,
            action: `共${unreadItems.length}条未读消息，当前是第${ index + 1}条，来自【${text.trim()}】`,
          });

          const historyMsgResponse = await page.waitForResponse(response => response.url().includes('historyMsg') && response.status() === 200);

          const geekInfoResponse = await page.waitForResponse(response => response.url().includes('geek/info') && response.status() === 200);

          const historyMsgResult = await historyMsgResponse.json();
          dashboardWindow.webContents.send("sendMessageToRender", {
            module: ComponentsObject["沟通"].name,
            action: `从boss获取和【${text.trim()}】的历史聊天记录`,
          });
          await delay(timeoutInterval);
          dashboardWindow.webContents.send("sendMessageToRender", {
            module: ComponentsObject["沟通"].name,
            action: `从boss获取【${text.trim()}】的信息`,
          });
          const geekInfoResult = await geekInfoResponse.json();

          await delay(timeoutInterval);
          dashboardWindow.webContents.send("sendMessageToRender", {
            module: ComponentsObject["沟通"].name,
            action: `开始从大数据模型获取回复【${text.trim()}】的内容`,
          });
          const chatContext = await fetchContext(historyMsgResult, geekInfoResult);

          await delay(timeoutInterval);
          const replyMessageResult = await replyMessage(page,chatContext, text);

          // 接受交换手机和微信申请
          const acceptApplyResult = await acceptApply(page)
          // 如果可以交换手机，就执行对应操作
          const applyCellPhoneAndWechatResult = await applyCellPhoneAndWechat(page, text)

          if(index === unreadItems.length - 1) {
            dashboardWindow.webContents.send("sendMessageToRender", {
              module: ComponentsObject["沟通"].name,
              action: `全部${unreadItems.length}个未读对话完成`,
            });
            await delay(timeoutInterval);
            return "全部对话完成"
          }
        // }
        // else {
        //   return "全部对话完成"
        // }
      } catch(error) {
        dashboardWindow.webContents.send("sendMessageToRender", {
          module: ComponentsObject["沟通"].name,
          action: `处理第 ${index + 1} 个未读消息时出错, ${error}`,
        });
        console.error(consoleColor["红色"],`处理第 ${index + 1} 个item时出错:`, error);
      }
    }
  } else {
    await delay(timeoutInterval);
    return "全部对话完成"
  }
}
