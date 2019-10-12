/**
 *  点位
 */
import fetch from '@/service/http';

export const listApi = 'position/model/list'; // 点位模型列表 method 'post'
export const listChildrenApi = 'position/model/listChildren'; // 层级点位模型列表 method 'post'
export const editApi = 'position/model/edit'; // 编辑 method 'post'
export const deleteApi = 'position/model/delete'; // 删除 method 'post'
export const addApi = 'position/model/batchAdd'; // 添加 method 'post'

// 点位模型列表
export const poitionListFun = payload => fetch.post(listChildrenApi, payload);


//编辑
export const poitionEditFun = payload => fetch.post(editApi, payload);

//删除
export const poitionDeleteFun = payload => fetch.post(deleteApi, payload);

//添加
export const poitionAddFun = payload => fetch.post(addApi, payload);
