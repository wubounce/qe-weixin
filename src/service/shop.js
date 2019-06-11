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
const manageSimpleListApi = 'machine/manageSimpleList'; // 店铺名里的设备列表 method 'post'
const revenueSharingAddApi = 'revenueSharing/add'; // 设置分账接口 method 'post'
const revenueSharingBatchAddApi = 'revenueSharing/batchAdd'; // 批量设置分账接口 method 'post'
const getrevenueSharingApi = 'revenueSharing/get'; // 获取店铺分账信息接口 method 'get'
const getByUserOperatornameApi = 'operator/getByUsername'; // 根据账号获取运营商 method 'get'
const scripttimeApi = 'revenueSharing/share'; // 根据账号获取运营商 method 'get'

export const areaListFun = payload => fetch.post(areaListApi, payload); //获取区域列表
export const manageListFun = payload => fetch.post(manageListApi, payload); //店铺列表
export const shopTypeListFun = payload => fetch.post(shopTypeListApi, payload); //店铺类型
export const shopDetailFun = payload => fetch.post(detailApi, payload); //店铺详情
export const addOrEditShopFun = payload => fetch.post(addOrEditShopApi, payload); //新增或编辑店铺
export const deleteShopFun = payload => fetch.post(deleteShopApi, payload); //删除店铺
export const listParentTypeFun = payload => fetch.post(listParentTypeApi, payload); //获取区域列表
export const uploadFileFun = payload => fetch.post(uploadFileApi, payload); //上传图片
export const monthFloweFun = payload => fetch.post(monthFloweApi, payload); //店铺或设备-月流水
export const dayFloweFun = payload => fetch.post(dayFloweApi, payload); //店铺或设备-日流水
export const orderFlowFun = payload => fetch.post(orderFlowApi, payload); //店铺或设备-订单流水'
// 日流水导出excel
export const excelDayFlowFun = payload => fetch.post(excelDayFlowApi, payload);

// 订单流水导出excel
export const excelOrderFlowlFun = payload => fetch.post(excelOrderFlowlApi, payload);

// 店铺名称模糊搜索
export const listByShopNameFun = payload => fetch.post(listByShopNameApi, payload);

// 店铺名里的设备列表
export const manageSimpleListFun = payload => fetch.post(manageSimpleListApi, payload);

// 设置分账接口
export const revenueSharingAddFun = payload => fetch.post(revenueSharingAddApi, payload);

// 批量设置分账接口
export const revenueSharingBatchAddFun = payload => fetch.post(revenueSharingBatchAddApi, payload);

// 获取店铺分账信息接口
export const getrevenueSharingFun = payload => fetch.post(getrevenueSharingApi, payload)

// 根据账号获取运营商
export const getByUserOperatornameFun = payload => fetch.post(getByUserOperatornameApi, payload)

// 脚本时间
export const updatescripttimeFun = payload => fetch.post(scripttimeApi, payload)
