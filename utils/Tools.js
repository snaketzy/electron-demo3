import {timeoutInterval} from "../config.js";

export const delay = (time) => {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}

/** 使用2到5秒之间的随机时间，防止接口机器人检测 */
export const getRandomSecondsPrecise = () => {
  const randomMs = Math.floor(Math.random() * 3001) + 2000;
  // return randomMs / 1000;
  return randomMs;
}

