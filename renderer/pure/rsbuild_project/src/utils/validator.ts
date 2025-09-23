// const INTEGER_POSITIVE = /^[1-9]\d+$/;
const INTEGER_POSITIVE = /^[1-9](\d+)?|[0]$/;
const INTEGER_FLOAT = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
export const MOBILE = /^[1][0-9]{10}$/;
const EMAIL = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
const TEL = /^[0-9-]{1,20}$/;

const Validator = {

  // 验证非负整数
  integer_positive: (value: any) => INTEGER_POSITIVE.test(value),

  // 验证2位小数
  integer_float: (value: any) => INTEGER_FLOAT.test(value),

  // 验证手机
  mobile: (value: any) => MOBILE.test(value),

  // 验证邮箱
  email: (value: any) => EMAIL.test(value),

  // 验证身份证格式
  idCard: (value: any) => {
    /**加权因子 */
    const arrExp = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];/**加权因子 */
    /**校验码 */
    const arrValid = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2];
    if (/^\d{17}(\d|x)$/i.test(value)) {
      let sum = 0;
      for (let i = 0; i < value.length - 1; i++) {
        /**对前17位数字与权值乘积求和 */
        sum += parseInt(value.substr(i, 1), 10) * arrExp[i];
      }
      /**计算模（固定算法） */
      const idx = sum % 11;
      /**检验第18为是否与校验码相等 */
      return arrValid[idx].toString() === value.substr(17, 1).toUpperCase();
    } else {
      return false;
    }

  },

  // 验证联系电话
  tel:(value:any)=>TEL.test(value),
  
/**
  * 是否邮箱
  * Boolean
  */
  isEmail: (email) => {
    const EMAIL = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    if (EMAIL.test(email)) {
        return true;
    }
    return false;
  },

/**
  * 是否为数字（仅正数），包括正整数、正小数、0
  * @param value
  * @returns
  */
  isNumber: (value) =>{
    var z_reg = /^(([0-9])|([1-9]([0-9]+)))(.[0-9]+)?$/;
    return z_reg.test(value);
  },

/**
  * 身份证校验
  */
  isCertificate: (certificateNo) =>{
    var pat = /^\d{6}(((19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])\d{3}([0-9]|x|X))|(\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])\d{3}))$/;
    if (pat.test(certificateNo)) {
        return true;
    }
    return false;
  },
/**
  * 是否仅含中文，英文
  * @param {string} chinese 
  */
  isChinese: (chinese) => {
    const CHINESE = /^[\u4e00-\u9fa5a-zA-Z·]+$/;
    if(CHINESE.test(chinese)){
        return true;
    }
    return false;
  }
}

export default Validator;