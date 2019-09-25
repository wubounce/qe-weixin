/**
 *  报表
 */
import fetch from '@/service/http';

export const dayReportApi = 'operatorBalanceLog/revenueReport'; // 报表-按天统计 method 'post'
const shopListApi = 'shop/listShop'; // 店铺列表 method 'post'
export const balanceLogFlowListApi = 'operatorBalanceLog/balanceLogFlowList'; // 店铺列表 method 'post'

// 按天统计
export const dayReportFun = payload => fetch.post(dayReportApi, payload);


//店铺列表
export const shopListFun = payload => fetch.post(shopListApi, payload);

//流水明细
export const balanceLogFlowListFun = payload => fetch.post(balanceLogFlowListApi, payload);
