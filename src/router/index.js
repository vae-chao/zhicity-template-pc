import Vue from 'vue';
import VueRouter from 'vue-router';
import layoutPage from '@/views/layoutPage/Index.vue';
import Login from '@/views/login/Index.vue';

Vue.use(VueRouter)

const routeMenuList = [
    {
        path: '/demo',
        name: 'DemoIndex',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/demo/Index.vue'),
        meta: {
            title: 'DEMO_INDEX'
        },
    }
];

const routes = [
    {
        path: '/',
        name: 'layoutPage',
        component: layoutPage,
        meta: {
            title: '首页'
        },
        /*redirect: {
            name: 'Home'
        },*/
        children: routeMenuList
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
            title: '账号登录'
        }
    },
]

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

export default router
