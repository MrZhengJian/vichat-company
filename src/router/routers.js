import Main from '@/view/main'
import parentView from '@/components/parent-view'
import i18n from '@/locale'
/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 * }
 */
export default [
  
  {
    path: '/login',
    name: 'login',
    meta: {
      title: i18n.t('login'),
      hideInMenu: true,
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/register',
    name: 'register',
    meta: {
      title: i18n.t('register'),
      hideInMenu: true,
    },
    component: () => import('@/view/register/register.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: i18n.t('home'),
        },
        component: () => import('@/view/single-page/home/home.vue')
      }
    ]
  },
  {
    path: '/user',
    name: '_user',
    component: Main,
    meta: {
      icon: 'ios-key',
      title: i18n.t('_user'),
    },
    children: [
      {
        path: '/user',
        name: 'user',
        meta: {
          hideInMenu: false,
          icon: 'md-person',
          title: i18n.t('user'),
        },
        component: () => import('@/view/user-management/user-management.vue')
      },
      {
        path: '/org',
        name: 'org',
        meta: {
          hideInMenu: false,
          icon: 'md-people',
          title: i18n.t('org'),
        },
        component: () => import('@/view/org-management/org-management.vue')
      },
      {
        path: '/role',
        name: 'role',
        meta: {
          hideInMenu: false,
          icon: 'md-contacts',
          title: i18n.t('role'),
        },
        component: () => import('@/view/role-management/role.vue')
      }
    ]
  },
  {
    path: '/channel_management',
    name: 'channel_management',
    redirect: '/channel',
    component: Main,
    meta: {
      icon: 'md-flag',
      title: i18n.t('channel_management'),
    },
    children: [
      {
        path: '/channel',
        name: 'channel',
        meta: {
          title: i18n.t('channel'),
          icon: 'md-flag',
          hideInMenu: false,
        },
        component: () => import('@/view/channel-management/channel-management.vue')
      },
      {
        path: '/channel_details',
        name: 'channel_details',
        meta: {
          title: i18n.t('channel_details'),
          icon: 'md-flag',
          hideInMenu: true,
        },
        component: () => import('@/view/channel-management/channel-details.vue')
      },
    ]
  },
  {
    path: '/alarm_management',
    name: 'alarm_management',
    redirect: '/alarm',
    component: Main,
    meta: {
      icon: 'ios-warning',
      title: i18n.t('employee_type_List4'),
    },
    children: [
      {
        path: '/alarm',
        name: 'alarm',
        meta: {
          title: i18n.t('alarm'),
          icon: 'ios-warning',
          hideInMenu: false,
        },
        component: () => import('@/view/alarm-management/alarm-management.vue')
      },
    ]
  },
  // {
  //   path: '/fence_management',
  //   name: 'fence_management',
  //   component: Main,
  //   meta: {
  //     icon: 'ios-warning',
  //     title: i18n.t('fence_management'),
  //   },
  //   children: [
  //     {
  //       path: '/new_fence',
  //       name: 'new_fence',
  //       meta: {
  //         title: i18n.t('new_fence'),
  //         icon: 'ios-warning',
  //         hideInMenu: false,
  //       },
  //       component: () => import('@/view/fence-management/new-fence/new-fence.vue')
  //     },
  //     {
  //       path: '/district_fence',
  //       name: 'district_fence',
  //       meta: {
  //         title: i18n.t('district_fence'),
  //         icon: 'ios-warning',
  //         hideInMenu: false,
  //       },
  //       component: () => import('@/view/fence-management/district-fence/district-fence.vue')
  //     },
  //     {
  //       path: '/fence_alarm',
  //       name: 'fence_alarm',
  //       meta: {
  //         title: i18n.t('fence_alarm'),
  //         icon: 'ios-warning',
  //         hideInMenu: false,
  //       },
  //       component: () => import('@/view/fence-management/fence-alarm/fence-alarm.vue')
  //     },
  //   ]
  // },
  {
    path: '/_call_records',
    name: '_call_records',
    component: Main,
    meta: {
      icon: 'ios-call',
      title: i18n.t('_call_records'),
    },
    children: [
      {
        path: '/call_records',
        name: 'call_records',
        meta: {
          title: i18n.t('call_records'),
          icon: 'ios-call',
          hideInMenu: false,
        },
        component: () => import('@/view/call-records/call-records.vue')
      },
    ]
  },
  {
    path: '/rec_management',
    name: 'rec_management',
    component: Main,
    meta: {
      icon: 'ios-videocam',
      title: i18n.t('rec_management'),
    },
    
    children: [
      {
        path: '/rec',
        name: 'rec',
        meta: {
          title: i18n.t('rec'),
          icon: 'ios-videocam',
          hideInMenu: false,
        },
        component: () => import('@/view/rec-management/rec-management.vue')
      },
    ]
  },
  {
    path: '',
    name: 'amap',
    meta: {
      href: '/map/amap.html',
      icon: 'ios-map',
      title: 'Amap'
    }
  },
  {
    path: '',
    name: 'google_map',
    meta: {
      href: '/map/googleMap.html',
      icon: 'ios-navigate',
      title: 'Google Map'
    }
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
