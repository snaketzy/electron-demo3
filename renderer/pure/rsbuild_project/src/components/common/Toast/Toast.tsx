import React, { FC, useEffect, useState } from "react";
// import ReactDOM from 'react-dom';
// import { CenterPopup } from "antd-mobile";

const createToast = (content) => {
  const div = document.createElement('div')
  div.setAttribute("id","toastContainer")
  document.body.appendChild(div)
  // const toast = ReactDOM.render(<CenterPopup visible = {true}>{content}</CenterPopup>, div);
  
  // return {
  //     add: () => {
  //       return toast
  //     },
  //     destroy: () => {
  //         document.body.removeChild(div)
  //     }
  // }
}

let hasToast;
const Toast = (content: string) => {
  if(!hasToast) {
    const hasToast = createToast(content);
    // setTimeout(() => {
    //   hasToast.destroy()
    // }, 1000)
    // return hasToast.add()
  }
  
}

export default {
  info: (content) => {
    return Toast(content)
  }
};