import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => {
        return import(/* webpackChunkName: "home" */ './views/Home.vue');
      },
    },
    {
      path: '/quote/:id',
      name: 'single',
      component: () => {
        return import(/* webpackChunkName: "single" */ './views/Single.vue');
      },
      props: true,
    },
    {
      path: '/add',
      name: 'add',
      component: () => {
        return import(/* webpackChunkName: "add" */ './views/Add.vue');
      },
    },
  ],
});
