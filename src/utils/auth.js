import Cookies from 'js-cookie';
import { objEqual } from './tools';

const TokenKey = 'token';

/**
 * @description 本地存储和获取token
 */
export function getToken () {
  return Cookies.get(TokenKey);
}

/**
 * @description 本地存储和获取token
 */
export function setToken (token) {
  return Cookies.set(TokenKey, token);
}

/**
 * @description 本地存储和获取token
 */
export function removeToken () {
  return Cookies.remove(TokenKey);
}

/**
 * @description 本地存储和用户信息
 */
export function setUserInfoInLocalstorage (userInfo) {
  localStorage.userInfo = JSON.stringify(userInfo);
}

/**
 * @description 获取本地存储和用户信息
 */
export function getUserInfoInLocalstorage () {
  return localStorage.userInfo ? JSON.parse(localStorage.userInfo) : {};
}

/**
 * @description 本地存储和获取标签导航列表
 */
export function setTagNavListInLocalstorage (list) {
  localStorage.tagNaveList = JSON.stringify(list);
}

/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */
export function getTagNavListFromLocalstorage () {
  return localStorage.tagNaveList ? JSON.parse(localStorage.tagNaveList) : [];
}

/**
 * @description 根据name/params/query判断两个路由对象是否相等
 * @param {*} route1 路由对象
 * @param {*} route2 路由对象
 */
export function routeEqual (route1, route2) {
  const params1 = route1.params || {};
  const params2 = route2.params || {};
  const query1 = route1.query || {};
  const query2 = route2.query || {};
  return (
    route1.name === route2.name &&
    objEqual(params1, params2) &&
    objEqual(query1, query2)
  );
}
