import fetch from '@/service/http';

const getOperatorApi = 'operatorBalanceLog/getOperator';  // 我的 method 'post'

// 我的
export const getOperatorFun = (payload) => fetch.post(getOperatorApi, payload);

