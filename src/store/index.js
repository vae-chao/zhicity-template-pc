import Vue from 'vue';
import Vuex from 'vuex';
import {userInfoServiceAPI} from '@/request/api.js';
import tokenUtil from "../utils/tokenUtil.js";
import router from "../router";
import {getPublicAndPrivateKey} from "../utils/PublicAndPrivateKey.js";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        isCollapse: false,  // 左侧菜单展开/收缩
        userInfo: {},
    },
    mutations: {
        // 左侧菜单展开/收缩
        setIsCollapse(state) {
            state.isCollapse = !(state.isCollapse);
        },
        // 设置用户信息
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo;
        },
    },
    actions: {
        async getUserInfo(context, callback) {
            let {publicKey, privateKey} = getPublicAndPrivateKey();
            if (!publicKey || !privateKey) {
                console.log("公钥或者私钥不存在");
                router.push({
                    name: 'Login',
                });
                return
            }

            let token = tokenUtil.getToken();
            if (token === undefined) {
                console.log("token不存在-用户信息");
                router.push({
                    name: 'Login',
                });
                return
            }
            try {
                let {data, message, code} = await userInfoServiceAPI({
                    userCode: tokenUtil.getUCode()
                });
                console.log('getUserInfo', data)
                context.commit("setUserInfo", data);

                callback && callback()
            } catch (e) {
                throw Error(e)
            }
        }
    },
    modules: {}
})
