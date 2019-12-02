/**
 *  金币
 */
import fetch from '@/service/http';

export const tokenCoinAddApi = 'tokenCoin/add'; // 添加金币 method 'post'
export const tokenCoinUpdateApi = 'tokenCoin/update'; // 编辑金币 method 'post'
export const getTokenCoinApi = 'tokenCoin/get'; // 店铺金币详情 method 'post'
export const configTokenCoinApi = 'tokenCoin/config'; // 金币初始化配置 method 'post'
export const shoplistInTokenCoinApi = 'tokenCoin/shopList'; // 运营商店铺列表 method 'post'
export const tokenCoinListApi = 'tokenCoin/list'; // 金币列表和回收，充值店铺列表 method 'post'
export const tokenCoinCloseApi = 'tokenCoin/close'; // 店铺金币关闭 method 'post'
export const tokenCoinOpenApi = 'tokenCoin/open'; // 店铺金币开启 method 'post'
export const tokenCoinDelApi = 'tokenCoin/delete'; // 店铺金币删除 method 'post'
export const getByPhoneApi = 'member/getByPhone'; // 手机查询 method 'post'
export const tokenCoinUsereApi = 'tokenCoin/user'; // 积分查询 method 'post'
export const refillAndDeductApi = 'tokenCoin/refillAndDeduct'; // 商家金币充值扣除 method 'post'
export const tokenCoinMemberListApi = 'tokenCoin/member/list'; // 金币会员管理 method 'post'
export const tokenCoinMemberRecordApi = 'tokenCoin/member/record'; // 会员充值记录 method 'post'
export const tokenCoinBatchRefillApi = 'tokenCoin/batch/refill'; // 金币批量充值 method 'post'


// 添加金币
export const tokenCoinAddFun = payload => fetch.post(tokenCoinAddApi, payload);

// 编辑金币
export const tokenCoinUpdateFun = payload => fetch.post(tokenCoinUpdateApi, payload);

// 店铺金币详情
export const getTokenCoinFun = payload => fetch.post(getTokenCoinApi, payload);

// 金币初始化配置
export const configTokenCoinFun = payload => fetch.post(configTokenCoinApi, payload);

// 运营商店铺列表
export const shoplistInTokenCoinFun = payload => fetch.post(shoplistInTokenCoinApi, payload);

// 金币列表和回收，充值店铺列表   回收isContainClose：2
export const tokenCoinListFun = payload => fetch.post(tokenCoinListApi, payload);

// 店铺金币关闭
export const tokenCoinCloseFun = payload => fetch.post(tokenCoinCloseApi, payload);

// 店铺金币开启
export const tokenCoinOpenFun = payload => fetch.post(tokenCoinOpenApi, payload);

// 店铺金币删除
export const tokenCoinDelFun = payload => fetch.post(tokenCoinDelApi, payload);

// 手机查询
export const getByPhoneFun = payload => fetch.post(getByPhoneApi, payload);

// 积分查询
export const tokenCoinUsereFun = payload => fetch.post(tokenCoinUsereApi, payload);

// 商家金币充值扣除
export const refillAndDeductFun = payload => fetch.post(refillAndDeductApi, payload);

// 金币会员管理
export const tokenCoinMemberListFun = payload => fetch.post(tokenCoinMemberListApi, payload);

// 会员充值记录
export const tokenCoinMemberRecordFun = payload => fetch.post(tokenCoinMemberRecordApi, payload);


// 金币批量充值
export const tokenCoinBatchRefillFun = (payload) =>
         fetch.post(tokenCoinBatchRefillApi, payload);