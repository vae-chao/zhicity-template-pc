const siteName = '君晟合众（北京）科技有限公司-前端组';
let clientId = '';

switch (process.env.VUE_APP_MODE) {
    case 'pro':
        console.log('pro>>>>', process.env.VUE_APP_ENV)
        clientId = 'zcyygl_web';
        break;
    default:
        console.log('default>>>', process.env.VUE_APP_ENV)
        clientId = 'zcyygl_web';
        break;
}

module.exports = {
    siteName,
    clientId
}