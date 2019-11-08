/**
 *  描述：Global directive js
 */

import store from '@/store';

const install = Vue => {
  /**
   * @description 权限检查方法
   */
  Vue.prototype._has = function (value) {
    let isExistPerms = false;
    let permsStr = store.getters.access || [];
    if (permsStr == undefined || permsStr == null) {
      return false;
    }
    for (let i = 0; i < permsStr.length; i++) {
      if (permsStr[i].perms.includes(String(value))) {
        isExistPerms = true;
        break;
      }
    }
    return isExistPerms;
  };

  /**
   * @description 按钮权限指令
   */
  Vue.directive('has', {
    bind: function (el, binding) {
      if (!Vue.prototype._has(binding.value)) {
        el.parentNode && el.parentNode.removeChild(el);
        // var childs = el.childNodes;
        // if (childs) {
        //   for (var i = childs.length - 1; i >= 0; i--) {
        //     el.removeChild(childs[i]);
        //   }
        // }
        // el.style.display = 'none';
      }
    }
  });

  /**
   * @description 自动获取焦点
   */
  Vue.directive('focus', {
    inserted: function (el) {
      el.focus();
    }
  });
  Vue.directive('clickoutside', {
    // 初始化指令
    bind (el, binding, vnode) {
      function documentHandler (e) {
        // 这里判断点击的元素是否是本身，是本身，则返回
        if (el.contains(e.target)) {
          return false;
        }
        // 判断指令中是否绑定了函数
        if (binding.expression) {
          // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
          binding.value(e);
        }
      }
      // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
      el.__vueClickOutside__ = documentHandler;
      document.addEventListener('click', documentHandler);
    },
    update () { },
    unbind (el, binding) {
      // 解除事件监听
      document.removeEventListener('click', el.__vueClickOutside__);
      delete el.__vueClickOutside__;
    }
  });
};

export default install;
