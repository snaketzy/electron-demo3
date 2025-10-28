import { BrowserWindow, app, session, net } from "electron";
import pie from "puppeteer-in-electron";
import puppeteer from "puppeteer-core";
import { delay, getRandomSecondsPrecise } from "../utils/Tools.js";
import {ComponentsObject, consoleColor, dashboardWindow, timeoutInterval, token, typeDelay,} from "../config.js";
import dayjs from 'dayjs';


/** 根据对话上下文，从接口获取话术
 * 1、打招呼，2、主动联系话术，3、复聊话术，4、岗位相关话术
 * 2、scriptType："3" 牛人管理 "4"沟通
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
          module: scriptType === "4" ? ComponentsObject["沟通"].name : ComponentsObject["牛人管理"].name,
          action: `从大数据模型获取回复【${geekInfo.name}】的内容，成功`,
        });
        const body = await response.json()
        return body.data.scriptContent
      } else {
        dashboardWindow.webContents.send("sendMessageToRender", {
          module: scriptType === "4" ? ComponentsObject["沟通"].name : ComponentsObject["牛人管理"].name,
          action: `getscript，response failure`,
        });
        console.log(consoleColor["红色"],response)
        return undefined
      }
    } else {
      dashboardWindow.webContents.send("sendMessageToRender", {
        module: scriptType === "4" ? ComponentsObject["沟通"].name : ComponentsObject["牛人管理"].name,
        action: `ListrtCommunicationRecord，response failure`,
      });
      console.log(consoleColor["红色"],submitChatResponse)
      return undefined
    }
  } catch(error) {
    dashboardWindow.webContents.send("sendMessageToRender", {
      module: scriptType === "4" ? ComponentsObject["沟通"].name : ComponentsObject["牛人管理"].name,
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
export const replyMessage = async(page, chatContext, text, type="4") => {
  try {
    if(!chatContext) {
      debugger
      return;
    }
    dashboardWindow.webContents.send("sendMessageToRender", {
      module: type === "4" ? ComponentsObject["沟通"].name : ComponentsObject["牛人管理"].name,
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
      module: type === "4" ? ComponentsObject["沟通"].name : ComponentsObject["牛人管理"].name,
      action: `回复【${text.trim()}】完成`,
    });
    return "回复完成"
  } catch (error) {
    console.error(error);
    return "回复异常"
  }
}


/** 交换手机和微信 */
export const applyCellPhoneAndWechat = async(page, text, type="4") => {
  try {
    dashboardWindow.webContents.send("sendMessageToRender", {
      module: type === "4" ? ComponentsObject["沟通"].name : ComponentsObject["牛人管理"].name,
      action: `尝试和【${text.trim()}】交换【手机】及【微信】`,
    });

    let phoneResult = false;
    let wechatResult = false;
    await delay(timeoutInterval)
    if(type === "4") {
      await page.waitForSelector('span.operate-btn:not(.disabled)',{
        timeout: timeoutInterval,
        visible: true
      });
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
    } else {
      await page.waitForSelector('span.iboss-phone:not(.disabled)',{
        timeout: timeoutInterval,
        visible: true
      })
      const element = await page.$('span.iboss-phone:not(.disabled)')
      phoneResult = true
      await element.click({debugHighlight:true})
      await page.waitForSelector('div.exchange-tooltip:not([style*="display: none"])');
      // await delay(getRandomSecondsPrecise())
      await delay(timeoutInterval)
      const phoneBtn = await page.$('div.exchange-tooltip:not([style*="display: none"]) span.boss-btn-primary');
      await phoneBtn.click({debugHighlight:true})
    }

    return phoneResult
  } catch (error) {
    console.error(error);
    return false
  }
}

/** 接受交换手机和微信 */
export const acceptApply = async (page, text, type="4") => {
  let acceptResult = false;
  try {
    dashboardWindow.webContents.send("sendMessageToRender", {
      module: type === "4" ? ComponentsObject["沟通"].name : ComponentsObject["牛人管理"].name,
      action: `尝试接受【${text.trim()}】交换【手机】及【微信】`,
    });

    type === "4" ?
    await page.waitForSelector('div.notice-blue-list div.op a:last-child',{
      timeout: timeoutInterval,
      visible: true
    }) :
    await page.waitForSelector('.message-card-buttons span:last-child',{
      timeout: timeoutInterval,
      visible: true
    });

    const element = type === "4" ? await page.$('div.notice-blue-list div.op a:last-child') : await page.$('.message-card-buttons span:last-child');
    await element.click({debugHighlight:true});
    acceptResult = true
    return acceptResult;
  } catch (error) {
    console.error(error);
    return acceptResult;
  }
}

/** 更新手机和微信 */
export const updatePhoneAndWeixin = async (geekInfo, scriptType="4") => {
  try {
    const response = await net.fetch(`http://192.168.2.6:8080/api/Candidate/updatePhoneOrWXCode?bossCandidateID=${geekInfo.uid}&mobilePhone=${geekInfo.phone || ""}&WXCode=${geekInfo.weixin ||""}`, {
      method:"get",
      headers: {
        'Content-Type': "application/json",
        'Authorization': token,
      }
    });
    if(response.ok) {
      dashboardWindow.webContents.send("sendMessageToRender", {
        module: scriptType === "4" ? ComponentsObject["沟通"].name : ComponentsObject["牛人管理"].name,
        action: `更新候选人手机和微信数据，成功`,
      });
      const body = await response.json()
      return "更新候选人手机和微信数据，成功"
    } else {
      dashboardWindow.webContents.send("sendMessageToRender", {
        module: scriptType === "4" ? ComponentsObject["沟通"].name : ComponentsObject["牛人管理"].name,
        action: `更新候选人手机和微信数据，失败`,
      });
      return "更新候选人手机和微信数据，失败"
    }
  } catch (error) {
    dashboardWindow.webContents.send("sendMessageToRender", {
      module: scriptType === "4" ? ComponentsObject["沟通"].name : ComponentsObject["牛人管理"].name,
      action: `更新候选人手机和微信数据，失败`,
    });
    console.log(consoleColor["红色"],error)
    return "更新候选人手机和微信数据，失败"
  }

}