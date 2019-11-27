/**
 *  人员管理
 */
import fetch from '@/service/http';

const operatorListApi = 'operatorManager/listOperator';                                            // 获取管理员列表 method 'post'
const addOperatorApi = 'operatorManager/addOperator';                                              // 新增管理员 method 'post'
const getOperatorInfoApi = 'operatorManager/getOperatorInfo';                                      // 查询管理员详情 method 'post'
const updateOperatorInfoApi = 'operatorManager/updateOperatorInfo';                                // 更新管理员 method 'post'
const delOperatorApi = 'operatorManager/delOperatorInfo';                                          // 删除管理员 method 'post'
const lockOperatorApi = 'operatorManager/lockOperatorManager';                                     //禁用管理员
const shopListApi = 'shop/listShop';                                                               // 店铺列表 method 'post'
const menuSelectApi = 'mer/select';                                                                //获取所有菜单列表
const permsMenuApi = 'mer/perms';                                                                  //分配权限
const searchListApi = 'operatorManager/searchOperator';                                            //搜索管理员列表

// 获取管理员列表 
export const operatorListFun = (payload) => fetch.post(operatorListApi, payload);

//新增管理员
export const addOperatorFun = (payload) => fetch.post(addOperatorApi, payload);

//查询管理员详情
export const getOperatorInfoFun = (payload) => fetch.post(getOperatorInfoApi, payload);

// 更新管理员
export const updateOperatorInfoFun = (payload) => fetch.post(updateOperatorInfoApi, payload);

// 删除管理员
export const delOperatorFun = (payload) => fetch.post(delOperatorApi, payload);

// 禁用管理员
export const lockOperatorFun = (payload) => fetch.post(lockOperatorApi, payload);

//店铺列表
export const shopListFun = (payload) => fetch.post(shopListApi, payload);

//获取用户权限
export const menuSelectFun = (payload) => fetch.post(menuSelectApi, payload);

//分配权限菜单
export const permsMenuFun = (payload) => fetch.post(permsMenuApi, payload);

//搜索管理员列表
export const searchListFun = (payload) => fetch.post(searchListApi, payload);

