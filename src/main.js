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

import { Message } from 'element-ui';
/* eslint-disable */
Vue.config.productionTip = true;
Vue.prototype.$ELEMENT = { size: Cookies.get('size') || 'small' };
Vue.prototype.$Message = Message;
// Vue.use(ElementUI, {
//   size: Cookies.get('size') || 'small' // set element-ui default size
// });
Vue.use(filter);
Vue.use(directive);
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
