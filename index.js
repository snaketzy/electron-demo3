import { BrowserWindow, app, session } from "electron";
import pie from "puppeteer-in-electron";
import puppeteer from "puppeteer-core";
// import { createCursor, installMouseHelper } from "ghost-cursor";
import { element1, element2, ComponentsObject, createMenu } from "./config.js";
import { handleRecommendModule } from "./modules/RecommendModule.js";
import { handleChatModule } from "./modules/ChatModule.js";
import { GetBossHttpData } from "./GetHttpData.js";
import os from "os";
import url from "url";
import path from "path";


const delay = (time) => {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}

/** 扫码登录是否失效 */
let scanToLoginIsExpire = false;
/** 扫码登录循环器 */
let scanToLoginCheckInterval;
/** 桌面端弹框检测 */
let checkDesktopDialogInterval;
/** 推荐牛人列表数据 */
let geekList = undefined;
/** 沟通数据 */
let historyMsg = undefined;
/** 当前登录用户信息 */
let userInfo = undefined;

/** 更新沟通数据 */
const updateHistoryMsg = () => {
  debugger
  return historyMsg;
}
let __filename = url.fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);

/** 检查扫码登录是否失效 */
const checkScanToLoginIsExpire = (page) => {
  scanToLogin()
  scanToLoginCheckInterval = setInterval(async() => {
    console.log("checkScanToLoginIsExpire -> 当前页面URL为：", page.url())
    if(!page.url().includes("web/user/?ka=header-login")) {
      moduleProcessSchema(page)
    } else {
      await page.waitForSelector("button[ka='refresh_app_sao_qrcode']")
      const refreshBtn = await page.$("button[ka='refresh_app_sao_qrcode']");
      if(refreshBtn) {
        clearInterval(scanToLoginCheckInterval) // 清除循环器
        handleCheckScanToLoginIsExpire(page, refreshBtn) // 获取新qrcode
      }
    }
  }, 2000)
}

/** 检查是否有桌面端弹框,如有则关闭 */
const checkDesktopDialog = (page) => {
  checkDesktopDialogInterval = setInterval(async() => {
    try {
      await page.waitForSelector(ComponentsObject["全局"].children["桌面端dialog"].path)
      const desktopDialog = await page.$(ComponentsObject["全局"].children["桌面端dialog"].path)
      const close = await page.$(ComponentsObject["全局"].children["桌面端dialog"].children["关闭按钮"].path)
      console.log("checkDesktopDialog -> 检测是否有桌面端dialog：", close ? "是" : "否")
      if(desktopDialog && close) {
        close.click({debugHighlight:true})
      }
    } catch(error) {
      console.log("no desk")
    }
  }, 2000)
}

/** 扫码签约失效时的处理 */
const handleCheckScanToLoginIsExpire = async(page, btn) => {
  delay(1000).then(async() => {
    await btn.click({debugHighlight:true})
    checkScanToLoginIsExpire(page)
  })
}

/** 各核心模块业务处理逻辑 */
const moduleProcessSchema = async(page) => {
  const moduleUrl = page.url();
  // clearInterval(scanToLoginCheckInterval)
  switch(true) {
    // 沟通模块
    case moduleUrl.includes("web/chat/index"):{
      clearInterval(scanToLoginCheckInterval)
      const afterHandleChatModule = new Promise((resolve) => {
        return handleChatModule(page,updateHistoryMsg, userInfo, resolve)  
      })
      afterHandleChatModule.then((val) => {
        page.reload(); 
        routeToMenu(page,ComponentsObject["推荐牛人"])
      })
      break;
    }
    // 推荐牛人模块,因此模块接口请求有特殊判断，因此不走此处理分支
    // case moduleUrl.includes("web/chat/recommend"):{
    //   clearInterval(scanToLoginCheckInterval)
    //   handleRecommendModule(page, geekList)
    //   break;
    // }
  }
}

/** 判断职位管理模块已载入 */
const validateJobListVisible = async(page) => {
  const frames = page.frames();
  let frame = null;
  for (const currentFrame of frames) {
    if (currentFrame.url().includes('/web/frame/job/list-new')) {
      frame = currentFrame;
      break;
    }
  }
  if (frame) {
    await frame.waitForSelector("div.add-btn",{
      visible: true
    })
    const element = await page.$("div.add-btn")
    return element
  } 
}

const main = async () => {
  await pie.initialize(app);
  const browser = await pie.connect(app, puppeteer);

  // 应用就绪后，再获取 defaultSession 并设置监听
  session.defaultSession.webRequest.onBeforeSendHeaders(
    { urls: ['*://*/*'] }, // 考虑使用更明确的 URL 模式
    (details, callback) => {
      // 添加或修改请求头
      details.requestHeaders['user-agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36';
      details.requestHeaders['sec-ch-ua'] = '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"';
      // 通过 callback 继续发送请求并传入修改后的请求头
      callback({ cancel: false, requestHeaders: details.requestHeaders });
    }
  );

  const window = new BrowserWindow({
    width: 1366,
    height: 768,
    webPreferences:{
      webSecurity:false,
      nodeIntegration: true,
      contextIsolation: true,
      nodeIntegrationInSubFrames: true,
      allowRunningInsecureContent: true,
      preload: path.join(__dirname, "renderer/preload.mjs")
    }
  });
  // const url = "https://www.zhipin.com/web/chat/job/list";

  GetBossHttpData(window)

  const url = ComponentsObject["登录/注册"].url;
  await window.loadURL(url);

  const page = await pie.getPage(browser, window);

  // test1(page)

  // test2(page)

  // test3(page)
  page.on("load", (event) => {
    // debugger
    // scanToLogin(page)
  })
  
  /** 监听控制台消息 */
  page.on('console', message => {
    try {
      console.log(`控制台消息: ${message.text()}`);
    } catch(error) {

    }
  });

  /** 监听请求事件 */
  page.on("request", async response => {
    if(response.postData &&　response.postData() && response.postData().includes("message-arrived-expose")) {
      console.log('对话消息检测：', params);
    }
  })

  /** 监听响应事件 */
  page.on('response', async response => {
    const url = response.url();
    if(url.includes("getUserInfo")) {
      const body = await response.text();
      const bodyJson = JSON.parse(body);
      console.log(bodyJson)
      userInfo = bodyJson.code !== 7 && bodyJson.zpData["/wapi/zpuser/wap/getUserInfo.json"].zpData;
    }
    // 推荐牛人列表数据
    if(url.includes("zpjob/rec/geek/list")) {
      clearInterval(scanToLoginCheckInterval)
      // console.log(`响应: ${response.status()} ${response.url()}`);
      // 如需获取响应体，注意这可能消耗较多内存且降低性能
      const body = await response.text();
      // console.log(`牛人列表数据: ${body}`);
      geekList = Array.isArray(JSON.parse(body).zpData.geekList) ? JSON.parse(body).zpData.geekList : undefined;
      
      if(geekList) {
        const afterHandleRecommendModule = new Promise((resolve) => {
          return handleRecommendModule(page, geekList, userInfo, resolve)
        })
        afterHandleRecommendModule.then((val) => {
          debugger
        })
      }
    }
    // 对话历史记录
    //  if(url.includes("historyMsg")) {
    //   const body = await response.text();
    //   // console.log(`对话历史记录: ${body}`);
    //   historyMsg = JSON.parse(body).zpData.messages;
    // }
  });

  checkScanToLoginIsExpire(page);
  checkDesktopDialog(page);
  createMenu()
  // test4(page)
};


/** 扫码登陆 */
const scanToLogin = async(page) => {
  try {
    if(page.url().includes(ComponentsObject["登录/注册"].url)) {
      await page.waitForSelector("div.ewm-switch div.switch-tip")
      const qrBtn = await page.$("div.ewm-switch div.switch-tip")
      if(qrBtn) {
        delay(1000).then(() => routeToMenu(page,ComponentsObject["登录/注册"].children["APP扫码登陆"]))
        return
      }

      
    }
  } catch (err) {
    console.log(err)
  }
}

/** 跳转指定菜单 */
const routeToMenu = async(page, routeElement) => {
  await page.waitForSelector(routeElement.path)
  const element = await page.$(routeElement.path)
  delay(1000).then(async() =>await element.click({debugHighlight:true}))
}


main();