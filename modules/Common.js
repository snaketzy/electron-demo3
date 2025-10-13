import { BrowserWindow, app, session, net } from "electron";
import pie from "puppeteer-in-electron";
import puppeteer from "puppeteer-core";
import { delay, getRandomSecondsPrecise } from "../utils/Tools.js";
import {ComponentsObject, consoleColor, dashboardWindow, timeoutInterval, token, typeDelay,} from "../config.js";
import dayjs from 'dayjs';


/** 根据对话上下文，从接口获取话术
 * 1、打招呼，2、主动联系话术，3、复聊话术，4、岗位相关话术
 */
export const fetchContext = async(historyMsgResult, geekInfoResult, scriptType="4") => {
  try {
    const geekInfo = geekInfoResult.zpData.data;
    const submitChatArray = assembleSubmitChatArray(historyMsgResult,geekInfo);
    const submitChatResponse = await net.fetch("http://192.168.2.6:8080/api/Candidate/ListrtCommunicationRecord", {
      method:"post",
      headers: {
        'Content-Type': "application/json",
        'Authorization': token,
      },
      body: JSON.stringify({
        communicationRecordsInsertModels: submitChatArray
      })
    })
    if(submitChatResponse.ok) {
      const response = await net.fetch('http://192.168.2.6:8080/api/robot/getscript', {
        method:"post",
        headers: {
          'Content-Type': "application/json",
          'Authorization': token,
        },
        body: JSON.stringify({
          bossJobName: geekInfo.positionName ,
          bossCandidateID: `${geekInfo.uid}`,
          scriptType: scriptType
        })
      });
      if(response.ok) {
        dashboardWindow.webContents.send("sendMessageToRender", {
          module: ComponentsObject["沟通"].name,
          action: `从大数据模型获取回复【${geekInfo.name}】的内容，成功`,
        });
        const body = await response.json()
        return body.data.scriptContent
      } else {
        dashboardWindow.webContents.send("sendMessageToRender", {
          module: ComponentsObject["沟通"].name,
          action: `getscript，response failure`,
        });
        console.log(consoleColor["红色"],response)
      }
    } else {
      dashboardWindow.webContents.send("sendMessageToRender", {
        module: ComponentsObject["沟通"].name,
        action: `ListrtCommunicationRecord，response failure`,
      });
      console.log(consoleColor["红色"],submitChatResponse)
    }
  } catch(error) {
    dashboardWindow.webContents.send("sendMessageToRender", {
      module: ComponentsObject["沟通"].name,
      action: `调用ListrtCommunicationRecord或getscript，异常，将返回【不回复话术】`,
    });
    console.log(consoleColor["红色"], error || "response failure" )
    return undefined
  }
}


/**
 * 组装新沟通记录
 * @param bossJobName
 * @param bossCandidateID boss候选人ID（沟通列表人员ID）
 * @param initiatingParty 1我司发起 2候选人发起
 * @param communication 沟通内容ID用于区分聊天记录
 * @param communicationTime 沟通时间
 * @param contents 沟通记录
 * @param candidateName 候选人姓名
 */
export const assembleSubmitChatArray = (historyMsgResult,geekInfo) => {
  const historyMsgResultArray = historyMsgResult.zpData.messages || [];
  const chatArray = [];
  if(historyMsgResultArray.length > 0) {
    historyMsgResultArray.forEach(msg => {
      chatArray.push({
        bossJobName: geekInfo.positionName,
        bossCandidateID: `${geekInfo.uid}`,
        initiatingParty: msg.from.uid === geekInfo.uid ? 2 : 1,
        communication: `${msg.mid}`,
        communicationTime: dayjs(msg.time).format('YYYY-MM-DD HH:mm:ss'),
        contents: msg.pushText || "",
        candidateName: geekInfo.name
      })
    })
  }
  return chatArray;
}


/** 定位消息输入框，并回复 */
export const replyMessage = async(page, chatContext, text) => {
  try {
    if(!chatContext) {
      debugger
      return;
    }
    dashboardWindow.webContents.send("sendMessageToRender", {
      module: ComponentsObject["沟通"].name,
      action: `回复【${text.trim()}】中`,
    });
    const textArea = await page.$("div.boss-chat-editor-input");
    const lines = chatContext.split("\n");
    for (const line of lines) {
      await page.type("div.boss-chat-editor-input", line ,{delay: typeDelay})
      await page.keyboard.down('Shift');
      await page.keyboard.press('Enter');
      await page.keyboard.up('Shift');
    }
    await page.keyboard.press('Enter');
    dashboardWindow.webContents.send("sendMessageToRender", {
      module: ComponentsObject["沟通"].name,
      action: `回复【${text.trim()}】完成`,
    });
    return "回复完成"
  } catch (error) {
    console.error(error);
  }
}


/** 交换手机和微信 */
export const applyCellPhoneAndWechat = async(page, text) => {
  try {
    dashboardWindow.webContents.send("sendMessageToRender", {
      module: ComponentsObject["沟通"].name,
      action: `尝试和【${text.trim()}】交换【手机】及【微信】`,
    });
    return
    let phoneResult = false;
    let wechatResult = false;
    await page.waitForSelector('span.operate-btn:not(.disabled)',{
      timeout: 10000,
      visible: true
    });
    await delay(2000)
    const elements = await page.$$('span.operate-btn:not(.disabled)');

    for (const element of elements) {
      const text = await page.evaluate(el => el.textContent, element);
      if (text.includes("换电话")) {
        phoneResult = true;
        await element.click({debugHighlight:true});
        await page.waitForSelector('div.exchange-tooltip:not([style*="display: none"])');
        // await delay(getRandomSecondsPrecise())
        await delay(timeoutInterval)
        const phoneBtn = await page.$('div.exchange-tooltip:not([style*="display: none"]) span.boss-btn-primary');
        await phoneBtn.click({debugHighlight:true})
      }
      //  if (text.includes("换微信")) {
      //   wechatResult = true;
      //   await element.click({debugHighlight:true});
      //   break;
      // }
    }
    return phoneResult
  } catch (error) {
    console.error(error);
  }
}