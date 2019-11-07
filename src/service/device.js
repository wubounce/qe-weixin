/**
 *  设备相关接口
 */
import fetch from '@/service/http';

export const deviceList = 'machine/manageListNew'; //获取设备列表 method 'post'
const detailDevice = 'machine/detail'; //设配管理详情
const deleteDevice = 'machine/delete'; //删除设备
const manageResetDevice = 'machine/manageReset'; //设备复位
const tzjDevice = 'machine/tzj'; //桶自洁
const getlistParentType = 'machine/listParentType'; //一级类型 method 'post'
const getFunctionSetList = 'machine/functionList'; //功能设置列表 method 'post'
const deviceAddorEdit = 'machine/addOrEdit'; //设备编辑 method 'post'
const batchEditDetergentListApi = 'machine/detergentList'; //批量启动获取功能列表 method ‘post'
const batchEdit = 'machine/batchEdit'; //批量编辑
const typeList = 'machine/typeList'; //通信类型（串口或者脉冲）
const listShopBatchStart = 'shop/listShopBatchStart'; //批量启动店铺列表
const machineStart = 'machine/machineStart'; //设备详情 - 启动
const batchEditDetergent = 'machine/batchEditDetergent'; //批量编辑设备洗衣液功能 - 启动
const quantifyStartApi = 'machine/quantify/start'; //充电桩定量启动
const quantifyResetApi = 'machine/quantify/reset'; //充电桩定量复位
const batchEditTagApi = 'machine/batchEditTag'; //充电桩定量复位
const getNewListSubType = 'machine/listSubTypeNew'; //新二级类型 method 'post'
const newListSubTypeAll = 'machine/listSubTypeAllNew'; //新所有二级类型 method 'post'


//获取设备列表
export const deviceListFun = payload => fetch.post(deviceList, payload);

//获取设备管理详情
export const detailDeviceListFun = payload => fetch.post(detailDevice, payload);

//设备删除
export const deleteDeviceFun = payload => fetch.post(deleteDevice, payload);

//设备复位
export const manageResetDeviceFun = payload => fetch.post(manageResetDevice, payload);

//设备桶自洁
export const tzjDeviceFun = payload => fetch.post(tzjDevice, payload); //设备桶自洁

//获取一级类型
export const getlistParentTypeFun = payload => fetch.post(getlistParentType, payload); //获取一级类型


//获取功能列表
export const getFunctionSetListFun = payload => fetch.post(getFunctionSetList, payload);

//设备编辑添加
export const deviceAddorEditFun = payload => fetch.post(deviceAddorEdit, payload);

//批量编辑
export const batchEditFun = payload => fetch.post(batchEdit, payload);

//通信类型（串口或者脉冲）
export const typeListFun = payload => fetch.post(typeList, payload);


//批量启动店铺列表
export const listShopBatchStartFun = payload => fetch.post(listShopBatchStart, payload);

//启动
export const machineStartFun = payload => fetch.post(machineStart, payload);

//批量编辑洗衣液功能列表
export const batchEditDetergentFun = payload => fetch.post(batchEditDetergent, payload);

//批量编辑洗衣液
export const batchEditDetergentListFun = payload => fetch.post(batchEditDetergentListApi, payload);

//充电桩定量启动
export const quantifyStartFun = payload => fetch.post(quantifyStartApi, payload);

//充电桩定量复位
export const quantifyResetFun = payload => fetch.post(quantifyResetApi, payload);


//更改点位
export const batchEditTagFun = payload => fetch.post(batchEditTagApi, payload);

//获取新二级类型
export const getNewListSubTypeFun = payload => fetch.post(getNewListSubType, payload);

//获取所有新二级类型
export const newListSubTypeAllFun = payload => fetch.post(newListSubTypeAll, payload);
