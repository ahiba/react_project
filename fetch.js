  // fetch包装
  //import { domainHost } from "../service/config.js";
  import fetchBase from "isomorphic-fetch";
  import { toString } from "query-parse";
  import { mainRouter } from "../router";
  import { tokenKey, domainHost } from "../service/config";
  import { message } from "antd";
  import Cookie from "js-cookie";
  //import queryString from "qs";
  //const query = queryString.parse(window.location.search.split("?")[1]);
  let now = Date.now();
  function generateFetchId() {
    return `fetch-${now++}`;
  }
  
  export function cleanCookies() {
      Cookie.remove(tokenKey);
      Cookie.remove(tokenKey,{domain:".chubi.io",path:"/"});
      Cookie.remove("prompt");
     Cookie.remove("email");
  }
  
  /**
   * 建议所有的产品都为xhr设置一个统一入口， 方便加上统一逻辑.
   */
  
  function fetch_time(url, opt = {}) {
    /*
     * fetches a request like the normal fetch function 
     * but with a timeout argument added.
     */
    let timeout = opt.timeout || 30000;
    let timeout_err = {
        ok: false,
        status: 408
    };
    return new Promise(function(resolve, reject) {
        fetchBase(url, opt).then(resolve, reject);
        setTimeout(reject.bind(null, timeout_err), timeout);
    });
  }
  
  export default function fetch(url, opt = {}, cors = false) {
    const Token = Cookie.get(tokenKey) || null;
    opt.method = opt.method || "GET";
    // opt.credentials = "same-origin";
    opt._id = generateFetchId();
    // if (cors) {
    // opt.credentials = "include";
    //   opt.mode = "cors";
    // }
    opt.headers = {};
    opt.cache = "no-cache";
    if (opt.data) {
      if (/GET|HEAD/i.test(opt.method)) {
        url = `${url}?${toString(opt.data)}`;
      } else {
        if (opt.formData) {
          opt.body = opt.data;
        } else {
          opt.headers = { "Content-Type": "application/x-www-form-urlencoded" };
          opt.body = toString(opt.data);
        }
      }
    }
    if (Token) {
      opt.headers = Object.assign(opt.headers, {
        Token: Token
      });
    }
    return fetch_time(url, opt)
      .then(response => {
        if (response.status === 401) {
          if (!window.location.href.includes("/login")) {
            cleanCookies();
            window.location.href = domainHost + mainRouter + "/login";
            return "";
          }
        }
        if (!response.ok) {
          const error = new Error("Http Request Error");
          error.response = response;
          throw error;
        }
        if (opt.raw) {
          return response.text();
        } else {
          return response.json().then(json => {
            if (opt.rawJson) {
              return json;
            }
            return json || "";
          });
        }
      })
      .catch(err => {
        if (err && err.status == 408) {
          message.error("请求超时，请重试");
        } else {
          message.error("系统出现未知错误，请稍后");
        }
        //message.error("网络异常");
        return "";
      });
  }