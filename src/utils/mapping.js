/**
 * 数据映射类
 */

// 首页机器状态
export const MachineStatus = {
  idle: '空闲设备',
  run: '工作设备',
  hitch: '故障设备',
  offline: '离线设备',
  timeout: '超时未工作',
  all: '总数'
};

export const sourceType = {
  1: '订单',
  2: 'VIP',
  3: '金币'
};

export const earningType = {
  1: '收入',
  3: '退款',
};

// 通信类型
export const communicateType = {
  0: '脉冲',
  1: '串口'
};
export const ifOpenType = {
  0: '开启',
  1: '关闭'
};
// 设备状态类型
export const deviceSearchStatus = {
  1: '空闲',
  2: '运行',
  3: '预约',
  4: '故障',
};
// 网络状态类型
export const networkSearchStatus = {
  1: '在线',
  3: '离线',
  2: '频繁离线',
  0: '未注册',
};

// 设备状态类型
export const deviceStatus = {
  1: '空闲',
  2: '运行',
  3: '预约',
  4: '故障',
  5: '参数设置',
  6: '自检',
  7: '运行',
  8: '离线',
  16: '超时未工作'
};

// 设备状态类型颜色
export const deviceColorStatus = {
  1: '#1890FF',
  2: '#2FC25B',
  3: '#29dddd',
  4: '#EF5657',
  5: '#82848a',
  6: '#b532e8',
  7: '#2FC25B',
  8: '#FACC14',
  16: '#df6c1f'
};
// 设备水位
export const waterStatus = {
  1: '极低水位',
  2: '低水位',
  3: '中水位',
  4: '高水位'
};

// 订单状态类型
export const orderStatus = {
  0: '待支付',
  1: '支付超时',
  2: '已支付',
  5: '已退款'
};

// 支付方式
export const PayType = ststus => {
  switch (ststus) {
    case 0:
      return '其他';
    case 1:
      return '支付宝';
    case 2:
      return '余额';
    case 3:
      return '微信 ';
    case 4:
      return '受限余额 ';
    case 11:
      return '支付宝';
    case 12:
      return '支付宝';
    case 13:
      return '支付宝';
    case 31:
      return '微信 ';
    case 32:
      return '微信 ';
    default:
      return '-';
  }
};

// 交易类型
export const ApplyType = {
  1: '收入',
  2: '提现',
  3: '支出'
};

// 预约功能状态
export const isReserveType = {
  0: '已开通',
  1: '未开通'
};
// 是否有vip
export const isHasVipType = {
  false: '未设置',
  true: '已设置'
};
//是否优惠状态
export const isDiscountType = {
  false: '未设置',
  true: '已设置'
};

// 优惠券类型
export const CouponType = {
  1: '补偿券'
};
// 优惠券状态
export const CouponStatusType = {
  0: '未使用',
  1: '已使用',
  2: '已过期'
};

// 限时优惠活动状态
export const CouponAcctiveStatusType = {
  0: '未开始',
  1: '进行中',
  2: '已过期'
};

//优惠券来源类型
export const couponSourceType = {
  0: '订单补偿',
  1: '发券',
  2: '活动'
};

// 人员管理禁用启用
export const memberIsLock = {
  0: true,
  1: false
};
// 人员管理禁用启用
export const subAccountType = {
  0: '未配置',
  1: '已配置',
};

export const isForceUsType = {
  0: '关闭',
  1: '开启'
};
export const genderType = {
  0: '男',
  1: '女',
  2: '不限',
};

export const pointType = {
  1: '区域',
  2: '楼号',
  3: '单元',
  4: '楼层',
  5: '房间',
};
