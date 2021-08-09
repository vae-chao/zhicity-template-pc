import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
// ui 文件
import ElementUi from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// 动画样式文件
import './assets/css/animate.min.css';

// 监控平台 js;
import './assets/js/errorOnline.js';

// 初始化name 是项目名称 String类型，自定义或者使用 title默认确保绝对唯一;
import rsaConfig from './rsaConfig';

// 如果不需要直接注释;
if (process.env.NODE_ENV === 'production') {
    window.Vue = Vue;
    window.erOnline = new window.ErOnline({
        name: rsaConfig.siteName
    });
}

// 路由处理
router.afterEach((to, from, next) => {
    console.log(to.meta)
    document.title = to.meta.title ? to.meta.title : rsaConfig.siteName
});

Vue.config.productionTip = false;
Vue.use(ElementUi);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
