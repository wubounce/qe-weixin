/**
 *  帮助中心
 */
import fetch from '@/service/http';

const listApi = 'help/list';                                        // 帮助中心列表 method 'post'
const detailApi = 'help/detail';                                    // 帮助中心详情 method 'post'


// 帮助中心列表
export const helpListFun = (payload) => fetch.post(listApi, payload);

// 帮助中心详情
export const detailFun = (payload) => fetch.post(detailApi, payload);
