/**
 *  报表
 */
import fetch from '@/service/http';

const dayReportApi = 'operatorBalanceLog/revenueReport'; // 报表-按天统计 method 'post'
const machineReportApi = 'operatorBalanceLog/machineReport'; // 每天报表-按机器统计 method 'post'
const shopReportApi = 'operatorBalanceLog/shopReport'; // 每天报表-按店铺统计 method 'post'
const shopListApi = 'shop/listShop'; // 店铺列表 method 'post'

// 按天统计
export const dayReportFun = payload => fetch.post(dayReportApi, payload);

//按机器统计
export const machineReportFun = payload => fetch.post(machineReportApi, payload);

//按机器统计
export const shopReportFun = payload => fetch.post(shopReportApi, payload);

//店铺列表
export const shopListFun = payload => fetch.post(shopListApi, payload);
