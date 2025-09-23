import React, { FC, useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import { Dialog as OrgDialog } from "antd-mobile";
import { Action } from "antd-mobile/es/components/modal";
import "./Dialog.less";

const Dialog = (content: string, duration?: number, type?: string, promise?: any) => {
   const dialogObj = OrgDialog.show({
    bodyClassName: "dialog-body",
    content: content,
    closeOnMaskClick: true,
    ...type === "alert" && {
      actions: [{
        key: 'ok',
        text: '确定'
      }],
      onAction: (action: Action, index: number) => {
        if(action.key === "ok") {
          dialogObj.close();
        }
      }
    },
    ...type === "confirm" && {
      actions: [{
        key: 'ok',
        text: '确定'
      },{
        key: 'cancel',
        text: '取消',
      }],
      onAction: (action: Action, index: number) => {
        if(action.key === "ok") {
          promise && promise()
          dialogObj.close();
        } else {
          dialogObj.close();
        }
      }
    }
  })
  if(duration) {
    setTimeout(() => {
      dialogObj.close();
    }, duration)
  }
}

/** 自定义modal组件 */
export default {
  /** 显示modal */
  info: (content, duration = 2000) => {
    return Dialog(content, duration)
  },
  alert: (content) => {
    return Dialog(content, 0, "alert")
  },
  confirm: (content, promise: any) => {
    return Dialog(content, 0, "confirm", promise)
  }
};