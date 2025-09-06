
/** 发布职位 div */
export const element1 = "div.add-btn";
/** 职位名称 input */
export const element2 = ".job-name-input";
/** url前缀 */
export const prefixUrl = "https://www.zhipin.com"

/** 各模块组件对象 */
export const ComponentsObject = {
  "登录/注册": {
    type:"",
    element:"",
    path:"",
    url:"https://www.zhipin.com/web/user/?ka=header-login",
    children:{
      "APP扫码登陆": {
        type:"button",
        element:"div",
        path: "div.switch-tip",
        url:"https://www.zhipin.com/web/user/?ka=header-login",
      }
    }
  },
  "职位管理":{
    type: "a",
    element: "a",
    path:  `[ka="menu-manager-job"]`,
    url: "https://www.zhipin.com/web/chat/job/list",
    children: {
      "发布职位":{
        type:"button",
        element:"div",
        path:"div.add-btn",
        url:"https://www.zhipin.com/web/frame/job/list-new",
        children: {
          "职位名称":{
            type:"input",
            element:"input",
            path:".job-name-input",
            url:"https://www.zhipin.com/web/frame/job/edit"
          }
        }
      },
      "职位类型": {
        type:"select",
        element:"div",
        path:".new-version.select-width.ui-select.ui-select-single",
        url:"https://www.zhipin.com/web/frame/job/list-new",
        children: null
      },
      "搜索": {
        type:"input",
        element:"input",
        path:"#search",
        url:"https://www.zhipin.com/web/frame/job/list-new",
        children: null
      }
    }
  },
  "推荐牛人": {
    type: "a",
    element: "a",
    path: `[ka="menu-geek-recommend"]`,
    url: "https://www.zhipin.com/web/chat/recommend",
    children: null
  },
  "搜索牛人": {
    type: "a",
    element: "a",
    path: `[ka="menu-geek-search"]`,
    url: "https://www.zhipin.com/web/chat/search",
    children: null
  },
  "沟通":{
    type: "a",
    element: "a",
    path: `[ka="menu-im"]`,
    url: "https://www.zhipin.com/web/chat/index",
    children: null
  },
  "意向沟通":{
    type: "a",
    element: "a",
    path: `[href*="/web/chat/intention"]`,
    url: "https://www.zhipin.com/web/chat/intention",
    children: null
  },
  "个人中心":{
    type: "",
    element:"",
    path: "",
    url: "https://www.zhipin.com/web/chat/user-center",
    children: null
  }
}