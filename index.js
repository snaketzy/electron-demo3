import {
  BrowserWindow,
  app,
  session,
  net,
  screen,
  ipcMain
} from "electron";
import pie from "puppeteer-in-electron";
import puppeteer from "puppeteer-core";
// import { createCursor, installMouseHelper } from "ghost-cursor";
import {
  element1,
  element2,
  ComponentsObject,
  createMenu,
  consoleColor,
  setToken,
  setTokenExpireStart,
  timeoutInterval,
  setDashboardWindow,
  setBossWindow
} from "./config.js";
import { handleRecommendModule } from "./modules/RecommendModule.js";
import { handleChatModule } from "./modules/ChatModule.js";
import { GetBossHttpData } from "./GetHttpData.js";

import url from "url";
import path from "path";
import { delay } from "./utils/Tools.js";
import dayjs from 'dayjs';
// import * as customParseFormat from 'dayjs/plugin/customParseFormat';
// dayjs.extend(customParseFormat);

/** boss机器人窗口 */
let bossWindow;
/** boss机器人工作台 */
let dashboardWindow;

/** 扫码登录定时检测器 */
let scanToLoginCheckInterval;
/** 桌面端弹框检测 */
let checkDesktopDialogInterval;
/** 推荐牛人列表数据 */
let geekList = undefined;
/** 当前激活的岗位列表 */
let onlineJobList = [];
/** 沟通数据 */
let historyMsg = undefined;
/** 当前登录用户信息 */
let userInfo = undefined;
/** 列表正在处理时，如果数据接口有反馈的判断标志位 */
let isGeekListProcessing = false;
/** 允许工作时间; 接受渲染进程的赋值 */
let onlineRange = [];
/** 工作间歇 单位 分钟; 接受渲染进程的赋值*/
let workingGap = 30;
/** 本次运行开始时间 */
let latestBeginTime = undefined;
/** 是否暂停 */
let isPaused = false;

/** 更新沟通数据 */
const updateHistoryMsg = () => {
  return historyMsg;
}


let __filename = url.fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);

/** 检查扫码登录是否失效 */
const checkScanToLoginIsExpire =  (page) => {
  scanToLoginCheckInterval = setTimeout( () => {
    doCheckScanToLoginIsExpire(page)
  }, timeoutInterval)
}

/** 检查扫码登录是否过期 */
const doCheckScanToLoginIsExpire = async(page) => {
  scanToLogin(page)
  console.log(consoleColor["蓝色"], "checkScanToLoginIsExpire -> 当前页面URL为：", page.url(), new Date().toLocaleTimeString())
  if(!page.url().includes("web/user/?ka=header-login")) {
    clearTimeout(scanToLoginCheckInterval)
    scanToLoginCheckInterval = null;
    moduleProcessSchema(page)
  } else {
    // dashboardWindow.webContents.send("sendMessageToRender", {
    //   module: ComponentsObject["登录/注册"].name,
    //   action: "扫码登录",
    // });
    await page.waitForSelector("button[ka='refresh_app_sao_qrcode']")
    const refreshBtn = await page.$("button[ka='refresh_app_sao_qrcode']");
    if(refreshBtn) {
      clearTimeout(scanToLoginCheckInterval) // 清除循环器
      scanToLoginCheckInterval = null;
      handleCheckScanToLoginIsExpire(page, refreshBtn) // 获取新qrcode
    } else {
      checkScanToLoginIsExpire(page)
    }
  }
}

/**
 * 1、检查是否有桌面端弹框,如有则关闭
 * 2、检查当前运行时常，默认超过30分钟暂停10分钟
 */
const checkDesktopDialog = (page) => {
  checkDesktopDialogInterval = setTimeout(async() => {
    try {
      await page.waitForSelector(ComponentsObject["全局"].children["桌面端dialog"].path)
      const desktopDialog = await page.$(ComponentsObject["全局"].children["桌面端dialog"].path)
      const close = await page.$(ComponentsObject["全局"].children["桌面端dialog"].children["关闭按钮"].path)
      console.log(consoleColor["蓝色"], "checkDesktopDialog -> 检测是否有桌面端dialog：", close ? "是" : "否",  new Date().toLocaleTimeString())
      if(desktopDialog && close) {
        close.click({debugHighlight:true})
        checkDesktopDialog(page)
      } else {
        checkDesktopDialog(page)
      }
    } catch(error) {
      console.log(consoleColor["红色"], "checkDesktopDialog: no desk")
      checkDesktopDialog(page)
    }
  }, timeoutInterval)
}

/** 登录状态失效时的处理 */
const handleCheckScanToLoginIsExpire = async(page, btn) => {
  delay(timeoutInterval).then(async() => {
    await btn.click({debugHighlight:true})
    checkScanToLoginIsExpire(page)
  })
}

/** 各核心模块业务处理逻辑 */
const moduleProcessSchema = async(page) => {
  const moduleUrl = page.url();
  switch(true) {
    // 沟通模块
    case moduleUrl.includes("web/chat/index"):{
      dashboardWindow.webContents.send("sendMessageToRender", {
        module: ComponentsObject["沟通"].name,
        action: `已进入【${ComponentsObject["沟通"].name}】模块`,
      });
      await delay(timeoutInterval);
      const afterHandleChatModule = new Promise((resolve) => {
        return handleChatModule(page,updateHistoryMsg, userInfo, resolve)  
      })
      afterHandleChatModule.then(async (val) => {
        dashboardWindow.webContents.send("sendMessageToRender", {
          module: ComponentsObject["沟通"].name,
          action: `刷新本模块后，跳转【${ComponentsObject["推荐牛人"].name}】模块`,
        });
        await delay(timeoutInterval);
        page.reload().then(async() => {
          await delay(timeoutInterval);
          await routeToMenu(page, ComponentsObject["推荐牛人"])
        })
      })
      break;
    }
    // 推荐牛人模块,因此模块接口请求有特殊判断，因此不走此处理分支
    // case moduleUrl.includes("web/chat/recommend"):{
    //   clearTimeout(scanToLoginCheckInterval)
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

/** 主函数 */
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

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;
  const dashboardWindowWidth = Math.floor(screenWidth / 2); // 窗口宽度为屏幕宽度的一半
  // const dashboardWindowHeight = Math.floor(screenHeight * 0.75); // 窗口高度为屏幕高度的3/4，可根据需要调整
  const dashboardWindowHeight = 200; // 窗口高度为屏幕高度的3/4，可根据需要调整
  const dashboardWindowX = Math.floor(dashboardWindowWidth / 16); // x坐标设置为0，即紧贴屏幕左边缘
  const dashboardWindowY = Math.floor((screenHeight - dashboardWindowHeight) / 16); // 计算y坐标以使窗口在垂直方向上居中
  const bossWindowX = dashboardWindowX;
  const bossWindowY = dashboardWindowY + dashboardWindowHeight - 5;


  bossWindow = new BrowserWindow({
    x: bossWindowX,
    y: bossWindowY,
    width: 1366,
    height: 600,
    icon: path.join(__dirname, 'assets/favicon.ico'),
    webPreferences:{
      webSecurity:false,
      nodeIntegration: false,
      contextIsolation: true,
      nodeIntegrationInSubFrames: false,
      allowRunningInsecureContent: true,
      preload: path.join(__dirname, "./renderer/preload.mjs")
    },
    autoHideMenuBar: true,
    resizable: false
  });
  setBossWindow(bossWindow)

  // const url = "https://www.zhipin.com/web/chat/job/list";

  dashboardWindow = new BrowserWindow({
    x: dashboardWindowX,
    y: dashboardWindowY,
    width: 1366,
    height: 300,
    icon: path.join(__dirname, 'assets/favicon.ico'),
    webPreferences:{
      preload: path.join(__dirname, './renderer/preload.mjs'),
      nodeIntegration: false,
      nodeIntegrationInSubFrames: false,
      contextIsolation: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
      sandbox: false
    },
    resizable: false
  })
  setDashboardWindow(dashboardWindow)
  // dashboardWindow.loadFile("renderer/pure/index.html")
  dashboardWindow.loadURL("http://localhost:9188")

  dashboardWindow.webContents.on("did-finish-load", async () => {
    GetBossHttpData(bossWindow)

    const url = ComponentsObject["登录/注册"].url;
    await bossWindow.loadURL(url);
    await delay(timeoutInterval)
    checkScanToLoginIsExpire(page);
    checkDesktopDialog(page);
  })

  const page = await pie.getPage(browser, bossWindow);

  page.on("load", (event) => {
    // debugger
    // scanToLogin(page)
  })
  
  /** 监听控制台消息 */
  page.on('console', message => {
    try {
      console.log(consoleColor["蓝色"], `控制台消息: ${message.text()}`);
    } catch(error) {
      console.log(consoleColor["红色"], `控制台异常: ${error}`);
    }
  });

  /** 监听请求事件 */
  page.on("request", async response => {
    if(response.postData &&　response.postData() && response.postData().includes("message-arrived-expose")) {
      console.log(consoleColor["蓝色"], '对话消息检测：', response.postData());
    }
  })

  /** 监听响应事件 */
  page.on('response', async response => {
    const url = response.url();
    
    if(url.includes("getUserInfo")) {
      const body = await response.text();
      const bodyJson = JSON.parse(body);
      console.log(consoleColor["蓝色"], "getUserInfo:",bodyJson)
      if(bodyJson.code === 0 && bodyJson.zpData["/wapi/zpuser/wap/getUserInfo.json"]) {
        userInfo = bodyJson.zpData["/wapi/zpuser/wap/getUserInfo.json"].zpData;  
      } 
      if(bodyJson.code === 0 && bodyJson.zpData.userId) {
        userInfo = bodyJson.zpData
      }

      dashboardWindow.webContents.send("sendMessageToRender", {
        module: ComponentsObject["全局"].name,
        action: "返回招聘者信息",
        data: userInfo
      });


      // 登陆失效状态，目前不走此逻辑分支
      if(bodyJson.code === 7) {
        return
        await page.waitForSelector(ComponentsObject["登录/注册"].children["APP扫码登陆"].path)
        const qrBtn = await page.$(ComponentsObject["登录/注册"].children["APP扫码登陆"].path)
        if(qrBtn) {
          delay(timeoutInterval).then(() => routeToMenu(page,ComponentsObject["登录/注册"].children["APP扫码登陆"]))
          return
        }
      }
    }
    // 推荐牛人列表数据
    if(url.includes("zpjob/rec/geek/list")) {
      if(isGeekListProcessing) {
        return
      } else {
        // dashboardWindow.webContents.send("sendMessageToRender", {
        //   module: ComponentsObject["推荐牛人"].name,
        //   action: "在推荐牛人列表上进行打招呼操作",
        // });
        isGeekListProcessing = true;
        console.log(onlineJobList)
        const jobId = new URLSearchParams(url.split("?")[1]).get("jobId");
        const jobInfo = onlineJobList.find((job) => job.encryptId === jobId);
        clearTimeout(scanToLoginCheckInterval)
        // console.log(`响应: ${response.status()} ${response.url()}`);
        // 如需获取响应体，注意这可能消耗较多内存且降低性能
        const body = await response.text();
        // console.log(`牛人列表数据: ${body}`);
        geekList = Array.isArray(JSON.parse(body).zpData.geekList) ? JSON.parse(body).zpData.geekList : undefined;
        
        if(geekList) {
          const afterHandleRecommendModule = new Promise((resolve) => {
            return handleRecommendModule(page, geekList, userInfo, jobInfo, resolve)
          })
          // 推荐牛人列表
          afterHandleRecommendModule.then(async (val) => {
            isGeekListProcessing = false;
            dashboardWindow.webContents.send("sendMessageToRender", {
              module: ComponentsObject["推荐牛人"].name,
              action: `跳转【${ComponentsObject["沟通"].name}】模块`,
            });
            await delay(timeoutInterval)
            await routeToMenu(page, ComponentsObject["沟通"])
            checkScanToLoginIsExpire(page);
          })
        }
      }
    }
    // 推荐职位列表
    if(url.includes("wapi/zpjob/job/recJobList")) {
      const body = await response.text();
      onlineJobList = JSON.parse(body).zpData.onlineJobList;
    }
    // 对话历史记录
    //  if(url.includes("historyMsg")) {
    //   const body = await response.text();
    //   // console.log(`对话历史记录: ${body}`);
    //   historyMsg = JSON.parse(body).zpData.messages;
    // }
  });

  getToken();

  createMenu();
  
  // test1(page)
  // test2(page)
  // test3(page)
  // test4(page)
  

  
  dashboardWindow.on("move", () => {
    clearTimeout(dashboardWindow.moveTimeout);
    dashboardWindow.moveTimeout = setTimeout(() => {
      updateSecondWindowPosition();
    }, 100);
  })
  handleRenderer()
};

// 更新boss窗口的函数
const updateSecondWindowPosition = () => {
  if (!dashboardWindow || dashboardWindow.isDestroyed()) return;
  if (!bossWindow || bossWindow.isDestroyed()) return;

  const mainPosition = dashboardWindow.getPosition();
  const mainSize = dashboardWindow.getSize();

  // 计算窗口B的新位置
  const newX = mainPosition[0];
  const newY = mainPosition[1] + mainSize[1];

  // 设置窗口B的位置
  bossWindow.setPosition(newX, newY);
}

/** 处理渲染进程 */
const handleRenderer = () => {
    // 处理预加载脚本转发的渲染进程消息
    ipcMain.handle('message-from-renderer', async (event, data) => {
      console.log(consoleColor["蓝色"], '返回渲染进程数据:', data);
      if (data.showBoss) {
        bossWindow.showInactive()
      } else {
        bossWindow.hide()
      }
      return 'Response from main process';
    });

    ipcMain.handle("data-transfer" ,(event,data) => {
        console.log("data:", data)
    })

    /** 监听渲染进程的toggleTargetWindow通知 */
    ipcMain.handle("toggleTargetWindow",(event, data) => {
      if(data.status === "show") {
        targetWin.showInactive()
      } else {
        targetWin.hide() 
      }
    })

    /** 监听渲染进程的定时器通知 */
    ipcMain.handle("tick-tock", (event,data ) => {
      startTimer(data.status)
    })

    ipcMain.handle("fetch-response",(event, data) => {
      debugger
      console.log(data)
    })
}

/** 获取token */
const getToken = async() => {
  const response = await net.fetch('http://192.168.2.6:8080/api/Auth/login', {
    method:"post",
    headers: {
      'Content-Type': "application/json"
    },
    body: JSON.stringify({
      username: "18916827968",
      password: "111111"
    }) 
  });
  if(response.ok) {
    const body = await response.json()
    console.log(consoleColor["蓝色"],"请求token接口：", body.data.token)
    setToken(`Bearer ${body.data.token}`)
    setTokenExpireStart(new Date().getTime())
  }
}

/** 扫码登陆 */
const scanToLogin = async(page) => {
  try {
    if(page.url().includes(ComponentsObject["登录/注册"].url)) {
      const qrBtnExist = await page.waitForSelector(ComponentsObject["登录/注册"].children["APP扫码登陆"].path)
      if(qrBtnExist) {
        const qrBtn = await page.$(ComponentsObject["登录/注册"].children["APP扫码登陆"].path)
        if(qrBtn) {
          delay(timeoutInterval).then(() => routeToMenu(page,ComponentsObject["登录/注册"].children["APP扫码登陆"]))
          return
        }
      }
    }
  } catch (err) {
    console.log(consoleColor["红色"],"控制台异常：", err)
  }
}

/** 跳转指定菜单 */
const routeToMenu = async(page, routeElement) => {
  await page.waitForSelector(routeElement.path)
  const element = await page.$(routeElement.path)
  // delay(timeoutInterval).then(async() =>)
  await element.click({debugHighlight:true})
}


main();