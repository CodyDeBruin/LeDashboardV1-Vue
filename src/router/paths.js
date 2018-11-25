export default [

  {
    path: '*',
    meta: {
      public: true,
    },
    redirect: {
      path: '/404'
    }
  },  
  {
    path: '/login',
    component: () => import('../pages/loginpage.vue')
  }, 
  {
    path: '/',
    component: () => import('../pages/dashboard.vue'),
    meta: {requiresAuth: true} 
  },  
  {
    path: '/settings',
    component: () => import('../pages/settings.vue'),
    meta: {requiresAuth: true} 
  },  

];
