// import { 
//   ipcRenderer
// } from "electron";
console.log("已载入preload.mjs")
  
 // 更新响应显示
// function updateResponse(data, type) {
//   debugger
//   console.log(data)
//     // responseElement.textContent = `// 来自${type}的响应\n${JSON.stringify(data, null, 2)}`;
// }

// 保存原始方法
// const originalFetch = window.fetch;
// const originalXHROpen = XMLHttpRequest.prototype.open;
// const originalXHRSend = XMLHttpRequest.prototype.send;

// // 重写fetch
// window.fetch =  async function(...args) {
//     return await originalFetch.apply(this, args).then(response => {
//         if (!interceptEnabled) return response;
        
//         // 克隆响应以便读取
//         return response.clone().json().then(data => {
//             // 修改响应数据
//             const modifiedData = {
//                 ...data,
//                 intercepted: true,
//                 message: "这个响应已被拦截修改!",
//                 originalTitle: data.title,
//                 title: "被修改的标题"
//             };
            
//             updateResponse(modifiedData, 'fetch');
            
//             // 返回修改后的响应
//             return new Response(JSON.stringify(modifiedData), {
//                 status: response.status,
//                 statusText: response.statusText,
//                 headers: response.headers
//             });
//         });
//     });
// };

// // 重写XHR
// XMLHttpRequest.prototype.open = function(...args) {
//     this._url = args[1];
//     return originalXHROpen.apply(this, args);
// };

// XMLHttpRequest.prototype.send = function(...args) {
//     this.addEventListener('load', function() {
//         if (!interceptEnabled) return;
        
//         if (this.responseText) {
//             try {
//                 const data = JSON.parse(this.responseText);
//                 // 修改响应数据
//                 const modifiedData = {
//                     ...data,
//                     intercepted: true,
//                     message: "这个响应已被拦截修改!",
//                     originalTitle: data.title,
//                     title: "被修改的标题"
//                 };
                
//                 updateResponse(modifiedData, 'XHR');
                
//                 // 重写responseText（注意：这在实际项目中可能不总是有效）
//                 Object.defineProperty(this, 'responseText', {
//                     value: JSON.stringify(modifiedData),
//                     writable: false
//                 });
//             } catch (e) {
//                 console.error('Error parsing JSON:', e);
//             }
//         }
//     });
//     return originalXHRSend.apply(this, args);
// };

// (function() {
//     "use strict";

//     console.log(window.XMLHttpRequest)
//     const CustomHttpRequest = null;
//     // 注册拦截器
//     window.XMLHttpRequest = CustomHttpRequest;
//     console.log(window.XMLHttpRequest)
// })();

import { contextBridge, ipcRenderer } from 'electron';

// 1. 暴露应用版本信息（安全只读数据）
contextBridge.exposeInMainWorld('electronAPI', {
  // 获取版本信息
  getVersions: () => {
    return {
      node: process.versions.node,
      chrome: process.versions.chrome,
      electron: process.versions.electron
    };
  },

  // 2. 暴露进程间通信 (IPC) 方法
  // 使用 invoke/handle 模式进行请求-响应式通信[6,7](@ref)
  invokeExample: (data) => {
    debugger
    return ipcRenderer.invoke('channel-name', data);
  },

  // 3. 使用 on/send 模式进行事件监听式通信[6](@ref)
  // 注意：通常更推荐使用 invoke/handle，但某些场景（如持续消息流）可能需要 on/send
  onUpdate: (callback) => {
    ipcRenderer.on('update-data', callback);
  },
  removeListener: (channel, callback) => {
    ipcRenderer.removeListener(channel, callback);
  },
  sendMessage: (channel, data) => {
    ipcRenderer.invoke(channel, data);
  }
});