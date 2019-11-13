/**
 *  店铺列表
 */
import fetch from '@/service/http';

const areaListApi = 'area/list'; //获取区域列表 method 'post'
export const manageListApi = 'shop/manageList'; //店铺列表，店铺名称  method 'post'
const shopTypeListApi = 'shop/shopTypeList'; //店铺类型
const detailApi = 'shop/detail'; //店铺详情  method 'post'
const addOrEditShopApi = 'shop/addOrEdit'; //新增或编辑店铺 method 'post'
const deleteShopApi = 'shop/deleteShop'; //删除店铺 method 'post'
const manageSimpleListApi = 'machine/manageSimpleList'; // 店铺名里的设备列表 method 'post'
const revenueSharingAddApi = 'revenueSharing/add'; // 设置分账接口 method 'post'
const revenueSharingBatchAddApi = 'revenueSharing/batchAdd'; // 批量设置分账接口 method 'post'
const getrevenueSharingApi = 'revenueSharing/get'; // 获取店铺分账信息接口 method 'post'
const getByUserOperatornameApi = 'operator/getByUsername'; // 根据账号获取运营商 method 'post'
const reserveModuleListApi = 'shopMachineType/list'; // 预约模板列表 method 'post'
const reserveTemplateApi = "shopMachineType/addOrEdit"; // 预约保存模板（新增或修改） method 'post'
const reserveDetailApi = "shopMachineType/detail?"; // 预约详情 method 'post'
const getListSubTypeApi = 'machine/listSubType'; //新二级类型 method 'post'

//获取区域列表
export const areaListFun = payload => fetch.post(areaListApi, payload);

//店铺列表
export const manageListFun = payload => fetch.post(manageListApi, payload);

//店铺类型
export const shopTypeListFun = payload => fetch.post(shopTypeListApi, payload);

//店铺详情
export const shopDetailFun = payload => fetch.post(detailApi, payload);

//新增或编辑店铺
export const addOrEditShopFun = payload => fetch.post(addOrEditShopApi, payload);

//删除店铺
export const deleteShopFun = payload => fetch.post(deleteShopApi, payload);

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


// 预约模板列表
export const getReserveModuleListFun = payload =>
         fetch.post(reserveModuleListApi, payload);


// 预约保存模板（新增或修改）
export const doReserveTemplateFun = payload =>
         fetch.post(reserveTemplateApi, payload);
// 预约保存模板（新增或修改）
export const getReserveDetailFun = payload =>
         fetch.post(reserveDetailApi, payload);

//获取旧二级类型
export const getListSubTypeFun = payload =>
         fetch.post(getListSubTypeApi, payload);