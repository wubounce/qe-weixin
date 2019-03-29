/**
 *  描述：Global filters js
 */
const install = Vue => {
  /**
   * @description 保留两位小数
   */
  Vue.filter('tofixd', value => {
    return Number(value).toFixed(2);
  });

  /**
   * @description 千分位
   */
  Vue.filter('numFormat', value => {
    return String(value).indexOf('.') !== -1 ? value.toLocaleString() : String(value).replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  });

  /**
   * @description 根据支付宝账号中间四位*代替
   */
  Vue.filter('replaceAliply', value => {
    return String(value).replace(/^(\d{4})\d{4}(\d+)/, '$1****$2');
  });
};

export default install;
