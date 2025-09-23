/**
 * url拼接参数
 */
const appendUrlParams = (url = "", params = {}) => {
  if (!url) {
    return "";
  }
  let str = "";
  for (const [key, value] of Object.entries(params)) {
    if (![undefined, null].includes(value as any)) {
      str += "&" + key + "=" + value;
    }
  }
  str = str ? `${url}?${str.substring(1)}` : url;
  return str;
}

/**
 * 获取url里特定参数的值
 * string
 */
const getUrlParam = (name) => {
  let url = decodeURIComponent(window.location.href);
  let data = url.split("?");
  if (!data[1]) {
    return
  }
  let vars = data[1].split("&");
  for (let i = 0; i < vars.length; i++) {
    let firstIndex = vars[i].indexOf('=');
    if (firstIndex !== -1) {
      let value = vars[i].substring(firstIndex + 1);
      let paraname = vars[i].substring(0, firstIndex);
      // let pair = vars[i].split("=");
      if (paraname == name) {
        return value;
      }
    }
  }
  return null;
}

/**
 * 获取url里所有参数
 * {}
 */
const getUrlAllParam = () => {
  let url = decodeURIComponent(window.location.href);
  let data = url.split("?");
  if (!data[1]) {
    return
  }
  let params = {}
  let vars = data[1].split("&");
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split("=");
    params[pair[0]] = pair[1]
  }
  return params;
}

const getUrlHash = () => {
  const hash = window.location.hash;
  return hash.split('?')[1]
};

/**
 * 银行卡加密
 */
const bankSecret = (bankNo) => {
  if (bankNo.length > 4) {
    let end = bankNo.slice(bankNo.length - 4);
    return '****' + end;
  }
  return '';
}


/**
 * 姓名加密
 */
const usernameSecret = (name) => {
  if (name != null && name.length > 0) {
    if (name.length > 2) {
      let lastname = name.slice(name.length - 1);
      let firstname = name.slice(0, 1);
      let str = '';
      for (let i = 1; i < name.length - 1; i++) {
          str = str + '*';
      }
      return firstname + str + lastname;
  } else if (name.length == 2) {
    //名字两个字，只显示最后一个
      let lastname = name.slice(name.length - 1);
      return '*' + lastname;
    } else {
      return name;
    }
  }
  return '';
}

/**
 * 身份证加密
 */
const idCardSecret = (card) => {
  if (card != null && card.length > 7) {
    let first, last;
    first = card.slice(0, 3);
    last = card.slice(card.length - 4);
    return first + last.padStart(card.length - 3, '*');
  }
  return '';
}

/**
 * 手机号脱敏
 */
const mobileSecret = (mobile) => {
  let first = mobile.slice(0, 3);
  let last = mobile.slice(mobile.length - 4);
  return first + last.padStart(mobile.length - 3, '*');
}

/**获取当前时间 */
const CurentTime = () => {
  let now = new Date();
  let year = now.getFullYear();       //年
  let month = now.getMonth() + 1;     //月
  let day = now.getDate();            //日
  let clock = year + "-";
  if (month < 10)
      clock += "0";
  clock += month + "-";
  if (day < 10)
      clock += "0";
  clock += day;
  return (clock);
}


/**判断是否终端为ios系统 */
const isIos = () => {
  let u = navigator.userAgent;
  let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
  let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  return isiOS;
}

/**@return date1 < data2 ? true : false */
const compareTime = (time1: any, time2: any) => {
  let date1 = Date.parse(new Date(time1.replace(/-/g, '/')));
  let date2 = Date.parse(new Date(time2.replace(/-/g, '/')));
  if (date1 >= date2) {
      return false
  }
  return true;
}


/**身份证格式解析 */
const CertificateNoParse = (certificateNo) => {
  let parseInner = function (certificateNo, idxSexStart, birthYearSpan) {
    let res: any = {};
    let idxSex: any = 1 - certificateNo.substr(idxSexStart, 1) % 2;
    res.sex = idxSex == '1' ? '1' : '0';

    let year = (birthYearSpan == 2 ? '19' : '') +
      certificateNo.substr(6, birthYearSpan);
    let month = certificateNo.substr(6 + birthYearSpan, 2);
    let day = certificateNo.substr(8 + birthYearSpan, 2);
    res.birthday = year + '-' + month + '-' + day;

    let d = new Date(); //当然，在正式项目中，这里应该获取服务器的当前时间  
    let monthFloor = ((d.getMonth() + 1) < parseInt(month, 10) || (d.getMonth() + 1) == parseInt(month, 10) && d.getDate() < parseInt(day, 10)) ? 1 : 0;
    res.age = d.getFullYear() - parseInt(year, 10) - monthFloor;

    let area = {
      11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古",
      21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏",
      33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北",
      43: "湖南", 44: "广东", 45: "广西",
      46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西",
      62: "甘肃", 63: "青海", 64: "宁夏",
      65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外"
    }
    let provinceName = "";
    let provinceNo = certificateNo.substr(0, 2);
    if (area[parseInt(provinceNo)] != null) {
        provinceName = area[parseInt(provinceNo)];
    }
    res.domicile = provinceName;
    return res;

  };
  return parseInner(certificateNo, certificateNo.length == 15 ? 14 : 16, certificateNo.length == 15 ? 2 : 4);
};

const trim = (string) => {
    /**正则ios会产生拼音问题 */
    // return str.replace(/\s*/g, "");
    let temp = "";
    string = '' + string;
    let splitstring = string.split(" ");
    for (let i = 0; i < splitstring.length; i++)
        temp += splitstring[i];
    return temp;
}

const formatDate = (date, fmt) => {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}

/**
 * 计算高度比率 以设计稿 667为基准
 */
const ScalarHeight = (height) => {
  let rate = height / 667.0;
  return window.screen.height * rate;
}

const decodeBase64 = (str) => {
  return decodeURIComponent(window.atob(str));
}

const encodeBase64 = (str) => {
  return window.btoa(encodeURIComponent(str));
}

/** 图片转二进制流 */
const dataUrltoBlob = (dataurl) => {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = window.atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};


export {
  appendUrlParams,
  getUrlParam,
  getUrlAllParam,
  usernameSecret,
  getUrlHash,
  CurentTime,
  isIos,
  compareTime,
  CertificateNoParse,
  trim,
  formatDate,
  idCardSecret,
  bankSecret,
  mobileSecret,
  ScalarHeight,
  encodeBase64,
  decodeBase64,
  dataUrltoBlob
}