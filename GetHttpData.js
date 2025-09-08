import { webContents } from "electron";
import { 
  ComponentsObject 
} from "./config.js";
console.log("gethttpdata模块")

/**
 * 可以获取到发送请求是的数据
 *  request
 * Network.requestWillBeSent
 * 可以获取到收到的响应数据-不含响应内容（可进一步获取响应内容）
 *  response
 * Network.responseReceived
 */


/**
 *
 * 用于webContents.debugger中
 * 监听网页中http请求，获取请求和响应数据
 * @param webWindow  当前窗体实例
 * @param id 窗体实例ID，用于在渲染线程显示数据
 * @constructor hzq
 */
export const GetMossHttpData = (webWindow,mainWindow) => { 
  try {
    console.log("GetMossHttpData方法")
    webWindow.webContents.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36');

    webWindow.webContents.debugger.attach("1.1"); 
    webWindow.webContents.debugger.sendCommand('Network.enable');
    webWindow.webContents.debugger.on('message', (event, method, params) => {
      // console.log("message.method",method)
      // console.log("message.params",params)
      if (method === 'Network.responseReceived') {
      webWindow.webContents.debugger.sendCommand('Network.getResponseBody', { requestId: params.requestId })
        .then(response => {
          if(params.response.mimeType === "application/json") {
            console.log("message.params",params)
            console.log("message.response", response)
            mainWindow.send("responseReceived",{params, response})
          }
        });
      }
    });
    webWindow.loadURL("https://premoss.viphrm.com") 
    webWindow.show()
  } catch (err) {
    console.log('调试器连接失败: ', err)
  }

  webWindow.webContents.debugger.on('detach', (event, reason) => {
    console.log('调试器由于以下原因而分离 : ', reason)
  });
}

/**
 *
 * 用于webContents.debugger中
 * 监听网页中http请求，获取请求和响应数据
 * @param webWindow  当前窗体实例
 * @param id 窗体实例ID，用于在渲染线程显示数据
 * @constructor hzq
 */

export const GetBossHttpData = (webWindow,mainWindow) => { 
  try {
    console.log("GetBossHttpData方法")
    webWindow.webContents.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36');

    let frameId = null;
    webWindow.webContents.debugger.attach("1.1"); 
    webWindow.webContents.debugger.sendCommand('Network.enable');
    webWindow.webContents.debugger.on('message', (event, method, params) => {
      // console.log("message.method",method)
      // console.log("message.params",params)
      if(method === "Network.requestWillBeSent") {
        /** 消息到达通知，因为需要多端同步消息，因此其他端的招聘方发送消息也会触发此通知 */
        if(params.request.postData && params.request.postData.includes("message-arrived-expose")) {
          frameId = params.frameId
          // console.log('对话消息检测：', params);
        }
      }
      if (method === 'Network.responseReceived') {
      webWindow.webContents.debugger.sendCommand('Network.getResponseBody', { requestId: params.requestId })
        .then(response => {
          if(!params.response.url.includes("json")
          ) {
            // if(params.response.url.includes("wapi/zpCommon/actionLog/common.json")) {
            //   console.log("新消息通知",params)
            // }
            if(params.frameId === frameId) {
              // console.log("新消息通知：",params)
              // console.log("新消息通知.message.response：", response)
            }
            if(params.response.url.includes("historyMsg")) {
              // console.log("收到对话历史数据：", JSON.parse(response.body))
            }           
            // console.log("message.params",params)
            // console.log("message.response", response)
            // mainWindow.send("responseReceived",{params, response})
            frameId = null
          }
        });
      }
    });
    // webWindow.loadURL(ComponentsObject["个人中心"].url) 
    // webWindow.show()
    return "loaded"
  } catch (err) {
    console.log('调试器连接失败: ', err)
  }

  webWindow.webContents.debugger.on('detach', (event, reason) => {
    console.log('调试器由于以下原因而分离 : ', reason)
  });
}
