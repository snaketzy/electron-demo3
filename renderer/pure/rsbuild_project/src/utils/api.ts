import { get, HttpUrl, post } from './http';

/** 获取图形验证码 */
export const getImageCodeUrl = (imageCodeKey, inCase) => {
    return HttpUrl().URL + `employee/createImageCode?imageCodeKey=${imageCodeKey}&inCase=${inCase}`
}

/**
 * 获取验证码
 */
export const sendMsgCheckCode = (params, callback) => {
    const { phone, code, channelCode, userName, idType, idNo, imageCodeKey, verifyCode, inCase } = params
    const url = `employee/sms/send?phone=${phone}&code=${code}&channelCode=${channelCode}&userName=${userName}&idType=${idType}&idNo=${idNo}&imageCodeKey=${imageCodeKey}&verifyCode=${verifyCode}&inCase=${inCase}`
    return post(url, params, callback)
}

/**
 * 员工信息认证
 */
export const checkEmployee = (params, callback) => {
    return post('employee/validate', params, callback)
}

/**
 * 再次入职验证员工信息
 */
export const checkReemployment = (params, callback) => {
    return post('employee/reemployment', params, callback)
}

/**
 * 落脚页状态
 */
export const employeeStep = (params, callback) => {
    return post(`employee/end/status/${params.relationId}`, params, callback)
}

/**
 * 实时更新合同状态
 */
export const syncContract = (params, callback) => {
    return post(`employee/sync/contract/${params.relationId}`, params, callback)
}

/**
 * 合同列表
 */
export const contractList = (params, callback) => {
    return get(`contract/list/${params.relationId}`, callback)
}

/**
 * 合同详情
 */
export const contractDetail = (params, callback) => {
    return get(`contract/preview/url/${params.contractId}`, callback)
}

/**
 * 字段列表查询
 */
export const fieldsList = (params, callback) => {
    return get(`company/schema/${params.companySchemaId}/${params.businessType}/fields?relationId=${params.relationId}`, callback)
}

/**
 * 字段验证
 */
export const fieldsListCheck = (params, callback) => {
    //return post(`company/schema/${params.companySchemaId}/${params.businessType}/fields/check`,params["bodylist"],callback)
    return post(`company/schema/fields/check`, params, callback)
}

/** 
 * 身份证ocr识别
*/
export const checkOcrCard = (params, callback) => {
    return post(`yxb/ocr/card`, params, callback)
}


/**
 * 附件列表查询
 */
export const uploadList = (params, callback) => {
    return get(`company/schema/${params.companySchemaId}/${params.businessType}/attachments`, callback)
}

/**
 * 附件列表验证
 */
export const uploadListCheck = (params, callback) => {
    return post(`company/schema/${params.companySchemaId}/${params.businessType}/attachments/check`, params["bodylist"], callback)
}

/**
 * 表单保存
 */
export const saveForm = (params, callback) => {
    return post(`employee/save`, params, callback)
}

/**
 * 获取银行卡bin信息
 */
export const cardBin = (params, callback) => {
    return get(`bank/card/${params.bankCardNo}`, callback)
}

/** 
 * 获取支持银行列表
*/
export const supportBank = (params, callback) => {
    return get(`bank/card/support`, callback)
}

/** 
 * 获取支持二类户银行列表
*/
export const class2BankSupport = (params, callback) => {
    return get(`bank/card/support/spdb?channelCode=${params.channelCode}`, callback)
}

/** 
 * 查询短信模板
*/
export const smsMode = (params, callback) => {
    return post(`employee/sms/mode`, params, callback)
}

/** 
 * 绑定银行卡
*/
export const saveBank = (params, callback) => {
    return post(`bank/card/bind`, params, callback)
}

/** 
 * 二类户银行卡开户
*/
export const bankCardBindType2 = (params, callback) => {
    return post(`bank/card/bind/type/2`, params, callback)
}

/** 
 * 发送邮件
*/
export const sendEmail = (params, callback) => {
    return post(`employee/email`, params, callback)
}

/**
 * 城市列表
 */
export const cityListAll = (params, callback) => {
    return get(`talentPool/city/all`, callback)
}

/**
 * 岗位列表
 */
export const positionListAll = (params, callback) => {
    return get(`talentPool/position/all`, callback)
}

/** 
 * 保存报名表信息
*/
export const saveXmEnroll = (params, callback) => {
    return post(`employee/xm/enroll`, params, callback)
}

/** 
 * 查询雇员端版本信息
*/
export const clientVersion = (params, callback) => {
    return get(`employee/client/version`, callback)
}

/**
 * 小程序入口验证员工信息
 */
export const newValidateEmployee = (parmas, callback) => {
    return post(`employee/miniprogram/validate`, parmas, callback)
}

/**入库推送客户 */
export const addApiOutMessageTaskByRelation = (parmas, callback) => {
    return post(`employee/addApiOutMessageTaskByRelation/${parmas.relationId}`, {}, callback)
}

/** 查询开通浦发银行开通二类户结果 */
export const getSpdbCreateAccount = (params, callback) => {
    return get(`bank/card/spdbQueryCreateAccount?channelCode=${params.channelCode}`, callback)
}

/** 获取行业字典数据 */
export const getIndustryMaps = (params, callback) => {
    return get(`bank/card/user/bank/getIndustryMaps/${params.channelCode}`, callback)
}

/** 获取职业枚举值数据 */
export const getJobMaps = (params, callback) => {
    return get(`bank/card/user/bank/getJobMaps/${params.channelCode}`, callback)
}

/** 获取省市区地址 */
export const getAddressMap = (params, callback) => {
    return get(`bank/card/common/getAddressMap?province=${params.province}&city=${params.city}`, callback)
}

/** 扫码签约是否开启候选人 */
export const checkCandidate = (params, callback) => {
    return post("employee/checkCandidate", params, callback)
}

/** 候选人提交 */
export const saveCandidate = (params, callback) => {
    return post("employee/saveCandidate", params, callback)
}

/** 候选人状态查询 */
export const getCandidateStatus = (params, callback) => {
    return get(`employee/candidateStatus?cardCode=${params.cardCode}&companySchemaId=${params.companySchemaId}&employmentCompanyId=${params.employmentCompanyId}&name=${params.name}&phone=${params.phone}&base64=${params.base64}&qrcode=${params.qrcode}&returnUrl=${params.returnUrl}`, callback)
}

/** 创建月薪日结合同 */
export const creatDailyContract = (params, callback) => {
    return post("employee/creatDailyContract", params, callback)
}

/** 通过身份证号判断是否存在实名信息 */
export const queryCertExsit = (params, callback) => {
    return get(`employee/queryCertExsit?mobile=${params.mobile}&certNo=${params.certNo}&smsCode=${params.smsCode}&base64=${params.base64}`, callback)
}

/** 换绑手机号 */
export const updateLoginInfo = (params, callback) => {
    return post("employee/updateLoginInfo", params, callback)
}
