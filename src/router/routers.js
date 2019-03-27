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
    path: '/tencentAlipay',
    component: () => import('@/pages/tencentAlipay/index'),
    hidden: true,
    name: 'tencentAlipay'
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
        component: () => import('@/pages/report/index'),
        name: 'balanceLog',
        meta: { title: '流水明细', icon: 'dashboard', noCache: true }
      }
    ]
  },
  {
    path: '/shopmanagement',
    component: Layout,
    redirect: '/shopmanagement/list',
    children: [
      {
        path: 'list',
        component: () => import('@/pages/shop/index'),
        name: 'shoplist',
        meta: { title: '店铺列表', icon: 'dashboard', noCache: true }
      }
    ]
  },
  { path: '/404', component: () => import('@/pages/404'), hidden: true },
  { path: '*', redirect: '/404', hidden: true }
];
