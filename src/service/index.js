/**
 *  首页
 */
import fetch from '@/service/http';

const listParentTypeApi = 'machine/listParentType'; // 设备分类 method 'post'
const countMachineApi = 'machine/countMachine'; // 设备监控 method 'post'
const totalProfitApi = 'operatorBalanceLog/totalProfit'; // 总收益 method 'post'
const timeProfitApi = 'operatorBalanceLog/timeProfit'; // 收益数据 method 'post'
const typeProfitApi = 'operatorBalanceLog/typeProfit'; // 收益分布 method 'post'
const balanceLogProfitListApi = 'operatorBalanceLog/balanceLogProfitList'; // 收益明细（总收益、月收益、日收益）method 'post'
const orderCountApi = 'order/orderCount'; // 订单数据
const userCountApi = '/order/userCount'; // 用户数据
const deviceActiveRatiotApi = '/order/deviceActiveRatio'; // 设备数据

// 设备分类
export const ParentTypeFun = payload => fetch.post(listParentTypeApi, payload);

// 设备监控
export const countMachineFun = payload => fetch.post(countMachineApi, payload);

// 总收益
export const totalProfitFun = payload => fetch.post(totalProfitApi, payload);

//收益明细（总收益、月收益、日收益）
export const balanceLogProfitListFun = payload =>
  fetch.post(balanceLogProfitListApi, payload);

// 收益数据
export const timeProfitFun = payload => fetch.post(timeProfitApi, payload);

// 收益分布
export const typeProfitFun = payload => fetch.post(typeProfitApi, payload);

// 订单数据
export const orderCountFun = payload => fetch.post(orderCountApi, payload);

// 用户数据
export const userCountFun = payload => fetch.post(userCountApi, payload);

// 设备数据
export const deviceActiveRatiotFun = payload =>
  fetch.post(deviceActiveRatiotApi, payload);
