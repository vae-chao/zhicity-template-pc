import {ElMessage} from 'element-ui';

export const errorTip = (info) => {
    ElMessage({
        type: "error",
        message: info,
        duration: 1800
    });
};

//禁止默认滚动条滚动，用于弹出窗    与 allowScroll 成对使用
export const forbidScroll = () => {
    document.body.style.overflow = 'hidden';
    document.getElementById("physical").style.overflow = "hidden";
    document.getElementById("app").style.overflow = "hidden";
};
//允许默认滚动条滚动，用于弹出窗     与 forbidScroll 成对使用
export const allowScroll = () => {
    document.body.style.overflow = '';
    document.getElementById("physical").style.overflow = "";
    document.getElementById("app").style.overflow = "";
};
// 获取分辨率dpi
export const jsGetDPI = () => {
    let arrDPI = new Array();
    if (window.screen.deviceXDPI != undefined) {
        arrDPI[0] = window.screen.deviceXDPI;
        arrDPI[1] = window.screen.deviceYDPI;
    } else {
        let tmpNode = document.createElement("DIV");
        tmpNode.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
        document.body.appendChild(tmpNode);
        arrDPI[0] = parseInt(tmpNode.offsetWidth);
        arrDPI[1] = parseInt(tmpNode.offsetHeight);
        tmpNode.parentNode.removeChild(tmpNode);
    }
    return arrDPI;
};
// 格式化数字  千分位  ==>  123,456.678
export const NumToLocalString = val => {
    return Number(val).toLocaleString('en-US');
};
// 保留两位小数  10.00
export const keepTwoDecimal = ({val, decimal = 2}) => {
    return parseFloat(val).toFixed(decimal);
};