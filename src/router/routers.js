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
export default [
  {
    path: '/login',
    component: () => import('@/pages/login/index'),
    hidden: true,
    name: 'login'
  },
  {
    path: '/register',
    component: () => import('@/pages/register/index'),
    hidden: true,
    name: 'register'
  },
  {
    path: '/forgotpwd',
    component: () => import('@/pages/forgotPwd/index'),
    hidden: true,
    name: 'forgotpwd'
  },
  {
    path: '/userAgreement',
    component: () => import('@/pages/userAgreement/index'),
    hidden: true,
    name: 'userAgreement'
  },
  {
    path: '/alipay',
    component: () => import('@/pages/alipay/index'),
    hidden: true,
    name: 'alipay'
  },
  {
    path: '/changepwd',
    component: () => import('@/pages/changePwd/index'),
    hidden: true,
    name: 'changepwd'
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        component: () => import('@/pages/home/index'),
        name: 'index',
        meta: { title: '首页', icon: 'dashboard', noCache: true, affix: true }
      }
    ]
  },
  {
    path: '/report',
    component: Layout,
    redirect: '/report/profit',
    name: 'report',
    meta: { title: '报表', icon: 'dashboard', noCache: true },
    children: [
      {
        path: 'profit',
        component: () => import('@/pages/report/index'),
        name: 'profit',
        meta: { title: '营收报表', icon: 'dashboard', noCache: true }
      },
      {
        path: 'timeaverage',
        component: () => import('@/pages/report/timEaverage'),
        name: 'timeaverage',
        meta: { title: '时段平均报表', icon: 'dashboard', noCache: true }
      },
      {
        path: 'balanceLog',
        component: () => import('@/pages/report/balanceLog'),
        name: 'balanceLog',
        meta: { title: '流水明细', icon: 'dashboard', noCache: true }
      }
    ]
  },
  {
    path: '/shopmanagement',
    component: Layout,
    redirect: '/shopmanagement/list',
    name: 'shopmanagement',
    meta: { title: '店铺管理', icon: 'dashboard', noCache: true },
    children: [
      {
        path: 'list',
        component: () => import('@/pages/shop/index'),
        name: 'shoplist',
        meta: { title: '店铺列表', icon: 'dashboard', noCache: true }
      }
    ]
  },
  {
    path: '/devicemanagement',
    component: Layout,
    redirect: '/devicemanagement/list',
    name: 'devicemanagement',
    meta: { title: '设备管理', icon: 'dashboard', noCache: true },
    children: [
      {
        path: 'list',
        component: () => import('@/pages/device/index'),
        name: 'devicelist',
        meta: { title: '设备列表', icon: 'dashboard', noCache: true }
      },
      {
        path: 'batchStart',
        component: () => import('@/pages/device/batchStart'),
        name: 'batchStart',
        meta: { title: '设备批量启动', icon: 'dashboard', noCache: true }
      }
    ]
  },
  {
    path: '/ordermanagement',
    component: Layout,
    redirect: '/ordermanagement/list',
    name: 'ordermanagement',
    meta: { title: '订单管理', icon: 'dashboard', noCache: true },
    children: [
      {
        path: 'list',
        component: () => import('@/pages/order/index'),
        name: 'orderlist',
        meta: { title: '订单列表', icon: 'dashboard', noCache: true }
      }
    ]
  },
  {
    path: '/membermanagement',
    component: Layout,
    redirect: '/membermanagement/list',
    name: 'membermanagement',
    meta: { title: '人员管理', icon: 'dashboard', noCache: true },
    children: [
      {
        path: 'list',
        component: () => import('@/pages/member/index'),
        name: 'memberlist',
        meta: { title: '人员列表', icon: 'dashboard', noCache: true }
      }
    ]
  },
  {
    path: '/marketingmanagement',
    component: Layout,
    redirect: '/marketingmanagement/discount',
    name: 'marketingmanagement',
    meta: { title: '营销管理', icon: 'dashboard', noCache: true },
    children: [
      {
        path: 'discount',
        component: () => import('@/pages/marketing/tLimitedDiscount'),
        name: 'discount',
        meta: { title: '限时优惠', icon: 'dashboard', noCache: true }
      },
      {
        path: 'couponsent',
        component: () => import('@/pages/marketing/couponSent'),
        name: 'couponsent',
        meta: { title: '优惠券发放', icon: 'dashboard', noCache: true }
      },
      {
        path: 'couponactive',
        component: () => import('@/pages/marketing/couponActive'),
        name: 'couponactive',
        meta: { title: '优惠券活动', icon: 'dashboard', noCache: true }
      },
      {
        path: 'couponrecord',
        component: () => import('@/pages/marketing/couponRecord'),
        name: 'couponrecord',
        meta: { title: '优惠券记录', icon: 'dashboard', noCache: true }
      }
    ]
  },
  { path: '/404', component: () => import('@/pages/404'), hidden: true },
  { path: '*', redirect: '/404', hidden: true }
];
