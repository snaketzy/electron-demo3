export const delay = (time) => {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}

/** 使用5到15秒之间的随机时间，防止接口机器人检测 */
export const getRandomSecondsPrecise = () => {
  const randomMs = Math.floor(Math.random() * 10001) + 5000;
  // return randomMs / 1000;
  // return randomMs;
  return 2000
}

