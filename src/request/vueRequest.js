import axios from 'axios';
import config from '@/rsaConfig.js';
import tokenUtil from '../utils/tokenUtil.js';

const qs = require('qs');

//获取加密算法
import RsaUtil from '../utils/RsaUtil.js';

let refreshTokenState = 0;

import {errorTip} from '../utils/index.js'
import {getPublicAndPrivateKey} from "../utils/PublicAndPrivateKey.js";

/**
 * 封装的axios和ajax 一般用axios足够。如果有jsonp需求可以使用zport的ajax;
 */
export default async (
    {
        apiUrl,
        params = {},
        type = 'GET',
        apiCode = "",   //license的值
        isSendRsa = false,   //请求参数是否加密
        isUCode = false,  //是否需要登录
        contentType = "application/json;charset=utf-8"   //请求头
    }
) => {
    type = type.toUpperCase();
    return new Promise((resolve, reject) => {
        let {publicKey, privateKey, signKey, clientKey} = getPublicAndPrivateKey();

        const timestamp = new Date().getTime() + '';
        const rsa = new RsaUtil(publicKey, privateKey, signKey, timestamp);
        let rsaParams;
        let rsaObj = {};
        //请求参数是否加密
        if (isSendRsa) {
            rsaObj = rsa.encryptLong(Base64.encode(JSON.stringify(params)));
            rsaParams = qs.stringify({
                data: rsaObj.encryptStr,
                noncestr: rsaObj.nonceStr,
                timestamp: timestamp
            }, {arrayFormat: 'repeat'});
            if (contentType === "application/json;charset=utf-8") {
                rsaParams = {
                    data: rsaObj.encryptStr,
                    noncestr: rsaObj.nonceStr,
                    timestamp: timestamp
                }
            }
        }
        let isLoginUrl = false;
        if (apiUrl.indexOf('/oauth/token') > -1) {
            isLoginUrl = true;
        }
        axios({
            method: type,
            url: apiUrl,
            headers: {
                'Authorization': isLoginUrl === true ? ("Basic " + Base64.encode(`${config.clientId}:${clientKey}`)) : (tokenUtil.getToken()),
                'Content-Type': contentType,
                'license': Base64.encode(`${config.clientId}:${apiCode}:${isUCode === true ? tokenUtil.getUCode() : 'anyone'}`),
                'X-Ca-Proxy-Signature': (rsaObj.md5Str && (rsaObj.md5Str).toUpperCase()) || ""
            },
            data: type === 'POST' ? (rsaParams || params) : '',
            params: type === 'GET' ? (rsaParams || params) : '',
            // timeout: appConfigs.timeout,
            /* 开启跨域cookie携带 */
            // credentials : true,
            // emulateHTTP: true,
            // emulateJSON:true
        })
            .then(res => {
                res = res.data;
                //刷新token
                if (res.code === 10035 || res.code === 10038 || res.code === 10039
                    || res.code === 10023 || res.code === 10026 || res.code === 10028) {
                    //refreshToken 存在的情况下
                    if (tokenUtil.getRefreshToken() !== undefined) {
                        if (refreshTokenState === 0) {
                            refreshTokenState++;
                            tokenUtil.refreshToken();
                        }
                    } else {
                        //不存在返回登录
                        tokenUtil.clearToken();
                        let url = window.location.href.split("#")[0];
                        window.location.href = `${url}#/login`;
                    }
                    return;
                }
                //账号异常登录情况
                if (res.code === 10037 || res.code === 10036) {
                    tokenUtil.clearToken();
                    let url = window.location.href.split("#")[0];
                    window.location.href = `${url}#/login`;
                    return;
                }
                //刷新token过期
                if (res.code === 10041) {
                    tokenUtil.clearToken();
                    let url = window.location.href.split("#")[0];
                    window.location.href = `${url}#/login`;
                    return;
                }
                //无权访问
                if (res.code === 10032 || res.code === 10024 || res.code === 10030 ||
                    res.code === 10029 || res.code === 10031 || res.code === 10040) {
                    errorTip("无权访问");
                    return;
                }

                if (res.de) { // 需要解密
                    if (!res.data) {
                        resolve(res)
                        return false;
                    }
                    let decryptData = rsa.decryptLong(res.data);
                    res.data = JSON.parse(Base64.decode(decryptData));

                    if (res.vsg) { // 需要验签
                        let sign = res.sign;
                        let signature = rsa.getServiceSignature(res.data, res.noncestr, res.timestamp);
                        if (sign === signature) {
                            resolve(res);
                        } else {
                            console.log("验签失败，数据可能存在错误...");
                            reject(res)
                        }
                    } else { // 不验签
                        resolve(res);
                    }
                } else { // 不需要解密
                    if (res.vsg) { // 需要验签
                        let sign = res.sign;
                        let signature = rsa.getServiceSignature(res.data, res.noncestr, res.timestamp);
                        if (sign === signature) {
                            resolve(res);
                        } else {
                            console.log("验签失败，数据可能存在错误...");
                        }
                    } else { // 不验签
                        resolve(res);
                    }
                }
            })
            .catch(err => {
                console.log('err.response', err.response)
                let errCode = err.response.data.code

                if (err.response.status == 504) {
                    errorTip("网络中断，请重新登录");
                    //不存在返回登录
                    tokenUtil.clearToken();
                    let url = window.location.href.split("#")[0];
                    window.location.href = `${url}#/login`;
                    return;
                }
                //刷新token
                if (errCode === 10035 || errCode === 10038 || errCode === 10039 ||
                    errCode === 10023 || errCode === 10026 || errCode === 10028) {
                    //refreshToken 存在的情况下
                    if (tokenUtil.getRefreshToken() !== undefined) {
                        if (refreshTokenState === 0) {
                            refreshTokenState++;
                            tokenUtil.refreshToken();
                        }
                    } else {
                        //不存在返回登录
                        tokenUtil.clearToken();
                        let url = window.location.href.split("#")[0];
                        window.location.href = `${url}#/login`;
                    }
                    return;
                }
                //账号异常登录情况
                if (errCode === 10037 || errCode === 10036) {
                    tokenUtil.clearToken();
                    let url = window.location.href.split("#")[0];
                    window.location.href = `${url}#/login`;
                    return;
                }
                //刷新token过期
                if (errCode === 10041) {
                    tokenUtil.clearToken();
                    let url = window.location.href.split("#")[0];
                    window.location.href = `${url}#/login`;
                    return;
                }
                //无权访问
                if (errCode === 10032 || errCode === 10024 || errCode === 10030 ||
                    errCode === 10029 || errCode === 10031 || errCode === 10040) {
                    errorTip("无权访问");
                    return;
                }
                errorTip("系统繁忙，请稍后再试");
                reject(err);
            });
    });
};
