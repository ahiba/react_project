export const initSize = () => { // 设置rem代码
    function setRem() {
      let viewWidth = document.documentElement.clientWidth;
      document.documentElement.style.fontSize = viewWidth / 13.66 + "px";
    }
    setRem();
    window.addEventListener("resize", setRem);
};
import("./util/fontsize").then(({ initSize }) => {
    initSize();
  });
export function IsPC() {
    let userAgentInfo = navigator.userAgent;
    let Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
    let flag = true;
    for (var v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false;
        break;
      }
    }
    return flag;
  }
  export function locationHref() {
    let pathArr = window.location.pathname.split("/") || [];
    let pathname = pathArr[pathArr.length - 1];
    let paramArr = window.location.href.split("?") || [];
    if (pathname == '' || pathname == 'reset' || pathname == 'login') {
      if (!IsPC()) {
        if (paramArr[1]) {
          window.location.href = mobileHost + "/" + pathname + "?" + paramArr[1];
        } else {
          window.location.href = mobileHost + "/" + pathname;
        }
      }
    }
  }
Date.prototype.Format = function (format) {
    var o = {
      "y+": this.getFullYear(),
      "M+": this.getMonth() + 1,
      "d+": this.getDate(),
      "h+": this.getHours(),
      "m+": this.getMinutes(),
      "s+": this.getSeconds()
    };
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    return format;
  };