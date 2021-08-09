(function(window, document) {
    /*
    browserInfo=Chrome版本号70.0.3538.77  浏览器版本  (可以写手机版本号)
    name=我的项目  项目名   (必传 android ios 带标记 防止项目名冲突)
    message=Uncaught Error: 456  错误信息  (端错误信息)
    url=http://localhost:8080/pushError.js  错误路径  (android ios 直接写"" 空字符串)
    line=5  行   
    column=9  列  
    error=Error: 456  错误   (错误详细信息 可以把所有有关错误的信息存在这个字段里)
    localtion=    访问地址   (访问路径可以自定义)
    openTime=1542081028734   (这个不用传)
    whiteScreenTime=271  白屏时间 
    mobile=iPhone 用户型号
    readyTime=276  用户可操作时间
    width=1920  屏幕宽
    height=1080 屏幕高
    allloadTime=490  总下载时间
    nowTime=1542081029224   (可以不用写)
  */

    var LOCAL_MSG_NAME = 'errMsg';
    var LOCAL_TIME_NAME = 'errMsgTime';
    var DAY_TIME = 1000 * 60 * 60 * 24;
    var FIRST_NAME = 'firstMessage';
    var SECOND_NAME = 'secondMessage';
    var SERVER_URL = 'https://weberror.zhiscity.com/message/addMessage';
    var SWITCH_NAME = 'mySwitch';
    var SWITCH_ON = 'on';
    var SWITCH_OFF = 'off';
    var SWITCH_URL = 'https://weberror.zhiscity.com/latestVisitors/getSwitchState';
    /*
    Object opstions
    @pramas String name  项目名称
    @params String url上报地址
    @params int delay 延迟多少毫秒合并上报 default 1000
  */

    var erOnline = undefined;

    function ErOnline(options) {
        if (erOnline != undefined) {
            return erOnline;
        }
        if (options == '' || options == undefined) {
            console.log('erorr:init fail ErOnline(options) can not be null');
            return;
        }
        if (options.name == '' || options.name == undefined) {
            console.log('erorr:init fail opstions.name can not be null');
            return;
        }

        this.name = options.name;
        this.delay = options.delay || 3000;
        this.url = SERVER_URL;
        this.Queue = [];
        this.timer = null;
        this.clearLocalStorage();
        var localMap = this.getLocalStorage(LOCAL_MSG_NAME);
        this.map = localMap || {};
        erOnline = this;
        erOnline.init();
    }

    window.ErOnline = ErOnline;
    ErPro = ErOnline.prototype;

    ErPro.init = function() {
        var _this = this;
        _this.browserInfo = _this.getMyBrowser();
        ErPro.judgeSwitch(function (){
            _this.errorSwitch();
            _this.bindWindowError();
        })
    };

    ErPro.judgeSwitch = function(callback) {
        var mySwitch = this.getLocalStorage(SWITCH_NAME);
        if(mySwitch == undefined || mySwitch == null) {
            callback();
        }else{
            if(mySwitch === SWITCH_ON) { 
                callback();
            }
        }
    }

    ErPro.errorSwitch = function(callback){
        var _this = this;
        this.ajax({
            method: "get",
            url: SWITCH_URL,
            data: {
                name: encodeURIComponent(this.name)
            },
            async: true,
            success: function(res){
                if(res.code !== 1)
                    _this.setLocalStorage(SWITCH_NAME, SWITCH_OFF);
                else
                    _this.setLocalStorage(SWITCH_NAME, SWITCH_ON);

                if(callback)
                    callback();
            },
            error: function(res){
                _this.setLocalStorage(SWITCH_NAME, SWITCH_OFF);
                if(callback)
                    callback();
            }
        })
    };

    ErPro.logger = function(message, url) {
        if (message == '' || message == undefined) {
            console.log('erorr:logger fail message can not be null');
            return;
        }
        this.errorSend(message, url || '', 0, 0, 'vue');
    };

    ErPro.bindWindowError = function() {
        var _this = this;

        window.onerror = function(message, url, line, column, error) {
            _this.errorSend(
                message,
                url,
                line,
                column,
                error && error.stack ? error.stack : null
            );
        };

        if (window.Vue != undefined && window.Vue != null) {
            Vue.config.errorHandler = function(err, vm, info) {
                try {
                    var message = err.message;
                    var bStr = err.stack.match(/http.*.js:\d+:\d+/)[0];
                    var url = bStr.match(/http.*.js/)[0];
                    var cloumnArr = bStr
                        .replace(url, '')
                        .split(':');
                    var line = cloumnArr[1];
                    var column = cloumnArr[2];
                    var error = err.stack || '';
                    _this.errorSend(message, url, line, column, error);
                } catch (error) {
                    console.log(error);
                    _this.errorSend(message, '', 0, 0, err.stack);
                }
            };
        }
        if (window.axios != undefined && window.axios != null) {
            window.axios.interceptors.response.use(
                function(data) {
                    return data;
                },
                function(err) {
                    var config = err.config;
                    var msg = err.message;
                    var configMsg = 'url:' + JSON.stringify(config.url) + ',' +
                                'params:' + JSON.stringify(config.params)  + ',' +
                                'data:' + JSON.stringify(config.data) + ',' +
                                'method:' + config.method + ',' +
                                'headers:' + JSON.stringify(config.headers);
                    if(err.message.indexOf('status code 403') === -1)
                        _this.errorSend(msg, '', 0, 0, configMsg);
                    return Promise.resolve(err);
                }
            );
        }
    };

    ErPro.errorSend = function(message, url, line, column, error) {
        if (
            typeof message === 'string' &&
            message.indexOf('Script error.') != -1
        ) {
            console.log('Script error.');
            return;
        }
        if (
            typeof message !== 'string' &&
            Object.prototype.toString.call(message) === '[object Object]'
        ) {
            message = JSON.stringify(message);
        }
        if (message.stack !== undefined) {
            error = message.stack;
        }
        console.dir(message);
        var _this = this;
        var ErrorMsg = {
            message: message,
            url: url || '',
            viewUrl: window.location.href,
            line: line || 0,
            column: column || 0,
            error: error || '',
            repeat: 0
        };
        this.setMapMsg(ErrorMsg);

        clearTimeout(this.timer);
        this.timer = setTimeout(function() {
            ErPro.judgeSwitch(function(){
                _this.errorQueuePush();
                _this.clearLocalStorage();
                _this.setLocalStorage(LOCAL_MSG_NAME, _this.map);
    
                for (var i = 0; i < _this.Queue.length; i++) {
                    (function(i) {
                        _this.creaImage(i);
                    })(i);
                }
                _this.clearQueue();
            });
        }, _this.delay);
    };

    ErPro.setMapMsg = function(ErrorMsg) {
        var m = this.map;
        if (this.map[ErrorMsg.message] == undefined) {
            this.map[ErrorMsg.message] = ErrorMsg;
        } else {
            this.map[ErrorMsg.message].repeat++;
        }
    };

    ErPro.errorQueuePush = function() {
        var m = this.map;
        for (var item in m) {
            if (m[item].upload == undefined) {
                m[item].upload = true;
                this.Queue.push(m[item]);
            }
        }
    };

    ErPro.clearQueue = function() {
        this.Queue = [];
    };

    ErPro.creaImage = function(index) {
        var win = window;
        var n =
            'jsErrorImage' +
            (+new Date() + 't' + Math.floor(Math.random() * 1000));
        var img = (win[n] = new Image());
        img.src = this.getUrlParam(index);
    };

    ErPro.getUrlParam = function(index) {
        var ErrorMsg = this.Queue[index];
        var browserInfo = this.browserInfo;
        var loginInfo = this.logInfo;
        var id = this.id;
        var name = this.name;
        var url = '?browserInfo=' + encodeURIComponent(browserInfo) + '&';
        url +=
            'id=' +
            encodeURIComponent(id) +
            '&name=' +
            encodeURIComponent(name) +
            '&';
        for (var item in ErrorMsg) {
            url += item + '=' + encodeURIComponent(ErrorMsg[item]) + '&';
        }
        for (var item in loginInfo) {
            url += item + '=' + encodeURIComponent(loginInfo[item]) + '&';
        }
        return this.url + url;
    };

    ErPro.setLocalStorage = function(key, data) {
        window.localStorage.setItem(key, JSON.stringify(data));
    };

    ErPro.clearLocalStorage = function() {
        var errTime = ErPro.getLocalStorage(LOCAL_TIME_NAME);
        if (errTime == undefined || errTime == null) {
            ErPro.setLocalStorage(
                LOCAL_TIME_NAME,
                new Date().getTime() + DAY_TIME
            );
        } else {
            var nowTime = new Date().getTime();
            if (nowTime > errTime) {
                window.localStorage.clear();
                ErPro.setLocalStorage(
                    LOCAL_TIME_NAME,
                    new Date().getTime() + DAY_TIME
                );
            }
        }
    };

    ErPro.getLocalStorage = function(key) {
        return JSON.parse(window.localStorage.getItem(key));
    };

    ErPro.getMyBrowser = function() {
        var strStart = 0,
            temp,
            broName,
            strStop;
        var userAgent = window.navigator.userAgent; // 取得浏览器的userAgent字符串

        if (userAgent.indexOf('Firefox') != -1) {
            /* broName = 'FireFox浏览器'; */
            strStart = userAgent.indexOf('Firefox');
            temp = userAgent.substring(strStart);
            broName = temp.replace('/', '版本号');
        }
        // Edge
        if (userAgent.indexOf('Edge') != -1) {
            /* broName = 'Edge浏览器'; */
            strStart = userAgent.indexOf('Edge');
            temp = userAgent.substring(strStart);
            broName = temp.replace('/', '版本号');
        }
        // IE浏览器
        if (userAgent.indexOf('NET') != -1 && userAgent.indexOf('rv') != -1) {
            /* broName = 'IE浏览器'; */
            strStart = userAgent.indexOf('rv');
            strStop = userAgent.indexOf(')');
            temp = userAgent.substring(strStart, strStop);
            broName = temp.replace('rv', 'IE').replace(':', '版本号');
        }
        // 360极速模式可以区分360安全浏览器和360极速浏览器
        if (
            userAgent.indexOf('WOW') != -1 &&
            userAgent.indexOf('NET') < 0 &&
            userAgent.indexOf('Firefox') < 0
        ) {
            if (navigator.javaEnabled()) {
                broName = '360安全浏览器-极速模式';
            } else {
                broName = '360极速浏览器-极速模式';
            }
        }
        // 360兼容
        if (
            userAgent.indexOf('WOW') != -1 &&
            userAgent.indexOf('NET') != -1 &&
            userAgent.indexOf('MSIE') != -1 &&
            userAgent.indexOf('rv') < 0
        ) {
            broName = '360兼容模式';
        }
        // Chrome浏览器
        if (userAgent.indexOf('WOW') < 0 && userAgent.indexOf('Edge') < 0) {
            /* broName = 'Chrome浏览器'; */
            strStart = userAgent.indexOf('Chrome');
            strStop = userAgent.indexOf(' Safari');
            temp = userAgent.substring(strStart, strStop);
            broName = temp.replace('/', '版本号');
        }
        return broName;
    };

    /* 统计性能 */
    ErPro.logInfo = {}; // 统计页面加载时间
    ErPro.logInfo.openTime = performance.timing.navigationStart;
    ErPro.logInfo.whiteScreenTime = +new Date() - ErPro.logInfo.openTime;
    document.addEventListener('DOMContentLoaded', function(event) {
        ErPro.logInfo.readyTime = +new Date() - ErPro.logInfo.openTime;
        ErPro.logInfo.width = screen.width;
        ErPro.logInfo.height = screen.height;
    });
    window.onload = function() {
        ErPro.logInfo.allloadTime = +new Date() - ErPro.logInfo.openTime;
        ErPro.logInfo.nowTime = new Date().getTime();
        ErPro.logInfo.localtion = window.location.href;
        var timname = {
            whiteScreenTime: '白屏时间',
            readyTime: '用户可操作时间',
            allloadTime: '总下载时间',
            mobile: '使用设备',
            nowTime: '时间'
        };
        var logStr = '';
        for (var i in timname) {
            console.warn(timname[i] + ':' + ErPro.logInfo[i] + 'ms');
            if (i === 'mobile') {
                logStr += '&' + i + '=' + ErPro.logInfo[i];
            } else {
                logStr += '&' + i + '=' + ErPro.logInfo[i];
            }
        }

        if(erOnline === undefined)
            return;

        var firstLog = ErPro.getLocalStorage(FIRST_NAME);
        if (firstLog == undefined || firstLog == null) {
            ErPro.setLocalStorage(FIRST_NAME, 'true');
            ErPro.logger.call(erOnline, FIRST_NAME);
        } else {
            ErPro.logger.call(erOnline, SECOND_NAME);
        }
        
    };

    /* 统计型号 */
    ErPro.logInfo.mobile = mobileType();

    function mobileType() {
        var u = navigator.userAgent,
            app = navigator.appVersion;
        var type = {
            // 移动终端浏览器版本信息
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
            iPad: u.indexOf('iPad') > -1, // 是否iPad
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, // 是否为iPhone或者QQHD浏览器
            trident: u.indexOf('Trident') > -1, // IE内核
            presto: u.indexOf('Presto') > -1, // opera内核
            webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, // 火狐内核
            mobile:
                !!u.match(/AppleWebKit.*Mobile/i) ||
                !!u.match(
                    /MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/
                ), // 是否为移动终端
            webApp: u.indexOf('Safari') == -1 // 是否web应该程序，没有头部与底部
        };
        var lists = Object.keys(type);
        for (var i = 0; i < lists.length; i++) {
            if (type[lists[i]]) {
                return lists[i];
            }
        }
    }

    function params(obj) {
        var arr = [];
        for(var i in obj) {
            var str = i + "=" + obj[i];
            arr.push(str);
        }
        return arr.join("&");
    }
    
    // ajax
    ErPro.ajax = function(obj) {
        var xhr;
        if(window.XMLHttpRequest){
            xhr = new XMLHttpRequest();
        }else if(window.ActiveXObject){
            xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }else{
            alert('您的浏览器不支持ajax');
        }
        obj.data = params(obj.data);

        //get请求把参数添加到url后面
        if(/get/i.test(obj.method)) {
            obj.url += obj.data.length > 0 ? ("?" + obj.data) : "";
        }

        xhr.open(obj.method, obj.url, obj.async);
        if(/get/i.test(obj.mothod)) {
            xhr.send(null);
        } else {
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(obj.data);
        }

        if(obj.async) {
            xhr.onreadystatechange = function() {
                if(xhr.readyState == 4) {
                    callback();
                }
            }
        } else {
            callback(); //同步
        }

        function callback() {
            if(xhr.status == 200) {
                obj.success(JSON.parse(xhr.responseText));
            } else {
                obj.error(xhr.status);
            }

        }
    }

})(window, document);
