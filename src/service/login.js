/**
 *  登录
 */
import fetch from '@/service/http';

// const loginApi = 'operator/webLogin'; // 登录 method 'post'
const loginApi = 'operator/login'; // 登录 method 'post'
const userDatilApi = 'operator/getOperator'; // 登录 method 'post'
const codeLoginApi = 'operator/codeLogin'; // 手机验证码登录 method 'post'
const sendLoginCodeApi = 'operator/sendLoginCode'; // 手机验证码登录发送验证码
const operatorAgentSignApi = 'operatorAgentSign/commit'; // 手机验证码登录发送验证码
const operatorCompleteAgentSignApi = '/operatorAgentSign/order/complete/detail'; // 手机验证码登录发送验证码

// 登录
export const login = payload => fetch.post(loginApi, payload);

// 用户详情
export const getDEtail = payload =>
  fetch.post(userDatilApi, { params: payload });

//  手机验证码登录
export const codeLogin = payload => fetch.post(codeLoginApi, payload);

// 手机验证码登录发送验证码
export const sendLoginCodeFun = payload =>
  fetch.post(sendLoginCodeApi, payload);

// 提交申请代签约
export const handleOperatorAgentSignFun = payload =>
  fetch.post(operatorAgentSignApi, payload);

// 提交申请代签约
export const completeAgentSign = payload =>
  fetch.post(operatorCompleteAgentSignApi, payload);
