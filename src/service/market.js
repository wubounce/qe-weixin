/**
 *  时段营销
 */
import fetch from '@/service/http';

const timeMarketListApi = 'timeMarket/list';                                            // 获取时段营销列表 method 'post'
const addOruPdateApi = 'timeMarket/saveTimeMarket';                                     // 添加/更新时段营销 method 'post'
const delMarketApi = 'timeMarket/deleteTimeMarket';                                     // 删除时段营销 method 'post'
const DetailMarketApi = 'timeMarket/timeMarketDetail';                                  // 时段营销详情 method 'post'
const vipListApi = 'shopCard/listByPage';                                               // 店铺vip卡列表 method 'post'
const vipDetailApi = 'shopCard/detail';                                                 // 店铺vip卡详情 method 'post'
const addVipApi = 'shopCard/add';                                                       // 店铺vip卡新增 method 'post'
const updateVipApi = 'shopCard/update';                                                 // 店铺vip卡修改 method 'post'
const delVipApi = 'shopCard/delete';                                                    // 店铺vip卡删除 method 'post'
const vipShopsApi = 'shopCard/nonRelaShops';                                            //vip卡-可选择的店铺
const updataeStatusApi = '/timeMarket/updateTimeStatus';                                //修改营销停用启用状态
const marketlistParentTypeId = '/timeMarket/listParentTypeId';                          //vip卡-可选择的店铺

// 获取时段营销列表
export const timeMarketListFun = (payload) => fetch.post(timeMarketListApi,  payload);

// 添加/更新时段营销 
export const addOruPdateFun = (payload) => fetch.post(addOruPdateApi,  payload);

// 删除时段营销
export const delMarketFun = (payload) => fetch.post(delMarketApi,  payload);

//时段营销详情
export const detailMarketFun = (payload) => fetch.post(DetailMarketApi,  payload);

//店铺vip卡列表
export const vipListFun = (payload) => fetch.post(vipListApi,  payload);

//店铺vip卡详情
export const vipDetailFun = (payload) => fetch.post(vipDetailApi,  payload);


//店铺vip卡新增
export const addVipFun = (payload) => fetch.post(addVipApi,  payload);
//店铺vip卡修改
export const updateVipFun = (payload) => fetch.post(updateVipApi,  payload);

//店铺vip卡删除
export const delVipFun = (payload) => fetch.post(delVipApi,  payload);

//vip卡-可选择的店铺
export const vipShopsFun = (payload) => fetch.post(vipShopsApi,  payload);

//vip卡-可选择的店铺
export const marketlistParentTypeIdFun = (payload) => fetch.post(marketlistParentTypeId,  payload);

//vip卡-可选择的店铺
export const updataeStatusFun = (payload) => fetch.post(updataeStatusApi,  payload);
