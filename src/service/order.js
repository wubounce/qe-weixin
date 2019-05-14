/**
 *  订单
 */
import fetch from '@/service/http';

const orderListApi = 'order/getOrderList'; // 订单列表 method 'post'
const orderRefundApi = 'order/refund'; // 订单退款 method 'post'
const machineResetApi = 'machine/reset'; // 订单列表，复位 method 'post'
const machineBootApi = 'machine/boot'; // 订单列表，启动 method 'post'
const searchOrderApi = 'order/listSearchOrder'; //搜索订单
const orderDetailApi = 'order/getOrderManagerDetail'; // 获取订单详情
const compensateApi = 'voucher/compensate'; //订单补偿
const historySelectApi = 'order/history/select'; //订单历史月份
const getOrderSimpleApi = '/order/getOrderSimple'; //订单历史月份
const isReleaseCompensateApji = '/voucher/release/judge'; // 判断是否补偿过优惠券 method 'post'
// 订单列表
export const orderListFun = payload => fetch.post(orderListApi, payload);

//订单退款
export const ordeRrefundFun = payload => fetch.post(orderRefundApi, payload);

//订单列表，复位
export const machineResetFun = payload => fetch.post(machineResetApi, payload);

// 订单列表，启动
export const machineBootFun = payload => fetch.post(machineBootApi, payload);

// 订单搜索订单
export const searchOrderFun = payload => fetch.post(searchOrderApi, payload);

// 获取订单详情
export const orderDetailFun = payload => fetch.post(orderDetailApi, payload);

// 获取订单详情
export const compensateFun = payload => fetch.post(compensateApi, payload);

// 订单历史月份
export const historySelectFun = payload =>
  fetch.post(historySelectApi, payload);

// 获取分成
export const getOrderSimpleFun = payload =>
  fetch.post(getOrderSimpleApi, payload);

// 判断是否补偿过优惠券
export const isReleaseCompensateFun = payload =>
  fetch.post(isReleaseCompensateApji, payload);
