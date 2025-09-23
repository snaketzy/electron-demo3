// declare module '*.svg'
// declare module '*.png'
// declare module '*.jpg'

// 声明所有 .png 文件为模块
declare module '*.png' {
  const path: string;
  export default path;
}


