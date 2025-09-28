import { BrowserWindow, app, session, net } from "electron";
import pie from "puppeteer-in-electron";
import puppeteer from "puppeteer-core";
import { delay, getRandomSecondsPrecise } from "../utils/Tools.js";
import {ComponentsObject, consoleColor, dashboardWindow, timeoutInterval, token, typeDelay,} from "../config.js";
import dayjs from 'dayjs';


/** 沟通模块处理主逻辑 */
export const handleChatModule = async(page, updateHistoryMsg, userInfo, resolve) => {
  console.log("沟通模块处理逻辑")
  // resolve("本轮沟通模块业务处理完毕")
  // return
  // 切换到未读消息
  await page.waitForSelector("div.chat-message-filter-left :last-child",{
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
  await delay(timeoutInterval);
  // const response = await fetchToken();
  // console.log("请求token接口：", response)
  const locationResult = await locationUnreadItem(page,updateHistoryMsg, userInfo)
  if(locationResult) {
    dashboardWindow.webContents.send("sendMessageToRender", {
      module: ComponentsObject["沟通"].name,
      action: "本轮【沟通】模块业务处理完毕",
    });
    await delay(timeoutInterval);
    resolve("本轮沟通模块业务处理完毕")
  }
}

/** 定位每个未读对话，并获得对应的对话记录 */
const locationUnreadItem = async(page,updateHistoryMsg, userInfo) => {
  let funcContinue = 1;
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
          const geekInfoResult = await geekInfoResponse.json();
          dashboardWindow.webContents.send("sendMessageToRender", {
            module: ComponentsObject["沟通"].name,
            action: `从boss获取【${text.trim()}】的信息`,
          });
          await delay(timeoutInterval);
          const chatContext = await fetchContext(historyMsgResult, geekInfoResult, userInfo);
          dashboardWindow.webContents.send("sendMessageToRender", {
            module: ComponentsObject["沟通"].name,
            action: `从大数据模型生成回复【${text.trim()}】的内容`,
          });
          await delay(timeoutInterval);
          const replyMessageResult = await replyMessage(page,chatContext, text);

          // 如果可以交换手机和微信，就执行对应操作
          const applyCellPhoneAndWechatResult = await applyCellPhoneAndWechat(page, text)
          console.log(replyMessageResult)
          // if(index === 0) {
          //   dashboardWindow.webContents.send("sendMessageToRender", {
          //     module: ComponentsObject["沟通"].name,
          //     action: `全部${unreadItems.length}个未读对话完成`,
          //   });
          //   // return "全部对话完成"
          // }
          if(index === unreadItems.length - 1) {
            dashboardWindow.webContents.send("sendMessageToRender", {
              module: ComponentsObject["沟通"].name,
              action: `全部${unreadItems.length}个未读对话完成`,
            });
            await delay(timeoutInterval);
            if(funcContinue === 1) {
              return "全部对话完成"
            }
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
    // debugger
    await delay(timeoutInterval);
    if(funcContinue === 1) {
      return "全部对话完成"
    }
  }
  
}

/** 根据对话上下文，从接口获取话术 */
const fetchContext = async(historyMsgResult, geekInfoResult, userInfo) => {
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
          // robotCode: `${userInfo.userId}`,
          bossCandidateID: `${geekInfo.uid}`,
          scriptType: "4",
          // scriptContent: JSON.stringify(historyMsgResult.zpData.messages)
        })
      });
      if(response.ok) {
        const body = await response.json()
        return body.data.scriptContent
      } else {
        console.log(consoleColor["红色"],response)
      }
    } else {
      console.log(consoleColor["红色"],submitChatResponse)
    }
  } catch(error) {
    return error || "response failure"
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
const assembleSubmitChatArray = (historyMsgResult,geekInfo) => {
  const historyMsgResultArray = historyMsgResult.zpData.messages || [];
  const chatArray = [];
  if(historyMsgResultArray.length > 0) {
    historyMsgResultArray.forEach(msg => {
      chatArray.push({
        bossJobName: geekInfo.position,
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
const replyMessage = async(page, chatContext, text) => {
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
}

/** 交换手机和微信 */
const applyCellPhoneAndWechat = async(page, text) => {
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
}