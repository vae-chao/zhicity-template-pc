const reg = /^1\d{10}$/; // 手机号
export const warnTip = {
    noEmpty: '此项不能为空',
    idCardNo: '请输入正确的身份证号',
    phoneNo: '请输入正确的手机号码',
}
export const checkReg = {
    //表单不能为空
    emptyBlur(rule, value, callback) {
        switch (value) {
            case (null):
                value = "";
                break;
            case (undefined):
                value = "";
                break;
            default:
                break;
        }
        if (value.toString().trim() == '') {
            callback(new Error(warnTip.noEmpty));
        } else {
            callback();
        }
    },
    //校验身份证
    checkIdNo(rule, value, callback) {
        value = value.toUpperCase();
        //城市
        const vCity = {
            11: "北京",
            12: "天津",
            13: "河北",
            14: "山西",
            15: "内蒙古",
            21: "辽宁",
            22: "吉林",
            23: "黑龙江",
            31: "上海",
            32: "江苏",
            33: "浙江",
            34: "安徽",
            35: "福建",
            36: "江西",
            37: "山东",
            41: "河南",
            42: "湖北",
            43: "湖南",
            44: "广东",
            45: "广西",
            46: "海南",
            50: "重庆",
            51: "四川",
            52: "贵州",
            53: "云南",
            54: "西藏",
            61: "陕西",
            62: "甘肃",
            63: "青海",
            64: "宁夏",
            65: "新疆",
            71: "台湾",
            81: "香港",
            82: "澳门",
            91: "国外"
        };

        //检查号码是否符合规范，包括长度，类型
        function isCardNo(card) {
            //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
            const reg = /(^\d{15}$)|(^\d{17}([\d|X])$)/; //(?i:x)
            if (reg.test(card) === false) {
                return false;
            }
            return true;
        }

        //取身份证前两位,校验省份
        function checkProvince(card) {
            const province = card.substr(0, 2);
            if (vCity[province] == undefined) {
                return false;
            }
            return true;
        }

        //检查生日是否正确
        function checkBirthday(card) {
            const len = card.length;
            //身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
            if (len == '15') {
                const re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
                const arr_data = card.match(re_fifteen);
                const year = arr_data[2];
                const month = arr_data[3];
                const day = arr_data[4];
                const birthday = new Date('19' + year + '/' + month + '/' + day);
                return verifyBirthday('19' + year, month, day, birthday);
            }
            //身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
            if (len == '18') {
                const re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
                const arr_data = card.match(re_eighteen);
                const year = arr_data[2];
                const month = arr_data[3];
                const day = arr_data[4];
                const birthday = new Date(year + '/' + month + '/' + day);
                return verifyBirthday(year, month, day, birthday);
            }
            return false;
        }

        //校验日期
        function verifyBirthday(year, month, day, birthday) {
            const now = new Date();
            const now_year = now.getFullYear();
            //年月日是否合理
            if (birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day) {
                //判断年份的范围（3岁到100岁之间)  //改成0-150岁之间
                const time = now_year - year;
                if (time >= 0 && time <= 150) {
                    return true;
                }
                return false;
            }
            return false;
        }

        //校验位的检测
        function checkParity(card) {
            //15位转18位
            card = changeFivteenToEighteen(card);
            const len = card.length;
            if (len == '18') {
                const arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                const arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                let cardTemp = 0,
                    i, valNum;
                for (i = 0; i < 17; i++) {
                    cardTemp += card.substr(i, 1) * arrInt[i];
                }
                valNum = arrCh[cardTemp % 11];
                if (valNum == card.substr(17, 1)) {
                    return true;
                }
                return false;
            }
            return false;
        }

        //15位转18位身份证号
        function changeFivteenToEighteen(card) {
            if (card.length == '15') {
                const arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                const arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                let cardTemp = 0,
                    i;
                card = card.substr(0, 6) + '19' + card.substr(6, card.length - 6);
                for (i = 0; i < 17; i++) {
                    cardTemp += card.substr(i, 1) * arrInt[i];
                }
                card += arrCh[cardTemp % 11];
                return card;
            }
            return card;
        }

        //调用之前全部判断函数；
        function checkCard() {
            const card = value;

            //校验长度，类型
            if (card === '' ||
                isCardNo(card) === false ||
                checkProvince(card) === false ||
                checkBirthday(card) === false ||
                checkParity(card) === false) {

                callback(new Error(warnTip.idCardNo));
                return false;
            }
            callback();
            return true;
        }
        checkCard();
    },
    //校验手机号-form表单用的
    checkPhone(rule, value, callback) {
        if (reg.test(value) === false) {
            callback(new Error(warnTip.phoneNo));
        } else {
            callback();
        }
    },
    // 其他时候的校验手机号
    checkPhoneNormal(phone) {
        phone = phone.trim();
        return reg.test(phone);
    },
    // 非必填的时候校验手机号
    checkPhoneSpe(rule, value, callback) {
        if (value) {
            if (reg.test(value) === false) {
                callback(new Error("联系方式输入有误"));
            } else {
                callback();
            }
        } else {
            callback();
        }
    },
    // 校验科室电话
    checkDepPhone(rule, value, callback) {
        if (value == "") {
            callback(new Error(warnTip.noEmpty));
        } else {
            const reg2 = /^([0-9]{3,4}-)?[0-9]{7,8}$/; //座机
            if (reg.test(value) === false && reg2.test(value) === false) {
                callback(new Error("科室电话输入有误"));
            } else {
                callback();
            }
        }
    },
    // 校验姓名
    checkName(rule, value, callback) {
        if (value == "") {
            callback(new Error(warnTip.noEmpty));
        } else {
            let reg = /^[\u4E00-\u9FA0]{2,5}$/;
            let reg2 = /^[A-Za-z]{1,30}$/;
            if (reg.test(value) === false && reg2.test(value) === false) {
                callback(new Error("姓名输入有误"));
            } else {
                callback();
            }
        }
    },
    // 最后一位必须是数字
    numberLast(rule, value, callback) {
        let reg = /^\d+(\.?\d{1,2})?$/;
        if (reg.test(value) === false) {
            console.log("校验失败");
            callback(new Error("格式错误，只能输入整数或者2位以内小数"));
        } else {
            if (value <= 0) {
                callback(new Error("气价必须大于0"));
            }
        }
        callback();
    }
}
