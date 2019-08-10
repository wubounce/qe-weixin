/**
 *  金币
 */
import fetch from '@/service/http';

export const tokenCoinAddApi = 'tokenCoin/add'; // 编辑添加金币 method 'post'
export const getTokenCoinApi = 'tokenCoin/get'; // 店铺金币详情 method 'post'
export const configTokenCoinApi = 'tokenCoin/config'; // 金币初始化配置 method 'post'
export const shoplistInTokenCoinApi = 'tokenCoin/shopList'; // 运营商店铺列表 method 'post'
export const findlistInTokenCoinApi = 'tokenCoin/findList'; // 运营商设置金币店铺列表 method 'post'
export const tokenCoinCloseApi = 'tokenCoin/close'; // 店铺金币关闭 method 'post'
export const tokenCoinOpenApi = 'tokenCoin/open'; // 店铺金币开启 method 'post'
export const tokenCoinDelApi = 'tokenCoin/delete'; // 店铺金币删除 method 'post'


// 编辑添加金币
export const tokenCoinAddFun = payload => fetch.post(tokenCoinAddApi, payload);
// 店铺金币详情
export const getTokenCoinFun = payload => fetch.post(getTokenCoinApi, payload);
// 金币初始化配置
export const configTokenCoinFun = payload => fetch.post(configTokenCoinApi, payload);
// 运营商店铺列表
export const shoplistInTokenCoinFun = payload => fetch.post(shoplistInTokenCoinApi, payload);
// 运营商设置金币店铺列表
export const findlistInTokenCoinFun = payload => fetch.post(findlistInTokenCoinApi, payload);
// 店铺金币关闭
export const tokenCoinCloseFun = payload => fetch.post(tokenCoinCloseApi, payload);
// 店铺金币开启
export const tokenCoinOpenFun = payload => fetch.post(tokenCoinOpenApi, payload);
// 店铺金币删除
export const tokenCoinDelFun = payload => fetch.post(tokenCoinDelApi, payload);