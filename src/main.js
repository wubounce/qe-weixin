import 'babel-polyfill';
import Cookies from 'js-cookie';

import './icons'; // icon
import '@/styles/index.scss'; // global css
import '@/assets/themeef5657/index.css';
// import ElementUI from 'element-ui';
import App from './App';
import router from './router';
import store from './store';

import filter from '@/filters/index'; // global filter
import directive from '@/directive/index'; // global directive
import common from '@/utils/common'; // global directive
//打印插件
import Print from '@/utils/print'


import { Message } from 'element-ui';
import lodash from 'lodash';
// 引入vue-amap

window.VueAMap.initAMapApiLoader({
  key: '613b0f15bea16ba4bb84c1c9cde9ae88',
  plugin: [
    'AMap.Autocomplete',
    'AMap.PlaceSearch',
    'AMap.Scale',
    'AMap.OverView',
    'AMap.ToolBar',
    'AMap.MapType',
    'AMap.PolyEditor',
    'AMap.CircleEditor',
    'AMap.Geolocation',
    'AMap.Geocoder'
  ]
});
/* eslint-disable */
Vue.config.productionTip = true;
Vue.prototype.$ELEMENT = { size: Cookies.get('size') || 'small' };
Vue.prototype.$Message = Message;
Vue.prototype.STATIC_IMAGE = process.env.VUE_APP_STATICURL;
Vue.prototype._ = lodash;
// Vue.use(ElementUI, {
//   size: Cookies.get('size') || 'small' // set element-ui default size
// });
Vue.use(filter);
Vue.use(directive);
Vue.use(common);
Vue.use(Print);
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
