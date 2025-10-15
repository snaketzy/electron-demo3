import {ComponentsObject, consoleColor, dashboardWindow, timeoutInterval, token, typeDelay} from "../config.js";
import {net} from "electron";
import {delay} from "../utils/Tools.js";
import {acceptApply, applyCellPhoneAndWechat, fetchContext, replyMessage} from "./Common.js";

/**
 * 牛人管理模块处理逻辑
 * @param page ptr的page对象
 * @param resolve promise
 */
export const handleGeekManageModule = async(page, userInfo, resolve) => {
  try {
    resolve("本轮牛人管理模块业务处理完毕")
    return

    const frames = page.frames();
    let frame = null;
    for (const currentFrame of frames) {
      if (currentFrame.url().includes('/web/frame/report/geek-manage')) {
        frame = currentFrame;
        break;
      }
    }

    if(frame) {
      // 1、获取复聊牛人列表
      dashboardWindow.webContents.send("sendMessageToRender", {
        module: ComponentsObject["牛人管理"].name,
        action: `开始【获取系统内候选人不存在手机号码的随机100人】`,
      });
      const rechatCandidateArray = await fetchCandidatePhone();
      // 2、对复聊牛人列表进行循环复聊
      const handleRechatCandidateResult = await handleRechatCandidateArray(page,frame,userInfo,rechatCandidateArray)
      if(handleRechatCandidateResult) {
        await delay(timeoutInterval);
        dashboardWindow.webContents.send("sendMessageToRender", {
          module: ComponentsObject["牛人管理"].name,
          action: "本轮【牛人管理】模块业务处理完毕",
        });
        resolve("本轮牛人管理模块业务处理完毕");
      }
    }
  }catch(err) {
    console.log(err);
  }
}

/** 获取系统内候选人不存在手机号码的随机100人 */
const fetchCandidatePhone = async () => {
  try {
    const response = await net.fetch('http://192.168.2.6:8080/api/Candidate/QuerycandidatePhone', {
      method:"get",
      headers: {
        'Content-Type': "application/json",
        'Authorization': token,
      }
    });
    if(response.ok) {
      dashboardWindow.webContents.send("sendMessageToRender", {
        module: ComponentsObject["牛人管理"].name,
        action: `获取系统内候选人不存在手机号码的随机100人，成功`,
      });
      const body = await response.json()
      return body.data
      // return [{candidateName:"郑郭声"}] // 朱祝华
    } else {
      dashboardWindow.webContents.send("sendMessageToRender", {
        module: ComponentsObject["牛人管理"].name,
        action: `QuerycandidatePhone，response failure`,
      });
      console.log(consoleColor["红色"],response)
    }
  } catch (error) {
    dashboardWindow.webContents.send("sendMessageToRender", {
      module: ComponentsObject["牛人管理"].name,
      action: `QuerycandidatePhone，异常`,
    });
    console.log(error);
  }
}

/** 处理复聊列表 */
const handleRechatCandidateArray = async (page, frame,userInfo,rechatCandidateArray) => {
  // 处理每个复聊牛人
  for(const [index,candidate] of rechatCandidateArray.entries()) {
    try {
      dashboardWindow.webContents.send("sendMessageToRender", {
        module: ComponentsObject["牛人管理"].name,
        action: `处理【${candidate.candidateName}】的复聊`,
      });
      await handleRechatCandidate(page, frame, userInfo, candidate)
      // if(index === rechatCandidateArray.length - 1) {
      if(index === 9) {
        dashboardWindow.webContents.send("sendMessageToRender", {
          module: ComponentsObject["牛人管理"].name,
          // action: `全部${rechatCandidateArray.length}个复聊对话完成`,
          action: `前10个复聊对话完成`,
        });
        await delay(timeoutInterval);
        return "前10个复聊对话完成"
      }
      // return
      // debugger
    } catch (error) {
      console.log(error);
    }
  }
}

/** 处理每个复聊牛人 */
const handleRechatCandidate = async (page, frame,userInfo, rechatCandidate) => {
  // 定位搜索牛人姓名输入框
  await frame.waitForSelector(ComponentsObject["牛人管理"].children["牛人列表"].children["搜索姓名"].path,{
    timeout: timeoutInterval,
    visible: true
  })
  const inputElement = await frame.$(ComponentsObject["牛人管理"].children["牛人列表"].children["搜索姓名"].path)
  await inputElement.click()
  await frame.type(ComponentsObject["牛人管理"].children["牛人列表"].children["搜索姓名"].path, rechatCandidate.candidateName ,{delay: 1000})
  await page.keyboard.press('Enter');

  // 使用waitForResponse等待特定的网络响应
  const response = await page.waitForResponse(response => {
    return response.url().includes("manage/geekListV2");
  }, { timeout: timeoutInterval });

  // 这里可以处理响应数据
  const responseData = await response.json();
  console.log('查询响应:', responseData);

  // return
  await delay(timeoutInterval)

  try {
    const actionBtn = await frame.$(ComponentsObject["牛人管理"].children["牛人列表"].children["沟通"].path)
    await actionBtn.click()

    // 进行复聊业务内容处理
    const handleRechatResult = await doHandleRechatDialog(page, rechatCandidate.candidateName)

    await delay(timeoutInterval)
    const closeBtn = await page.$(ComponentsObject["牛人管理"].children["牛人列表"].children["沟通"].children["关闭"].path)
    // await delay(timeoutInterval*100)
    await closeBtn.click()

    await delay(timeoutInterval)
    const clearBtn = await frame.$(ComponentsObject["牛人管理"].children["牛人列表"].children["搜索姓名"].children["清空"].path)
    await clearBtn.click()

    if(handleRechatResult) {
      return responseData; // 明确返回结果
    }
  } catch (error) {
    console.log(error);
    const clearBtn = await frame.$(ComponentsObject["牛人管理"].children["牛人列表"].children["搜索姓名"].children["清空"].path)
    await clearBtn.click()

    return responseData; // 明确返回结果
  }

}

/** 打开复聊窗口，进行复聊 */
const doHandleRechatDialog = async (page, geekName) => {

  const historyMsgResponse = await page.waitForResponse(response => {
    return response.url().includes("historyMsg");
  }, { timeout: timeoutInterval });
  const geekInfoResponse = await page.waitForResponse(response => {
    return response.url().includes("geek/info");
  }, { timeout: timeoutInterval });
  await delay(timeoutInterval);

  // return true;

  dashboardWindow.webContents.send("sendMessageToRender", {
    module: ComponentsObject["牛人管理"].name,
    action: `从boss获取和【${geekName}】的历史聊天记录`,
  });
  const historyMsgResult = await historyMsgResponse.json();
  const geekInfoResult = await geekInfoResponse.json();

  dashboardWindow.webContents.send("sendMessageToRender", {
    module: ComponentsObject["牛人管理"].name,
    action: `开始从大数据模型获取回复【${geekName}】的内容`,
  });
  const chatContext = await fetchContext(historyMsgResult, geekInfoResult, "3");
  await delay(timeoutInterval);
  const replyMessageResult = await replyMessage(page,chatContext, geekName, "3");
  // 接受交换手机和微信申请
  const acceptApplyResult = await acceptApply(page,geekName, "3")
  // 如果可以交换手机和微信，就执行对应操作
  const applyCellPhoneAndWechatResult = await applyCellPhoneAndWechat(page, geekName, "3")
  return true;
}

