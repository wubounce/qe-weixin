/**
 *  店铺列表
 */
import fetch from '@/service/http';

const areaListApi = 'area/list'; //获取区域列表 method 'post'
export const manageListApi = '/shop/manageList'; //店铺列表，店铺名称  method 'post'
const shopTypeListApi = '/shop/shopTypeList'; //店铺类型
const detailApi = '/shop/detail'; //店铺详情  method 'post'
const addOrEditShopApi = '/shop/addOrEdit'; //新增或编辑店铺 method 'post'
const deleteShopApi = '/shop/deleteShop'; //删除店铺 method 'post'
const listParentTypeApi = '/machine/listParentType'; //获取一级类型 method 'post'
const uploadFileApi = '/common/uploadFile'; //上传图片 method 'post'
const monthFloweApi = 'operatorBalanceLog/monthFlow'; //店铺或设备-月流水
const dayFloweApi = 'operatorBalanceLog/dayFlow'; //店铺或设备-日流水
const orderFlowApi = 'operatorBalanceLog/orderFlow'; //店铺或设备-订单流水'
const excelDayFlowApi = 'operatorBalanceLog/excelDayFlow'; // 日流水导出excel method 'post'
const excelOrderFlowlApi = 'operatorBalanceLog/excelOrderFlow'; // 订单流水导出excel method 'post'
const listByShopNameApi = 'shop/listByShopName'; // 店铺名称模糊搜索 method 'post'

export const areaListFun = payload => fetch.post(areaListApi, payload); //获取区域列表
export const manageListFun = payload => fetch.post(manageListApi, payload); //店铺列表
export const shopTypeListFun = payload => fetch.post(shopTypeListApi, payload); //店铺类型
export const shopDetailFun = payload => fetch.post(detailApi, payload); //店铺详情
export const addOrEditShopFun = payload =>
  fetch.post(addOrEditShopApi, payload); //新增或编辑店铺
export const deleteShopFun = payload => fetch.post(deleteShopApi, payload); //删除店铺
export const listParentTypeFun = payload =>
  fetch.post(listParentTypeApi, payload); //获取区域列表
export const uploadFileFun = payload => fetch.post(uploadFileApi, payload); //上传图片
export const monthFloweFun = payload => fetch.post(monthFloweApi, payload); //店铺或设备-月流水
export const dayFloweFun = payload => fetch.post(dayFloweApi, payload); //店铺或设备-日流水
export const orderFlowFun = payload => fetch.post(orderFlowApi, payload); //店铺或设备-订单流水'
// 日流水导出excel
export const excelDayFlowFun = payload => fetch.post(excelDayFlowApi, payload);

// 订单流水导出excel
export const excelOrderFlowlFun = payload =>
  fetch.post(excelOrderFlowlApi, payload);

// 店铺名称模糊搜索
export const listByShopNameFun = payload =>
  fetch.post(listByShopNameApi, payload);
