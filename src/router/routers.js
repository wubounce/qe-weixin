/* Layout */
import Layout from '../pages/layout/Layout';

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/pages/login/index'),
    hidden: true,
    name: 'login',
    meta: { title: '登录', noCache: true }
  },
  {
    path: '/register',
    component: () => import('@/pages/register/index'),
    hidden: true,
    name: 'register',
    meta: { title: '注册', noCache: true }
  },
  {
    path: '/forgotpwd',
    component: () => import('@/pages/forgotPwd/index'),
    hidden: true,
    name: 'forgotpwd',
    meta: { title: '忘记密码', noCache: true }
  },
  {
    path: '/alipay',
    component: () => import('@/pages/alipay/index'),
    hidden: true,
    name: 'alipay',
    meta: { title: '直付通代签约', noCache: true }
  },
  {
    path: '/changepwd',
    component: () => import('@/pages/changePwd/index'),
    hidden: true,
    name: 'changepwd',
    meta: { title: '修改密码', noCache: true }
  },
  {
    path: '/404',
    component: () => import('@/pages/404'),
    hidden: true,
    meta: { title: '404', noCache: true }
  },
]

export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    meta: { title: '首页', icon: 'shouye', },
    children: [
      {
        path: 'index',
        component: () => import('@/pages/home/index'),
        name: 'index',
        meta: { title: '首页', noCache: true, affix: true }
      }
    ]
  },
  {
    path: '/report',
    component: Layout,
    redirect: '/report/profit',
    name: 'report',
    meta: { title: '报表', icon: 'baobiao', noCache: true },
    children: [
      {
        path: 'profit',
        component: () => import('@/pages/report/profitReport/index'),
        name: 'profit',
        meta: { title: '营收报表', noCache: true }
      },
      {
        path: 'timeaverage',
        component: () => import('@/pages/report/timEaverage'),
        name: 'timeaverage',
        meta: { title: '时段平均报表', noCache: true }
      },
      {
        path: 'balanceLog',
        component: () => import('@/pages/report/balanceLog'),
        name: 'balanceLog',
        meta: { title: '流水明细', noCache: true }
      }
    ]
  },
  {
    path: '/shopmanagement',
    component: Layout,
    redirect: '/shopmanagement/list',
    name: 'shopmanagement',
    meta: { title: '店铺管理', icon: 'dianpuguanli', noCache: true },
    children: [
      {
        path: 'list',
        component: () => import('@/pages/shopManage/shopList/index'),
        name: 'shoplist',
        meta: { title: '店铺列表', noCache: true }
      }
    ]
  },
  {
    path: '/pointmanagement',
    component: Layout,
    redirect: '/pointmanagement/module',
    name: 'pointmanagement',
    meta: { title: '点位管理', icon: 'dianpuguanli', noCache: true },
    children: [
      {
        path: 'module',
        component: () => import('@/pages/pointManage/moduleList/index.vue'),
        name: 'modulelist',
        meta: { title: '点位模型列表', noCache: true }
      },
    ]
  },
  {
    path: '/devicemanagement',
    component: Layout,
    redirect: '/devicemanagement/list',
    name: 'devicemanagement',
    meta: { title: '设备管理', icon: 'shebeiguanli', noCache: true },
    children: [
      {
        path: 'list',
        component: () => import('@/pages/deviceManage/deviceList/index'),
        name: 'devicelist',
        meta: { title: '设备列表', noCache: true }
      },
      {
        path: 'batchStart',
        component: () => import('@/pages/deviceManage/deviceBatchStart/index'),
        name: 'batchStart',
        meta: { title: '设备批量启动', noCache: true }
      }
    ]
  },
  {
    path: '/ordermanagement',
    component: Layout,
    redirect: '/ordermanagement/list',
    name: 'ordermanagement',
    meta: { title: '订单管理', icon: 'dingdanguanli', noCache: true },
    children: [
      {
        path: 'list',
        component: () => import('@/pages/orderManage/orderList/index'),
        name: 'orderlist',
        meta: { title: '订单列表', noCache: true }
      }
    ]
  },
  {
    path: '/bathroommanagement',
    component: Layout,
    redirect: '/bathroommanagement/list',
    name: 'bathroommanagement',
    meta: { title: '浴室管理', icon: 'shower', noCache: true },
    children: [
      {
        path: 'list',
        component: () => import('@/pages/bathroomManage/bathroomList/index'),
        name: 'bathroomlist',
        meta: { title: '浴室列表', noCache: true }
      }
    ]
  },
  {
    path: '/marketingmanagement',
    component: Layout,
    redirect: '/marketingmanagement/discount',
    name: 'marketingmanagement',
    meta: { title: '营销管理', icon: 'yingxiaoguanli', noCache: true },
    children: [
      {
        path: 'discount',
        component: () => import('@/pages/marketingManage/timeLimitedDiscount/index'),
        name: 'discount',
        meta: { title: '限时优惠', noCache: true }
      },

      {
        path: 'couponrecord',
        component: () => import('@/pages/marketingManage/couponRecord/index'),
        name: 'couponrecord',
        meta: { title: '优惠券记录', noCache: true }
      },
      {
        path: 'goldmanage',
        component: () => import('@/pages/marketingManage/goldManage/index'),
        name: 'goldmanage',
        meta: { title: '金币管理', noCache: true }
      },
      {
        path: 'golduser',
        component: () => import('@/pages/marketingManage/goldUser/index'),
        name: 'golduser',
        meta: { title: '金币会员', noCache: true }
      }
      // {
      //   path: 'couponsent',
      //   component: () => import('@/pages/marketingManage/couponSent/index'),
      //   name: 'couponsent',
      //   meta: { title: '优惠券发放', noCache: true }
      // },
      // {
      //   path: 'couponactive',
      //   component: () => import('@/pages/marketingManage/couponActive/index'),
      //   name: 'couponactive',
      //   meta: { title: '优惠券活动', noCache: true }
      // },
    ]
  },
  {
    path: '/membermanagement',
    component: Layout,
    redirect: '/membermanagement/list',
    name: 'membermanagement',
    meta: { title: '人员管理', icon: 'renyuanguanli', noCache: true },
    children: [
      {
        path: 'list',
        component: () => import('@/pages/memberManage/memberList/index'),
        name: 'memberlist',
        meta: { title: '人员列表', noCache: true }
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/pages/404'),
    hidden: true,
    meta: { title: '404', noCache: true }
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true,
    meta: { title: '404', noCache: true }
  }
];
