/**
 *  登录
 */
import fetch from '@/service/http';

const getOperatorApi = 'operatorBalanceLog/getOperator';                             // 我的 method 'post'
const getApplyFinanceApi = 'operatorBalanceLog/getApplyFinance';                     // 获取商户可提现余额 method 'post
const getApplyaccountApi = 'operatorBalanceLog/getMoneySubmit';                     // 获取支付宝账号和余额 method 'post

const applyMoneySubmitApi = 'operatorBalanceLog/applyMoneySubmit';                   // 提交提现申请 method 'post'
const getApplyListApi = 'operatorBalanceLog/getApplyList';                           // 收支明细 method 'post'
const getOrderDetailApi = 'order/getOrderDetail';                                    // 收支明细界面获取支付订单，退款订单详情 method 'post'
const getMoneySubmitDetailApi = 'order/getMoneySubmitDetail';                        // 提现记录界面获取提现订单详情 method 'post'

const getPersonalInfoApi = 'operator/getPersonalInfo';  // 设置>获取个人信息 method 'post'
const updateOperatorApi = 'operator/updateOperator';  // 设置>更新个人信息 method 'post'
const confirmOperatorApi = 'operator/confirmOperator'; //设置>实名认证 method 'post'

const getRealNameApi = 'operator/getConfirmOperator'; //设置>获取实名认证 method 'post'

// 我的
export const getOperatorFun = (payload) => fetch.post(getOperatorApi,payload);

// 获取商户可提现余额
export const getApplyFinanceFun = (payload) => fetch.post(getApplyFinanceApi,payload);

// 获取支付宝账号和余额
export const getApplyaccountFun = (payload) => fetch.post(getApplyaccountApi,payload);

// 提交提现申请
export const applyMoneySubmitFun = (payload) => fetch.post(applyMoneySubmitApi,payload);

// 收支明细
export const getApplyListFun = (payload) => fetch.post(getApplyListApi,payload);

// 退款订单详情
export const getOrderDetailFun = (payload) => fetch.post(getOrderDetailApi,payload);

// 获取提现订单详情
export const getMoneySubmitDetailFun = (payload) => fetch.post(getMoneySubmitDetailApi,payload);

// 设置>获取个人信息
export const getPersonalInfoFun = (payload) => fetch.post(getPersonalInfoApi,payload);

// 设置>更新个人信息
export const updateOperatorFun = (payload) => fetch.post(updateOperatorApi,payload);

// 设置>实名认证
export const confirmOperatorFun = (payload) => fetch.post(confirmOperatorApi,payload);

// 设置>获取实名认证
export const getRealNameFun = (payload) => fetch.post(getRealNameApi,payload);
