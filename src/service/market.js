/**
 *  时段营销
 */
import fetch from '@/service/http';

export const timeMarketListApi = 'timeMarket/list'; // 获取时段营销列表 method 'post'
const addOruPdateApi = 'timeMarket/saveTimeMarketApp'; // 添加/更新时段营销 method 'post'
const delMarketApi = 'timeMarket/deleteTimeMarket'; // 删除时段营销 method 'post'
const DetailMarketApi = 'timeMarket/timeMarketDetail'; // 时段营销详情 method 'post'
const updataeStatusApi = '/timeMarket/updateTimeStatus'; //修改营销停用启用状态
const marketlistParentTypeId = '/timeMarket/listParentTypeId'; //vip卡-可选择的店铺

// 获取时段营销列表
export const timeMarketListFun = payload => fetch.post(timeMarketListApi, payload);

// 添加/更新时段营销
export const addOruPdateFun = payload => fetch.post(addOruPdateApi, payload);

// 删除时段营销
export const delMarketFun = payload => fetch.post(delMarketApi, payload);

//时段营销详情
export const detailMarketFun = payload => fetch.post(DetailMarketApi, payload);

//vip卡-可选择的店铺
export const marketlistParentTypeIdFun = payload => fetch.post(marketlistParentTypeId, payload);

//修改营销停用启用状态
export const updataeStatusFun = payload => fetch.post(updataeStatusApi, payload);
