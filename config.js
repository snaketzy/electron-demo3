
import {BrowserWindow, Menu} from "electron"

/** 设置page对象 */
export let page;
export const setPage = (pageObject) => {
  page = pageObject
}

/** 发布职位 div */
export const element1 = "div.add-btn";
/** 职位名称 input */
export const element2 = ".job-name-input";
/** url前缀 */
export const prefixUrl = "https://www.zhipin.com";

/** 是否允许运行后续代码 */
export let funcContinue = true;
export const setIsFuncContinue = (result) => {
  funcContinue = result;
}

/** 是否工作时间 */
export let isWorkingTime = true;
export const setIsWorkingTime = (result) => {
  isWorkingTime = result;
}

/** 每日打招呼限额 */
export let greetLimitDaily = {
  "上午": 50,
  "下午": 150,
}
export const setGreetLimitDaily = (am, pm) => {
  greetLimitDaily = {
    "上午": am,
    "下午": pm,
  }
}

/** 当日已打招呼数量 */
export let greetedToday = {
  "上午": 0,
  "下午": 0,
}
export const setGreetedToday = (am, pm) => {
  greetedToday = {
    "上午": am,
    "下午": pm,
  }
}

export let dashboardWindow;
export const setDashboardWindow = (window) => {
  dashboardWindow = window;
}

export let bossWindow;
export const setBossWindow = (window) => {
  bossWindow = window;
}

/** token开始生效时间 */
export let tokenExpireStart = null;

export const setTokenExpireStart = (timestamp) => {
  tokenExpireStart = timestamp;
}

/** 常规定时器间隔 */
export let timeoutInterval = 2000;

/** input框输入延时 */
export let typeDelay = 200;

/** 鉴权信息 */
export let token = "";

export const setToken = (tokenValue) => {
  token = tokenValue;
}

/** 控制台输出颜色 */
export const consoleColor = {
  "红色": '\x1b[31m%s\x1b[0m',
  "蓝色": '\x1b[34m%s\x1b[0m'
}

/** 各模块组件对象 */
export const ComponentsObject = {
  "前置": {
    name:"前置",
    type:"",
    element:"",
    path:"",
    url:"",
  },
  "全局": {
    name:"全局",
    type:"",
    element:"",
    path:"",
    url:"",
    children: {
      "桌面端dialog": {
        name:"桌面端dialog",
        type:"button",
        element:"div",
        path: "a[href*='desktop']",
        url:"",
        children: {
          "关闭按钮": {
            name:"关闭按钮",
            type:"button",
            element:"div",
            path: "div.boss-popup__close",
            url:"",
            children: null
          }
        }
      },
      "聊天操作container":{
        name:"聊天操作container",
        type:"div",
        element:"div",
        path:"div.operate-exchange-left",
        url:"",
        children: {
          "求简历":{
            name:"求简历",
            type:"div",
            element:"div",
            path:"div.operate-exchange-left > div:nth-child(1) > span.operate-btn:not(.disabled)",
            url:"",
            children:null
          },
          "换电话":{
            name:"换电话",
            type:"div",
            element:"div",
            path:"div.operate-exchange-left > div:nth-child(2) > span.operate-btn:not(.disabled)",
            url:"",
            children:null
          },
          "换微信":{
            name:"换微信",
            type:"div",
            element:"div",
            path:"div.operate-exchange-left > div:nth-child(3) > span.operate-btn:not(.disabled)",
            url:"",
            children:null
          },
          "约面试":{
            name:"约面试",
            type:"div",
            element:"div",
            path:"div.operate-exchange-left > div:nth-child(4) > div.operate-btn:not(.disabled)",
            url:"",
            children:null
          }
        }
      }
    }
  },
  "登录/注册": {
    name:"登录/注册",
    type:"",
    element:"",
    path:"",
    url:"https://www.zhipin.com/web/user/?ka=header-login",
    children:{
      "APP扫码登陆": {
        name:"APP扫码登陆",
        type:"button",
        element:"div",
        path: "div.login-register-content div.ewm-switch div.switch-tip",
        url:"https://www.zhipin.com/web/user/?ka=header-login",
        children: null
      },
      "刷新获取新二维码": {
        name:"刷新获取新二维码",
        type:"button",
        element: "div",
        path:"button[ka='refresh_app_sao_qrcode']",
        url:"https://www.zhipin.com/web/user/?ka=header-login",
        children: null
      }
    }
  },
  "职位管理":{
    name:"职位管理",
    type: "a",
    element: "a",
    path:  `[ka="menu-manager-job"]`,
    url: "https://www.zhipin.com/web/chat/job/list",
    children: {
      "发布职位":{
        name:"发布职位",
        type:"button",
        element:"div",
        path:"div.add-btn",
        url:"https://www.zhipin.com/web/frame/job/list-new",
        children: {
          "职位名称":{
            name:"职位名称",
            type:"input",
            element:"input",
            path:".job-name-input",
            url:"https://www.zhipin.com/web/frame/job/edit"
          }
        }
      },
      "职位类型": {
        name:"职位类型",
        type:"select",
        element:"div",
        path:".new-version.select-width.ui-select.ui-select-single",
        url:"https://www.zhipin.com/web/frame/job/list-new",
        children: null
      },
      "搜索": {
        name:"搜索",
        type:"input",
        element:"input",
        path:"#search",
        url:"https://www.zhipin.com/web/frame/job/list-new",
        children: null
      }
    }
  },
  "牛人管理": {
    name:"牛人管理",
    type: "a",
    element: "a",
    path: `[ka="action-geek-management-click"]`,
    url: "https://www.zhipin.com/web/chat/geek/manage",
    children: {
      "牛人列表": {
        name:"牛人列表",
        element: "div",
        type:"div",
        path: "",
        url:"https://www.zhipin.com/web/frame/report/geek-manage",
        children: {
          "沟通": {
            name:"沟通",
            element:"div",
            type:"div",
            path:".ui-tablepro-fixed-right .ui-tablepro-row .operate-btn",
            url:"",
            children: {
              "关闭": {
                name:"沟通",
                element:"div",
                type:"div",
                path:".bosschat-conversation-wrap .iboss-close",
                url:"",
                children: null
              }
            }
          },
          "搜索姓名": {
            name:"搜索姓名",
            element:"input",
            type:"input",
            path:"input.search-input",
            url:"",
            children: {
              "清空" :{
                name:"搜索姓名",
                element:"i",
                type:"i",
                path:".iboss-guanbi",
                url:"",
                children: null
              }
            }
          }
        }
      }
    }
  },
  "推荐牛人": {
    name:"推荐牛人",
    type: "a",
    element: "a",
    path: `[ka="menu-geek-recommend"]`,
    url: "https://www.zhipin.com/web/chat/recommend",
    children: null
  },
  "搜索牛人": {
    name:"搜索牛人",
    type: "a",
    element: "a",
    path: `[ka="menu-geek-search"]`,
    url: "https://www.zhipin.com/web/chat/search",
    children: null
  },
  "沟通":{
    name:"沟通",
    type: "a",
    element: "a",
    path: `[ka="menu-im"]`,
    url: "https://www.zhipin.com/web/chat/index",
    children: null
  },
  "意向沟通":{
    name:"意向沟通",
    type: "a",
    element: "a",
    path: `[href*="/web/chat/intention"]`,
    url: "https://www.zhipin.com/web/chat/intention",
    children: null
  },
  "个人中心":{
    name:"个人中心",
    type: "",
    element:"",
    path: "",
    url: "https://www.zhipin.com/web/chat/user-center",
    children: null
  }
}


/** 创建菜单 */
export const createMenu = () => {
  let template = [
    {
      label:"工具",
      submenu: [
        {
          label:"刷新(F5)",
          accelerator:"F5",
          click:(item, focusedWindow) => {
            if(focusedWindow) {
              focusedWindow.reload()
            }
          } 
        },
        {
          label:"切换开发者工具(F12)",
          accelerator:"F12",
          click:(item, focusedWindow) => {
            if(focusedWindow) {
              focusedWindow.webContents.toggleDevTools()
            }
          }
        }
      ]
    },
    {
      label:"帮助",
      submenu: [
        {
          label:"关于(F1)",
          accelerator:"F1",
          click:() => {
            shell.openExternal("https://premoss.viphrm.com/")
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}