export default {
  // Vue.js的插件应当有一个公开方法 install。这个方法的第一个参数是 Vue 构造器，第二个参数是一个可选的选项对象。
  install: function (Vue) {
    Vue.prototype.isWaterMachine = id => {
      //开水机
      let tmp = [('423498872636048242', '428980698037093219')].includes(
        String(id)
      );
      return tmp;
    };
  }
};
