import jsCookie from 'js-cookie';
import rsaConfig from "../rsaConfig";
import {namePassLoginAPI} from '@/request/api.js';

let {clientId} = rsaConfig;

export default {
    setToken(accessToken, refreshToken, uCode, tokenType, expiresIn, refreshExpires) {
        expiresIn = new Date(new Date().getTime() + (expiresIn - 300) * 1000);

        jsCookie.set("token_" + clientId, accessToken, {expires: expiresIn});
        jsCookie.set("refresh_token_" + clientId, refreshToken, {expires: new Date(refreshExpires)});
        jsCookie.set("uCode_" + clientId, uCode, {expires: expiresIn});
        jsCookie.set("token_type_" + clientId, tokenType, {expires: expiresIn});
    },
    getToken() {
        const token = jsCookie.get("token_" + clientId);
        const tokenType = jsCookie.get("token_type_" + clientId);
        if (token !== undefined) {
            return tokenType + " " + token;
        }
        return undefined
    },
    getRefreshToken() {
        return jsCookie.get("refresh_token_" + clientId);
    },
    clearToken() {
        jsCookie.remove("token_" + clientId);
        jsCookie.remove("uCode_" + clientId);
        jsCookie.remove("token_type_" + clientId);
        jsCookie.remove("refresh_token_" + clientId);
    },
    getUCode() {
        const uCode = jsCookie.get("uCode_" + clientId);
        return uCode;
    },
    // 刷新登录
    async refreshToken() {
        try {
            let {data, code, message} = await namePassLoginAPI({
                grant_type: "refresh_token",
                scope: "all",
                auth_type: "password",
                refresh_token: this.getRefreshToken()
            })
            this.setToken(
                data.value,
                data.refreshToken.value || '',
                data.additionalInformation.ucode,
                data.tokenType,
                data.expiresIn,
                data.refreshToken.expiration
            );
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }
}
