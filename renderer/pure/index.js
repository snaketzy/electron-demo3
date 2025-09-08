// const { ipcRenderer } = require("electron")
import { ipcRenderer} from "electron";

/** 监听主进程推送 */
ipcRenderer.on('updateUserInfo', (event, value) => {
  console.log("updateUserInfo", value)
})

/** 监听主进程推送的接口报文 */
ipcRenderer.on('responseReceived', (event, value) => {
  if(value.params.response.url.includes("userAndCompany")) {
    console.log("responseReceived", value)
    const userInfo = JSON.parse(value.response.body).data.extra
    console.log("value", userInfo)
    document.querySelector(".user-info > div:first-child > span").innerText = userInfo.realName;
    document.querySelector(".user-info > div:last-child > span").innerText = Array.isArray(userInfo.company) ? userInfo.company[0].name : userInfo.company.name;
  }
})

const dataTrigger = () => {
    ipcRenderer.invoke("data-transfer","ok")
}

function showConfig() {
    // 执行逻辑
    alert("配置模块已显示！");
}

function showTargetWindow() {
  ipcRenderer.invoke("toggleTargetWindow",{windowName:"targetWin", status: "show"})
}

function hideTargetWindow() {
  ipcRenderer.invoke("toggleTargetWindow",{windowName:"targetWin", status: "hide"})
}