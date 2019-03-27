/**
 *  支付宝和实名认证
 */
import fetch from '@/service/http';

const getAliAndStatusApi = 'operator/getAliAndStatus';

export const getAliAndStatusFun = (payload) => fetch.post(getAliAndStatusApi, payload);