// import { 
//   ipcRenderer
// } from "electron";
console.log("已载入preload.mjs")

import { contextBridge, ipcRenderer } from 'electron';

// 1. 暴露应用版本信息（安全只读数据）,在渲染进程的window上挂载一个electronAPI对象
contextBridge.exposeInMainWorld('electronAPI', {
  // 获取版本信息
  getVersions: () => {
    return {
      node: process.versions.node,
      chrome: process.versions.chrome,
      electron: process.versions.electron
    };
  },

  // 注意：通常更推荐使用 invoke/handle，但某些场景（如持续消息流）可能需要 on/send
  sendMessageToRender: (callback) => {
    // ipcRenderer.on('update-data', callback);
    debugger
    ipcRenderer.on("sendMessageToRender", callback);
  },

  sendMessageToMain: (channel, data) => {
    console.log("from", channel);
    ipcRenderer.invoke(channel, data);
  }
});