export const SIGN_SUCCESS_PAGE = `${process.env.NODE_ENV !== "release" ?  "https://test-apph5.zhenyetong.com/huamingce/#/" : "https://apph5.zhenyetong.com/huamingce/#/"}`;
export const QRCODE_ManageRootUrl = `${process.env.NODE_ENV !== "release" ?  "https://test-apph5.zhenyetong.com/huamingce/#/" : "https://apph5.zhenyetong.com/huamingce/#/"}`;
export const SSQ_Url = `${process.env.NODE_ENV === "dev" ? "https://wx105.bestsign.info" : (process.env.NODE_ENV === "pre" ? "https://wx105.bestsign.info" : "https://wx107.bestsign.cn")}`;
export const PRE_SSQ_Url = `${process.env.NODE_ENV === "dev" ? "https://openapi.bestsign.info" : (process.env.NODE_ENV === "pre" ? "https://openapi.bestsign.info" : "https://openapi.bestsign.cn")}`;
export const app_version = 1;
/** 绑卡提示语占位 */
export const bindCardRemindH5Notice = "本次绑卡后如需更换收款卡，请微信小程序搜索「振业宝」，登录后进入我的-我的钱包-添加银行卡，并设为收款卡提交";

export const VALIDATE_ERROR_MESSAGE = "校验异常";