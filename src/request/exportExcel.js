import config from '@/rsaConfig.js';
import tokenUtil from '../utils/tokenUtil';

const qs = require('qs');
//获取加密算法
import RsaUtil from '../util/RsaUtil.js';
import {getPublicAndPrivateKey} from "../utils/PublicAndPrivateKey.js";

export default ({url, params, method, name = '汇总表', apiCode, isUCode, isSendRsa, contentType = "application/json;charset=utf-8"}) => {
    method = method.toUpperCase();
    let sendParams = null;
    /*if (method === 'POST') {
        sendParams = JSON.stringify(params)
    }*/
    /*let publicKey = localStorage.getItem('publicKey') || '';
    let privateKey = localStorage.getItem('privateKey') || '';
    let signKey = localStorage.getItem('signKey') || '';
    let clientKey = Base64.decode(localStorage.getItem('clientKey')) || '';*/
    let {publicKey, privateKey, signKey, clientKey} = getPublicAndPrivateKey();

    const timestamp = new Date().getTime() + '';
    const rsa = new RsaUtil(publicKey, privateKey, signKey, timestamp);
    let rsaObj = {};
    //请求参数是否加密
    if (isSendRsa) {
        rsaObj = rsa.encryptLong(Base64.encode(JSON.stringify(params)));
        sendParams = qs.stringify({
            data: rsaObj.encryptStr,
            noncestr: rsaObj.nonceStr,
            timestamp: timestamp
        }, {arrayFormat: 'repeat'});
        if (contentType === "application/json;charset=utf-8") {
            console.log('111')
            sendParams = {
                data: rsaObj.encryptStr,
                noncestr: rsaObj.nonceStr,
                timestamp: timestamp
            }
        }
    }
    console.log('sendParams', sendParams)
    //导出配置信息
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true)
    xhr.setRequestHeader("Content-type", contentType);
    xhr.setRequestHeader('license', Base64.encode(`${config.clientId}:${apiCode}:${isUCode === true ? tokenUtil.getUcode() : 'anyone'}`));
    xhr.setRequestHeader("Authorization", tokenUtil.getToken());
    xhr.setRequestHeader("X-Ca-Proxy-Signature", (rsaObj.md5Str && (rsaObj.md5Str).toUpperCase()) || "");
    xhr.responseType = "blob";
    xhr.onload = function () {
        // 请求完成
        if (this.status === 200) {
            if (this.response.size != 0) {
                console.log(this.response)
                // 返回200
                const blob = this.response;
                const reader = new FileReader();
                reader.readAsDataURL(blob); // 转换为base64，可以直接放入a表情href
                reader.onload = function (e) {
                    if (window.navigator.msSaveOrOpenBlob) {
                        //兼容ie
                        window.navigator.msSaveOrOpenBlob(blob, `${name}.xls`);
                    } else {
                        // 转换完成，创建一个a标签用于下载
                        const a = document.createElement('a');
                        a.download = `${name}.xls`;
                        a.href = e.target.result;
                        $("body").append(a); // 修复firefox中无法触发click
                        a.click();
                        $(a).remove();
                    }
                }
            } else {
                this.$message.error("导出失败")
            }

        }
    };
    xhr.send(JSON.stringify(sendParams))
};
