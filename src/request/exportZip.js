import config from '@/rsaConfig.js';
import tokenUtil from '../utils/tokenUtil';

export default ({url, params, method, customName = '汇总表'}, expandedName = '.zip') => {
    method = method.toUpperCase();
    let sendParams = null;
    if (method === 'POST') {
        sendParams = JSON.stringify(params)
    }
    //导出配置信息
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('license', Base64.encode(`${config.clientId}:${params.apiCode}:${params.isUCode === true ? tokenUtil.getUcode() : 'anyone'}`));
    xhr.setRequestHeader("Authorization", tokenUtil.getToken());
    xhr.responseType = "blob";
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var name = xhr.getResponseHeader('Content-disposition') || customName;
            var filename = name.substring(20, name.length);
            var blob = new Blob([xhr.response]);
            if (window.navigator.msSaveOrOpenBlob) {
                //兼容ie
                window.navigator.msSaveOrOpenBlob(blob, filename);
            } else {
                let link = document.createElement('a');
                let url = URL.createObjectURL(blob);
                link.style.display = 'none';
                link.href = url;
                link.download = window.decodeURIComponent(filename);
                document.body.appendChild(link);
                link.click();
            }
        }
    }
    if (method === 'POST') {
        xhr.send(sendParams)
    } else {
        xhr.send()
    }
};
