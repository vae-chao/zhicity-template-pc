import JSEncrypt from '../assets/js/jsencrypt.js';

let qs = require('qs');

class Rsa {

    /**
     * Rsa加密对象
     * @param {string} publicKey  公钥
     * @param {string} privateKey 私钥
     * @param {string} signKey    签名
     * @memberof Rsa
     */
    constructor(publicKey, privateKey, signKey, timestamp) {
        this.publicKey = publicKey;
        this.privateKey = privateKey;
        this.signKey = signKey;
        this.timestamp = timestamp;
        this.encrypt = new JSEncrypt();
        this.encrypt.setPublicKey(publicKey);
        this.encrypt.setPrivateKey(privateKey);
        // this.test();
    }


    // 测试用例
    test() {
        // 加密 获取加密对象
        var testStr = JSON.stringify({
            "cityId": 0,
            "clientType": 1,
            "cityName": "北京市",
            "lat": "39.958645",
            "lon": "116.49034",
            "name": "",
            "orderBy": "",
            "pageNum": 1,
            "pageSize": 10,
            "type": 1
        });
        var enObj = this.encryptLong(testStr);
        var deStr = this.decryptLong(enObj.encryptStr);
        if (testStr === deStr) {
            console.log(enObj);
            console.log(deStr);
            console.log("test success")
        } else {
            console.log("fail");
        }
    }

    // 加密
    encryptLong(words) {
        var encryptStr = this.encrypt.encryptLong(words);
        var decryptStr = this.encrypt.decryptLong(encryptStr);
        if (words !== decryptStr) {
            return this.encryptLong(words)
        }
        var signatureObj = this.getSignature(JSON.parse(Base64.decode(words)));
        return {
            ...signatureObj,
            encryptStr: encryptStr
        };
    }

    // 获取签名
    getSignature(encryptStr) {
        var newData = {};
        Object.keys(encryptStr).sort().map(key => {
            if ((typeof encryptStr[key]) !== null && (typeof encryptStr[key]) === 'object') {
                newData[key] = JSON.stringify(encryptStr[key])
            } else {
                newData[key] = encryptStr[key]
            }
            // newData[key]=encryptStr[key]
        })

        encryptStr = qs.stringify(newData, {arrayFormat: 'repeat', encode: false});
        console.log('encryptStr=======>>>>', encryptStr)
        encryptStr = window.Base64.encode(encryptStr); // 解决有中文签名问题，

        var nonceStr = this.randomString(32);
        var md5Str = hex_md5(encryptStr + nonceStr + this.timestamp + this.signKey);
        return {
            md5Str,
            nonceStr
        };
    }

    // 获取server签名
    getServiceSignature(encryptStr, nonceStr, timestamp) {
        var newData = {};
        Object.keys(encryptStr).sort().map(key => {
            if ((typeof encryptStr[key]) !== null && (typeof encryptStr[key]) === 'object') {
                newData[key] = JSON.stringify(encryptStr[key])
            } else {
                newData[key] = encryptStr[key]
            }
        })
        encryptStr = qs.stringify(newData, {arrayFormat: 'repeat', encode: false});
        encryptStr = window.Base64.encode(encryptStr); // 解决有中文签名问题，

        var md5Str = hex_md5(encryptStr + nonceStr + timestamp + this.signKey);
        return md5Str.toLocaleUpperCase();
    }

    // 获取32位随机字符串
    randomString(len) {
        len = len || 32;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        var maxPos = $chars.length;
        var pwd = '';
        for (var i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }

    // 解密
    decryptLong(str) {
        return this.encrypt.decryptLong(str);
    }

}

export default Rsa
