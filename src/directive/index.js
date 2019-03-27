/**
 *  描述：Global directive js
 */

import { getMenu } from '@/utils/tools';

const install = Vue => {
  /**
   * @description 权限检查方法
   */
  Vue.prototype.$_has = function(value) {
    let isExist = false;
    let buttonpermsStr = getMenu();
    if (buttonpermsStr == undefined || buttonpermsStr == null) {
      return false;
    }
    for (let i = 0; i < buttonpermsStr.length; i++) {
      if (buttonpermsStr[i].perms.includes(String(value))) {
        isExist = true;
        break;
      }
    }
    return isExist;
  };

  /**
   * @description 按钮权限指令
   */
  Vue.directive('has', {
    bind: function(el, binding) {
      if (!Vue.prototype.$_has(binding.value)) {
        // el.parentNode.removeChild(el);
        var childs = el.childNodes;
        if (childs) {
          for (var i = childs.length - 1; i >= 0; i--) {
            el.removeChild(childs[i]);
          }
        }
        el.style.display = 'none';
      }
    }
  });

  /**
   * @description 自动获取焦点
   */
  Vue.directive('focus', {
    inserted: function(el) {
      el.focus();
    }
  });
};

export default install;
