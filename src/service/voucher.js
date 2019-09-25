/**
 *  优惠券
 */
import fetch from '@/service/http';

export const listApi = 'voucher/list'; // 优惠券列表 method 'post'

// 优惠券列表
export const voucherListFun = payload => fetch.post(listApi, payload);

