import React, { FC, useEffect, useState } from "react";
import ReactDOM from 'react-dom/client';
import { Modal as OrgModal } from "antd-mobile";
import { Action } from "antd-mobile/es/components/modal";
import "./Modal.less";

const Modal = (content: string, duration?: number, type?: string, promise?: any) => {
   const modalObj = OrgModal.show({
    content: content,
    closeOnMaskClick: true,
    ...type === "show" && {
      actions: [{
        key: 'ok',
        text: '确定',
        primary: true
      }],
      onAction: (action: Action, index: number) => {
        if(action.key === "ok") {
          modalObj.close();
        }
      }
    },
    ...type === "confirm" && {
      actions: [{
        key: 'ok',
        text: '确定',
        primary: true
      },{
        key: 'cancel',
        text: '取消',
      }],
      onAction: (action: Action, index: number) => {
        if(action.key === "ok") {
          promise && promise()
          modalObj.close();
        } else {
          modalObj.close();
        }
      }
    }
  })
  if(duration) {
    setTimeout(() => {
      modalObj.close();
    }, duration)
  }
}

/** 
 * 自定义功能modal 
 * @param content 内容
 * @param type modal类型
 * @param promise 操作
 */
const customizeModal = (content, type, promise) => {
  switch(type) {
    case "service":{{
      const modalContainer = document.createElement("div");
      modalContainer.setAttribute("id","modal")
      document.querySelector(".index-container")?.appendChild(modalContainer);
      const root = ReactDOM.createRoot(modalContainer);
      const serviceModal = (
        <div className="modal" id= "serviceModal">
          <div className="serviceContent">
            <img
              className="serviceImg"
              src={require("assets/images/service.png")}
            />
            <div className="serviceBtn" onClick={ promise.onServicePage }>
              立即领取
            </div>
            <div className="serviceLook" onClick={ promise.onServicePage }>
              查看具体规则
            </div>
            <img
              onClick={ 
                () => {
                  promise.close && promise.close();
                  root.unmount()
                  document.querySelector(".index-container")?.removeChild(modalContainer)
                }
              }
              className="deleteImg"
              src={require("assets/images/service_delete.png")}
            />
          </div>
        </div>
      )
      root.render(serviceModal)
      return;
    }}
  }
}

/** 自定义modal组件 */
export default {
  /** 2s后自动关闭modal */
  info: (content, duration = 2000) => {
    return Modal(content, duration)
  },
  /** 手动关闭Modal */
  show: (content) => {
    return Modal(content, 0, "show")
  },
  /** 确认操作Modal */
  confirm: (content, promise: any) => {
    return Modal(content, 0, "confirm", promise)
  },
  /** 综合灵活用工保障服务Modal */
  serviceModal: (promise: {onServicePage: () => void, close?: () => void}) => {
    return customizeModal("", "service", promise)
  }
};