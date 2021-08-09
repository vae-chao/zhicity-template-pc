let urlWebHttp = process.env.VUE_APP_WEB_HTTP_URL;
import vueRequest from "./vueRequest";

// 获取 私钥  公钥  客户端  签名 各种 key
export const getSignalDataAPI = params => vueRequest({
    apiUrl: `${urlWebHttp}/api/zpzOauthOauthClientDetails/trace`,
    params,
    type: 'POST',
    apiCode: 20000000,
    isUCode: true
});
// 用户名+密码登录  用户名+手机验证码
export const namePassLoginAPI = params => vueRequest({
    apiUrl: `${urlWebHttp}/api/oauth/token`,
    params,
    type: 'POST',
    apiCode: '10000001',  //组合成license的值
    isSendRsa: true,   //请求参数是否加密
    contentType: 'application/x-www-form-urlencoded'  //请求头
});
// 退出
export const logoutAPI = params => vueRequest({
    apiUrl: `${urlWebHttp}/api/authentication/logout`,
    params,
    type: 'POST',
    apiCode: '100003',
    isUCode: true,
    contentType: 'application/x-www-form-urlencoded'
});

export const userInfoServiceAPI = params => vueRequest({
    apiUrl: `${urlWebHttp}/api/zpzOauthUser/getUserInfo`,
    params,
    type: 'POST',
    apiCode: '1000004',
    isSendRsa: true,
    isUCode: true
});