
import fetch from '@/service/http';


const getBathroomApi = 'position/shower/list'; // 获取浴室列表 method 'post'
const editBathroomApi = 'position/shower/modify'; // 编辑浴室 method 'post'
const detailApi = 'position/shower/detail'; // 浴位详情 method 'post'
const showerListApi = 'shower/device/list/shower'; // 浴位列表 method 'post'

//获取浴室列表
export const getBathroomListFun = payload => fetch.post(getBathroomApi, payload);

//编辑浴室
export const editBathroomFun = payload => fetch.post(editBathroomApi, payload);

//浴位详情
export const getBathroomDetailFun = payload => fetch.post(detailApi, payload);
//浴位列表
export const getShowerListFun = payload => fetch.post(showerListApi, payload);