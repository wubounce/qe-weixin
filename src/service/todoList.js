/**
 *  待办事项
 */
import fetch from '@/service/http';

export const listBatchStartApi = '/batchExecutePlan/listBatchStart'; //获取批量定时启动设备列表 method 'post'
const getBatchStartApi = '/batchExecutePlan/getBatchStart'; //查询批量定时启动 method 'post'
const delBatchStartApi = '/batchExecutePlan/delBatchStart'; //删除批量定时启动设备 method 'post'
const updateBatchStartApi = '/batchExecutePlan/updateBatchStart'; //编辑批量定时启动设备 method 'post'
const getFunctionListApi = '/batchExecutePlan/getFunctionList'; //获取模式列表 method 'post'
const batchStartNowApi = '/batchExecutePlan/batchStartNow'; //批量定时启动 method 'post'
const addBatchStartApi = '/batchExecutePlan/add'; //批量定时启动 method 'post'

export const listBatchStartFun = payload =>
  fetch.post(listBatchStartApi, payload); //获取批量定时启动设备列表
export const getBatchStartFun = payload =>
  fetch.post(getBatchStartApi, payload); //查询批量定时启动
export const delBatchStartFun = payload =>
  fetch.post(delBatchStartApi, payload); //查询批量定时启动
export const updateBatchStartFun = payload =>
  fetch.post(updateBatchStartApi, payload); //编辑批量定时启动设备
export const getFunctionListFun = payload =>
  fetch.post(getFunctionListApi, payload); //获取模式列表
export const batchStartNowFun = payload =>
  fetch.post(batchStartNowApi, payload); //批量定时启动 method 'post'
export const addBatchStartFun = payload =>
  fetch.post(addBatchStartApi, payload); //添加批量定时启动 method 'post'
