import {
  getToken,
  setToken,
  removeToken,
  setUserInfoInLocalstorage,
  getUserInfoInLocalstorage
} from '@/utils/auth';
import { login } from '@/service/login';
import { getOperatorFun } from '@/service/user';
import { menuSelectFun } from '@/service/member';
// import { getTrees } from '@/utils/tools';
const user = {
  state: {
    token: getToken(),
    userInfo: getUserInfoInLocalstorage(),
    access: [],
    hasGetPermsInfo: false
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_USER_INFO (state, userInfo) {
      state.userInfo = userInfo;
    },
    SET_ACCESS (state, access) {
      state.access = access;
    },
    SET_HAS_PRES_INFO (state, status) {
      state.hasGetPermsInfo = status;
    }
  },
  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      const userName = userInfo.userName.trim();
      return new Promise((resolve, reject) => {
        login({ userName: userName, password: userInfo.password })
          .then(res => {
            commit('SET_TOKEN', res.token);
            setToken(res.token);
            resolve(res);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 获取用户信息
    getUserInfo () {
      return new Promise(resolve => {
        getOperatorFun().then(res => {
          res = res ? res : {};
          setUserInfoInLocalstorage(res);
          resolve(res);
        });
      });
    },
    // 获取权限列表
    getPermsInfo ({ commit }) {
      return new Promise(resolve => {
        menuSelectFun().then(res => {
          // let permsList = getTrees(res, 0);
          commit('SET_ACCESS', res);
          commit('SET_HAS_PRES_INFO', true);
          resolve(res);
        });
      });
    },
    // 前端 登出
    LogOut ({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        commit('SET_ACCESS', []);
        commit('SET_USER_INFO', {});
        commit('SET_HAS_PRES_INFO', false);
        removeToken();
        localStorage.clear();
        resolve();
      });
    }
  }
};

export default user;
