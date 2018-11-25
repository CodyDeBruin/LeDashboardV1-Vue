import Vue from 'vue';
import Router from 'vue-router';
import paths from './paths';
import store from '../store'

Vue.use(Router);

const router = new Router({
  routes: paths,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.isLoggedIn) {
     next({
     path: '/login/',
     query: { redirect: to.fullPath }
     })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router;
