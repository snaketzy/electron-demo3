import axios from "axios";
import { app_version } from "./constant";
import Toast from "../components/common/Toast/Toast";
import Modal from "../components/common/Modal/Modal";
// import * as Sentry from "@sentry/react";

axios.defaults.headers["Content-Type"] = "application/json;charset=UTF-8";
axios.defaults.headers["userAgent"] = window.navigator.userAgent;
axios.defaults.headers["version"] = app_version;

const HttpUrl = () => {
  return {
    URL: getRootUrl().URL,
  };
};

const getRootUrl = () => {
  switch (process.env.NODE_ENV) {
    case "development":
      return {
        URL: `${location.protocol}//test-apph5.zhenyetong.com/roster/employee/`, //'http://47.96.37.94:13051/roster/employee/' //'http://192.168.2.126:13051/roster/employee/'
      };
    case "production":
      return {
        URL: `/roster/employee/`, //'/roster/employee/'
      };
    case "release":
      return {
        URL: "/roster/employee/",
      };
    default:
      return {
        URL: "/roster/employee/",
      };
  }
};
const attachmentsUpLoadUrl = () => {
  switch (process.env.NODE_ENV) {
    case "development":
      return `${location.protocol}//test-uploadv2.zhenyetong.com/filemanager/upload`;
    case "production":
      return `${location.protocol}//test-uploadv2.zhenyetong.com/filemanager/upload`;
    case "release":
      return "/filemanager/upload";
    default:
      break;
  }
};

/**
 * get请求
 * @param {*} url
 */
const get = (url, callback) => {
  axios.defaults.timeout = 60000; // 15000;
  axios.defaults.headers.common["Authorization"] =
    localStorage.getItem("huamingceToken") || "";
  axios.defaults.headers.common["qrcodeUrl"] =
    localStorage.getItem("qrcodeUrl") || "";
  axios.defaults.headers.common["sendMsgCheckCodeUrl"] =
    localStorage.getItem("sendMsgCheckCodeUrl") || "";
  axios
    .get(HttpUrl().URL + url)
    .then(function (response) {
      if (response.data.result !== 0) {
        // Sentry.setTag("api url", url);
        // // Sentry.setLevel("result " + response.data.result);
        // Sentry.setExtra("header", {
        //   Authorization: localStorage.getItem("huamingceToken") || "",
        //   qrcodeUrl: localStorage.getItem("qrcodeUrl") || "",
        //   sendMsgCheckCodeUrl:
        //     localStorage.getItem("sendMsgCheckCodeUrl") || "",
        // });
        // Sentry.setExtra("data", response.data);
        // const errorInfo = new Error(url + response.data.result);
        // errorInfo.name = "接口请求错误";
        // Sentry.captureException(errorInfo);
      }
      callback && callback.success && callback.success(response);
    })
    .catch(function (error) {
      // Sentry.setTag("api url", url);
      // // Sentry.setLevel("result " + response.data.result);
      // Sentry.setExtra("header", {
      //   Authorization: localStorage.getItem("huamingceToken") || "",
      //   qrcodeUrl: localStorage.getItem("qrcodeUrl") || "",
      //   sendMsgCheckCodeUrl: localStorage.getItem("sendMsgCheckCodeUrl") || "",
      // });
      
      console.log("error", error);
      let errorMsg = error.request && error.request.statusText;
      // Toast.info(errorMsg || url + "请求超时，请稍后重试");
      Toast.info(errorMsg || url + "请求超时，请稍后重试")
      callback && callback.fail && callback.fail(error);
    });
};

/**
 * post请求
 * @param {*} url
 * @param {*} param
 */
const post = (url, param, callback) => {
  axios.defaults.timeout = 60000; // 15000;
  axios.defaults.headers.common["Authorization"] =
    localStorage.getItem("huamingceToken") || "";
  axios.defaults.headers.common["qrcodeUrl"] =
    localStorage.getItem("qrcodeUrl") || "";
  axios.defaults.headers.common["sendMsgCheckCodeUrl"] =
    localStorage.getItem("sendMsgCheckCodeUrl") || "";
  axios
    .post(HttpUrl().URL + url, param)
    .then(function (response) {
      if (response && response.data && response.data.result !== 0) {
        // Sentry.setTag("api url", url);
        // // Sentry.setLevel("result " + response.data.result);
        // Sentry.setExtra("header", {
        //   param: param,
        //   Authorization: localStorage.getItem("huamingceToken") || "",
        //   qrcodeUrl: localStorage.getItem("qrcodeUrl") || "",
        //   sendMsgCheckCodeUrl:
        //     localStorage.getItem("sendMsgCheckCodeUrl") || "",
        // });
        // Sentry.setExtra("data", response.data);
        // const errorInfo = new Error(url + " " + response.data.result);
        // errorInfo.name = "接口请求错误";
        // Sentry.captureException(errorInfo);
      }
      if (response && response.data && response.data.result === 500) {
        Modal.show(response.data.detail)
        callback && callback.error && callback.error(response);
      } else {
        callback && callback.success && callback.success(response);
      }
    })
    .catch(function (error) {
      // Sentry.setTag("api url", url);
      // // Sentry.setLevel("result " + "error");
      // Sentry.setExtra("header", {
      //   param: param,
      //   Authorization: localStorage.getItem("huamingceToken") || "",
      //   qrcodeUrl: localStorage.getItem("qrcodeUrl") || "",
      //   sendMsgCheckCodeUrl: localStorage.getItem("sendMsgCheckCodeUrl") || "",
      // });
      // Sentry.setExtra("data", "error");
      // const errorInfo = new Error(url + " " + "error");
      // errorInfo.name = "接口请求错误";
      // Sentry.captureException(errorInfo);

      console.log("error", error);
      let errorMsg = (error.request && error.request.statusText) || error.data.detail;
      // Modal.show({
      //   showCloseButton:true,
      //   content: errorMsg || url + "请求超时，请稍后重试"
      // })
      
      callback && callback.error && callback.error(errorMsg || url + "请求超时，请稍后重试");
    });
};

export { get, post, HttpUrl, attachmentsUpLoadUrl };
