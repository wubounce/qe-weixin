/**
 *  描述：Global filters js
 */
const install = Vue => {
  /**
   * @description 保留两位小数
   */
  Vue.filter('tofixd', value => {
    let tmp = null;
    tmp =
      value && Number(value) !== 0.0 && Number(value) !== 0
        ? Number(value).toFixed(2)
        : '-';
    return tmp;
  });

  /**
   * @description 千分位
   */
  Vue.filter('numFormat', value => {
    return String(value).indexOf('.') !== -1
      ? value.toLocaleString()
      : String(value).replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  });

  /**
   * @description 根据支付宝账号中间四位*代替
   */
  Vue.filter('replaceAliply', value => {
    return String(value).replace(/^(\d{4})\d{4}(\d+)/, '$1****$2');
  });

  /**
   * @description 限时优惠自定义活动日
   */
  Vue.filter('week', value => {
    if (value == '9') {
      return '每天';
    } else if (value == '8') {
      return '周一至周五';
    } else {
      let arr = [];
      let weeklsit = [];
      arr = value ? value.split(',') : [];
      arr.forEach(item => {
        if (item == '1') {
          weeklsit.push('周一');
        } else if (item == '2') {
          weeklsit.push('周二');
        } else if (item == '3') {
          weeklsit.push('周三');
        } else if (item == '4') {
          weeklsit.push('周四');
        } else if (item == '5') {
          weeklsit.push('周五');
        } else if (item == '6') {
          weeklsit.push('周六');
        } else if (item == '0') {
          weeklsit.push('周日');
        }
      });
      return weeklsit.join(',');
    }
  });
};

export default install;
