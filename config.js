
import { Menu } from "electron"

/** 发布职位 div */
export const element1 = "div.add-btn";
/** 职位名称 input */
export const element2 = ".job-name-input";
/** url前缀 */
export const prefixUrl = "https://www.zhipin.com";

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

/** 定时器间隔 */
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