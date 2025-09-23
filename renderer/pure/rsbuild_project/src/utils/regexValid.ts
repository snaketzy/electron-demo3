
/**
 * 是否为手机号
 * Boolean
 */

const isMobile = (poneInput) => {
    if (poneInput) {
        if (poneInput.length == 11 && poneInput.substr(0, 1) == 1) {
            return true;
        }
    }
    return false;
}


/**
 * 是否邮箱
 * Boolean
 */

const isEmail = (email) => {
    const EMAIL = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    if (EMAIL.test(email)) {
        return true;
    }
    return false;
}

/**
 * 是否为数字（仅正数），包括正整数、正小数、0
 * @param value
 * @returns
 */
 const isNumber = (value) =>{
    var z_reg = /^(([0-9])|([1-9]([0-9]+)))(.[0-9]+)?$/;
    return z_reg.test(value);
};

/**
 * 身份证校验
 * 
 */
const isCertificate = (certificateNo) =>{
    var pat = /^\d{6}(((19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])\d{3}([0-9]|x|X))|(\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])\d{3}))$/;
    if (pat.test(certificateNo)) {
        return true;
    }
    return false;
}
/**
 * 是否仅含中文，英文
 * @param {string} chinese 
 */
const isChinese = (chinese) => {
    const CHINESE = /^[\u4e00-\u9fa5a-zA-Z·]+$/;
    if(CHINESE.test(chinese)){
        return true;
    }
    return false;
}


export {
    isMobile,
    isEmail,
    isCertificate,
    isChinese,
    isNumber
}