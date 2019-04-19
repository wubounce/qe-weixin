/**
 *  优惠券
 */
import fetch from '@/service/http';

export const listApi = 'voucher/list'; // 优惠券列表 method 'post'
const detailApi = 'voucher/detail'; // 优惠券详情 method 'post'
const countApi = 'voucher/count'; // 优惠券详情 method 'post'
const vipCardlistApi = 'shopCard/soldCardsHistory'; // vip卡 售卡记录 method 'post'
const vipmemberlistApi = 'shopCard/memberList'; // vip卡 会员列表 method 'post'

// 优惠券列表
export const voucherListFun = payload => fetch.post(listApi, payload);

// 优惠券详情
export const voucherDetailFun = payload => fetch.post(detailApi, payload);

// 优惠券数量
export const voucherCountFun = payload => fetch.post(countApi, payload);

// vip卡售卡记录
export const vipCardListFun = payload => fetch.post(vipCardlistApi, payload);

// vip卡会员列表
export const vipMemberListFun = payload =>
  fetch.post(vipmemberlistApi, payload);
