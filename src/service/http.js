import axios from 'axios';
import qs from 'qs';
import store from '@/store';
import { getToken, getUserInfoInLocalstorage } from '@/utils/auth';
import { filterData, get_sign } from '@/utils/tools';
import { Message, Loading } from 'element-ui';
// 创建axios实例
const http = axios.create({
  baseURL: process.env.VUE_APP_URL, // api的base_url
  timeout: 30000, // 请求超时时间
  paramsSerializer: params => {
    return qs.stringify(params, { arrayFormat: 'brackets' });
  }
});

// 遮罩
let loading = null;
// request拦截器
http.interceptors.request.use(
  config => {
    if (getUserInfoInLocalstorage()) {
      config.headers.uid = getUserInfoInLocalstorage().id;
    }
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    } else {
      // 过滤为null的参数
      config.data = filterData(config.data);
      let token = getToken();
      let _timestamp = new Date().getTime();
      if (token) {
        config.data = config.data ? config.data + `&token=${token}` : `token=${token}`;
        // 添加签名
        let _sign = get_sign(config.data, _timestamp);
        config.data = config.data + `&_sign=${_sign}` + `&_timestamp=${_timestamp}`;
      } else {
        let _sign = get_sign(config.data, _timestamp);
        config.data = config.data + `&_sign=${_sign}` + `&_timestamp=${_timestamp}`;
      }
    }
    // 请求之前加遮罩
    loading = Loading.service({ fullscreen: true });
    return config;
  },
  error => {
    Message.warning('请求超时，请重新操作');
    Promise.reject(error);
  }
);

// respone拦截器
http.interceptors.response.use(
  // 关闭遮罩
  response => {
    loading && loading.close();
    if (response.data.code === 0) {
      return Promise.resolve(response.data.data);
    } else if (response.data.code === 11 || response.data.code === 7004 || response.data.code === 8002 || response.data.code === 10) {//11:Token 过期了; //7004:无权限;//8002:运营商不存在;
      store.dispatch('LogOut').then(() => {
        location.reload();
      });
    } else if (response.headers['content-type'] === 'application/octet-stream;charset=utf-8') {
      return response;
    } else {
      Message.error(response.data.msg);
      return Promise.reject(response.data);
    }
  },
  error => {
    if (error.message.includes('timeout')) {
      Message.warning('请求超时，请重新操作');
    } else {
      Message.error('服务器开小差了');
    }
    return Promise.reject(error);
  }
);

export default http;
