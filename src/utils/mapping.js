/**
 * 数据映射类
 */

// 首页机器状态
export const MachineStatus = ststus => {
  switch (ststus) {
    case 'idle':
      return '空闲设备';
    case 'run':
      return '工作设备';
    case 'hitch':
      return '故障设备';
    case 'offline':
      return '离线设备';
    case 'timeout':
      return '超时未工作';
    case 'all':
      return '总数';
    default:
      return ststus;
  }
};

// 首页通信类型
export const communicateType = ststus => {
  switch (ststus) {
    case 0:
      return '脉冲';
    case 1:
      return '串口';
    default:
      return ststus;
  }
};

// 设备状态类型
export const deviceStatus = ststus => {
  switch (ststus) {
    case 1:
      return '空闲';
    case 2:
      return '运行 ';
    case 3:
      return '预约';
    case 4:
      return '故障';
    case 5:
      return '参数设置';
    case 6:
      return '自检';
    case 7:
      return '预约';
    case 8:
      return '离线';
    case 16:
      return '超时未工作';
    default:
      return ststus;
  }
};
// 设备水位
export const waterStatus = ststus => {
  switch (ststus) {
    case 1:
      return '极低水位';
    case 2:
      return '低水位 ';
    case 3:
      return '中水位';
    case 4:
      return '高水位';
    default:
      return ststus;
  }
};

// 订单状态类型
export const orderStatus = ststus => {
  switch (ststus) {
    case 0:
      return '未支付';
    case 1:
      return '支付超时';
    case 2:
      return '已支付 ';
    case 3:
      return '已完成';
    case 4:
      return '申请退款';
    case 5:
      return '已退款';
    default:
      return ststus;
  }
};

// 支付方式
export const PayType = ststus => {
  switch (ststus) {
    case 0:
      return '其他';
    case 1:
      return '支付宝';
    case 11:
      return '支付宝';
    case 12:
      return '支付宝';
    case 13:
      return '支付宝';
    case 2:
      return '余额';
    case 3:
      return '微信 ';
    case 31:
      return '微信 ';
    case 32:
      return '微信 ';
    default:
      return '其他';
  }
};

// 交易类型
export const ApplyType = ststus => {
  switch (ststus) {
    case 1:
      return '收入 ';
    case 2:
      return '提现';
    case 3:
      return '支出 ';
    default:
      return ststus;
  }
};

// 人员管理禁用启用
export const memberIsLock = ststus => {
  switch (ststus) {
    case 0:
      return true;
    case 1:
      return false;
    default:
      return true;
  }
};

// 优惠券类型
export const CouponType = ststus => {
  switch (ststus) {
    case 1:
      return '补偿券 ';
    default:
      return ststus;
  }
};
