// import store from '@/store';
import qs from 'qs';

export const forEach = (arr, fn) => {
  if (!arr.length || !fn) return;
  let i = -1;
  let len = arr.length;
  while (++i < len) {
    let item = arr[i];
    fn(item, i, arr);
  }
};

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的交集, 两个数组的元素为数值或字符串
 */
export const getIntersection = (arr1, arr2) => {
  let len = Math.min(arr1.length, arr2.length);
  let i = -1;
  let res = [];
  while (++i < len) {
    const item = arr2[i];
    if (arr1.indexOf(item) > -1) res.push(item);
  }
  return res;
};

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的并集, 两个数组的元素为数值或字符串
 */
export const getUnion = (arr1, arr2) => {
  return Array.from(new Set([...arr1, ...arr2]));
};

/**
 * @param {Array} target 目标数组
 * @param {Array} arr 需要查询的数组
 * @description 判断要查询的数组是否至少有一个元素包含在目标数组中
 */
export const hasOneOf = (targetarr, arr) => {
  return targetarr.some(_ => arr.indexOf(_) > -1);
};

/**
 * @param {String|Number} value 要验证的字符串或数值
 * @param {*} validList 用来验证的列表
 */
export function oneOf(value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true;
    }
  }
  return false;
}

/**
 * @param {Number} timeStamp 判断时间戳格式是否是毫秒
 * @returns {Boolean}
 */
const isMillisecond = timeStamp => {
  const timeStr = String(timeStamp);
  return timeStr.length > 10;
};

/**
 * @param {Number} timeStamp 传入的时间戳
 * @param {Number} currentTime 当前时间时间戳
 * @returns {Boolean} 传入的时间戳是否早于当前时间戳
 */
const isEarly = (timeStamp, currentTime) => {
  return timeStamp < currentTime;
};

/**
 * @param {Number} num 数值
 * @returns {String} 处理后的字符串
 * @description 如果传入的数值小于10，即位数只有1位，则在前面补充0
 */
const getHandledValue = num => {
  return num < 10 ? '0' + num : num;
};

/**
 * @param {Number} timeStamp 传入的时间戳
 * @param {Number} startType 要返回的时间字符串的格式类型，传入'year'则返回年开头的完整时间
 */
const getDate = (timeStamp, startType) => {
  const d = new Date(timeStamp * 1000);
  const year = d.getFullYear();
  const month = getHandledValue(d.getMonth() + 1);
  const date = getHandledValue(d.getDate());
  const hours = getHandledValue(d.getHours());
  const minutes = getHandledValue(d.getMinutes());
  const second = getHandledValue(d.getSeconds());
  let resStr = '';
  if (startType === 'year') resStr = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + second;
  else resStr = month + '-' + date + ' ' + hours + ':' + minutes;
  return resStr;
};

/**
 * @param {String|Number} timeStamp 时间戳
 * @returns {String} 相对时间字符串
 */
export const getRelativeTime = timeStamp => {
  // 判断当前传入的时间戳是秒格式还是毫秒
  const IS_MILLISECOND = isMillisecond(timeStamp);
  // 如果是毫秒格式则转为秒格式
  if (IS_MILLISECOND) Math.floor((timeStamp /= 1000));
  // 传入的时间戳可以是数值或字符串类型，这里统一转为数值类型
  timeStamp = Number(timeStamp);
  // 获取当前时间时间戳
  const currentTime = Math.floor(Date.parse(new Date()) / 1000);
  // 判断传入时间戳是否早于当前时间戳
  const IS_EARLY = isEarly(timeStamp, currentTime);
  // 获取两个时间戳差值
  let diff = currentTime - timeStamp;
  // 如果IS_EARLY为false则差值取反
  if (!IS_EARLY) diff = -diff;
  let resStr = '';
  const dirStr = IS_EARLY ? '前' : '后';
  // 少于等于59秒
  if (diff <= 59) resStr = diff + '秒' + dirStr;
  // 多于59秒，少于等于59分钟59秒
  else if (diff > 59 && diff <= 3599) resStr = Math.floor(diff / 60) + '分钟' + dirStr;
  // 多于59分钟59秒，少于等于23小时59分钟59秒
  else if (diff > 3599 && diff <= 86399) resStr = Math.floor(diff / 3600) + '小时' + dirStr;
  // 多于23小时59分钟59秒，少于等于29天59分钟59秒
  else if (diff > 86399 && diff <= 2623859) resStr = Math.floor(diff / 86400) + '天' + dirStr;
  // 多于29天59分钟59秒，少于364天23小时59分钟59秒，且传入的时间戳早于当前
  else if (diff > 2623859 && diff <= 31567859 && IS_EARLY) resStr = getDate(timeStamp);
  else resStr = getDate(timeStamp, 'year');
  return resStr;
};

/**
 * @returns {String} 当前浏览器名称
 */
export const getExplorer = () => {
  const ua = window.navigator.userAgent;
  const isExplorer = exp => {
    return ua.indexOf(exp) > -1;
  };
  if (isExplorer('MSIE')) return 'IE';
  else if (isExplorer('Firefox')) return 'Firefox';
  else if (isExplorer('Chrome')) return 'Chrome';
  else if (isExplorer('Opera')) return 'Opera';
  else if (isExplorer('Safari')) return 'Safari';
};

/**
 * @description 绑定事件 on(element, event, handler)
 */
export const on = (function() {
  if (document.addEventListener) {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler);
      }
    };
  }
})();

/**
 * @description 解绑事件 off(element, event, handler)
 */
export const off = (function() {
  if (document.removeEventListener) {
    return function(element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function(element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler);
      }
    };
  }
})();

/**
 * 判断一个对象是否存在key，如果传入第二个参数key，则是判断这个obj对象是否存在key这个属性
 * 如果没有传入key这个参数，则判断obj对象是否有键值对
 */
export const hasKey = (obj, key) => {
  if (key) return key in obj;
  else {
    let keysArr = Object.keys(obj);
    return keysArr.length;
  }
};

/**
 * @param {*} obj1 对象
 * @param {*} obj2 对象
 * @description 判断两个对象是否相等，这两个对象的值只能是数字或字符串
 */
export const objEqual = (obj1, obj2) => {
  const keysArr1 = Object.keys(obj1);
  const keysArr2 = Object.keys(obj2);
  if (keysArr1.length !== keysArr2.length) return false;
  else if (keysArr1.length === 0 && keysArr2.length === 0) return true;
  /* eslint-disable-next-line */ else return !keysArr1.some(key => obj1[key] != obj2[key]);
};

/**
 * 截流函数
 */
export const delay = (function() {
  let timer = 0;
  return function(callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();

// 获取每个节点的直属子节点，*记住是直属，不是所有子节点
export const getTrees = (list, parentId) => {
  let items = {};
  // 获取每个节点的直属子节点，*记住是直属，不是所有子节点
  for (let i = 0; i < list.length; i++) {
    let key = list[i].parentId;
    if (items[key]) {
      items[key].push(list[i]);
    } else {
      items[key] = [];
      items[key].push(list[i]);
    }
  }
  return formatTree(items, parentId);
};

/**
 * 利用递归格式化每个节点
 */
export const formatTree = (items, parentId) => {
  let result = [];
  if (!items[parentId]) {
    return result;
  }
  for (let t of items[parentId]) {
    t.children = formatTree(items, t.menuId);
    result.push(t);
  }
  return result;
};

export const calMax = arr => {
  var max = Number(arr[0]);
  for (var i = 1; i < arr.length; i++) {
    // 求出一组数组中的最大值
    if (max < Number(arr[i])) {
      max = arr[i];
    }
  }
  var maxint = Math.ceil(max / 10); // 向上取整
  var maxval = maxint * 10; // 最终设置的最大值
  return maxval; // 输出最大值
};

export const calMin = arr => {
  var min = Number(arr[0]);
  for (var i = 1; i < arr.length; i++) {
    // 求出一组数组中的最大值
    if (min > Number(arr[i])) {
      min = arr[i];
    }
  }
  var minint = Math.floor(min / 5); // 向下取整
  var minval = minint * 5; // 最终设置的最大值
  return minval; // 输出最大值
};

export const filterData = data => {
  let params = {};
  for (let i in data) {
    if (data[i] === null || data[i] === undefined || data[i] === '') continue;
    params[i] = data[i];
  }
  return qs.stringify(params);
};

// 签名算法 - sha1加密
export const get_sign = (data, time) => {
  // 防止浏览器转义
  data = decodeURIComponent(data);
  if (data) {
    // 从字符串里把属性和值取到数组中
    let dataSplit = data.split('&');
    let objkey = [], // 存属性名
      objvalue = []; // 存属性值
    // 分别将key和value放在对应函数中
    // 分别将key和value放在对应函数中
    for (let i = 0; i < dataSplit.length; i++) {
      if (dataSplit[i].split('=').length > 2) {
        let temp = dataSplit[i].indexOf('=');
        objkey.push(dataSplit[i].substring(0, temp));
        objvalue.push(dataSplit[i].substring(temp + 1));
      } else {
        objkey.push(dataSplit[i].split('=')[0]);
        objvalue.push(dataSplit[i].split('=')[1]);
      }
    }
    // 将选出来的属性和值从数组里一一对应存到对象中
    let obj = {};
    for (let j = 0; j < objkey.length; j++) {
      obj[objkey[j]] = objvalue[j];
    }

    //获取当前时间并添加当前时间戳到obj对象中
    obj._timestamp = time;

    // 添加_appid
    obj._appid = '44efec05494c4ca3a4a7ada47722a1a8';

    // 字典排序得到对象newObj
    let newKey = Object.keys(obj).sort();
    let newObj = {};
    for (let i = 0; i < newKey.length; i++) {
      newObj[newKey[i]] = obj[newKey[i]];
    }

    let signarr = []; // 存排序后的数组

    for (let key in newObj) {
      signarr.push(key + '=' + newObj[key]); // 存储操作
    }

    let str = signarr.join('&'); //需要加密的字符串

    //sha1加密
    let sha1 = require('sha1');
    let _sign = sha1(str);
    return _sign; //返回	请求参数_sign
  }
};
