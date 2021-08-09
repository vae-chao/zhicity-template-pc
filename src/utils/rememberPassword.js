export const randomString = (len = 10) => {
    let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    let maxPos = $chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

export default {
    saveAccount: ({username, password}) => {
        let oneStr = password.slice(0, 4);
        let twoStr = password.slice(4);
        window.localStorage.setItem('rememberAccount', JSON.stringify({
            u: Base64.encode(username),
            a: Base64.encode(oneStr + randomString()),
            b: Base64.encode(randomString((oneStr + randomString()).length)),
            c: Base64.encode(randomString() + twoStr),
            d: Base64.encode(randomString((randomString() + twoStr).length))
        }))
    },

    getAccount: () => {
        let userInfo = JSON.parse(window.localStorage.getItem('rememberAccount'));
        return {
            username: Base64.decode(userInfo.u),
            password: Base64.decode(userInfo.a).slice(0, 4) + Base64.decode(userInfo.c).slice(10)
        }
    },

    getStatus: () => {
        let userInfo = window.localStorage.getItem('rememberAccount');
        return !!userInfo
    },

    clearAccount: () => {
        window.localStorage.removeItem('rememberAccount')
    }
}
