import axios from "axios";
import Vue from "vue";
import * as utils from "@/plugins/utils";
import router from "@/router";
import * as qs from "qs";
const KAOLA_API = axios.create({
  // baseURL: process.env.NODE_ENV === 'production' ?
  //     window.KAOLA_API_URL : '/'
  baseURL: window.KAOLA_API_URL
});
const API = axios.create({
  baseURL: window.API_URL
});

KAOLA_API.interceptors.request.use(function(config) {
  config.headers.common["Authorization"] = "";
  const userData = utils.getUserData();
  if (userData) {
    config.headers.common["Authorization"] = "Bearer " + userData.access_token;
  }
  config.headers.post["Content-Type"] = "application/json";
  return config;
});

KAOLA_API.interceptors.response.use(
  function(res) {
    if (res.config.url.indexOf("token") < 0) {
      inquiryToken(res);
    }

    const data = res.data;
    // 更新，修改，删除类接口对错误做处理
    if (data.success === false) {
      Vue.prototype.$Message.warning(data.error);
    }
    return res.data;
  },
  error => {
    if (error.response && error.response.status == 401) {
      const userData = utils.getUserData();

      if (userData.userType == 4 || userData.userType == 5) {
        if (router.history.current.name !== "login") {
          router.replace({
            path: "/login"
          });
          Vue.prototype.$Message.warning("登录已过期，请重新登录");
        }
      } else {
        window.open(KAOLA_API_LOGIN_URL, "_self");
      }

      return Promise.reject(error);
    }
    if (error.response && error.response.data.error_description) {
      Vue.prototype.$Message.warning(error.response.data.error_description);
    } else {
      Vue.prototype.$Message.warning("请求出错");
    }
    return Promise.reject(error);
  }
);

API.interceptors.request.use(function(config) {
  if (config.url === "/token") {
    config.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
  } else {
    const userData = utils.getUserData();
    if (userData) {
      config.headers.common["Authorization"] =
        "Bearer " + userData.access_token;
    }
    config.headers.post["Content-Type"] = "application/json";
  }
  return config;
});

API.interceptors.response.use(
  function(res) {
    const data = res.data;
    inquiryToken(res);
    if (data.ResponseCode !== undefined) {
      // 查询类
      if (data.ResponseCode !== 0) {
        Vue.prototype.$Message.warning(data.ResponMessage);
      }
    } else {
      // 更新，修改，删除类
      if (data.Success === false && data.State) {
        // 排除指定不需要提示的接口
        if (res.config.url.indexOf("/api/paper/UpdatePaperStatus") === -1&&res.config.url.indexOf("/api/PaperTemplate/UpdateTemplateStatus") === -1) {
          Vue.prototype.$Message.warning(data.State);
        }
      }
    }
    if (res.status === 204) {
      return { ...res.data, httpStatus: res.status };
    }
    return res.data;
  },
  error => {    
    const userData = utils.getUserData();
    if (error.response && error.response.status == 401) {
      if (userData.userType == 4 || userData.userType == 5) {
        if (router.history.current.name !== "login") {
          router.replace({
            path: "/login"
          });
          Vue.prototype.$Message.warning("登录已过期，请重新登录");
        }
        return Promise.reject(error);
      } else {
        window.open(KAOLA_API_LOGIN_URL, "_self");
      }
    }

    if (error.response && error.response.data.error_description) {
      Vue.prototype.$Message.warning(error.response.data.error_description);
    } else {
      Vue.prototype.$Message.warning("请求出错");
    }
    return Promise.reject(error);
  }
);

function inquiryToken(response) {
  var isRefreshed = localStorage.getItem("isRefreshed");
  var queueRefreshTokenID = localStorage.getItem("queueRefreshTokenID");
  const userData = utils.getUserData();
  if (userData) {
    var dateNow = new Date(response.headers.date);
    var expiresDate = new Date(userData[".expires"]);
    var issuedDate = new Date(userData[".issued"]);
    var willexpiresDate = new Date(
      dateNow.setMinutes(dateNow.getMinutes() + 5)
    );
    if (!queueRefreshTokenID) {
      var timeOut = expiresDate.getTime() - dateNow.getTime() - 1000 * 5;
      var id = setTimeout(refreshToken, timeOut, userData.refresh_token);
      localStorage.setItem("queueRefreshTokenID", id);
    }
    if (willexpiresDate > expiresDate) {
      if (isRefreshed == "0") {
        refreshToken(userData.refresh_token);
      }
    }
  }
}

function refreshToken(refreshToken, redirecturl) {
  localStorage.setItem("isRefreshed", "1");
  KAOLA_API.post(
    `/token`,
    qs.stringify({
      grant_type: "refresh_token",
      refresh_token: refreshToken
    })
  ).then(data => {
    if (data) {
      localStorage.setItem(
        "contentProduceSystemUserData",
        JSON.stringify(data)
      );
      localStorage.setItem("isRefreshed", "0");
      var queueRefreshTokenID = localStorage.getItem("queueRefreshTokenID");
      if (queueRefreshTokenID) {
        clearTimeout(queueRefreshTokenID);
      }
      localStorage.setItem("queueRefreshTokenID", "");
      if (arguments.length > 1) {
        console.log("redirecturl->" + redirecturl);
        window.open(redirecturl, "_self");
      }
    }
  });
}
export { KAOLA_API, API, refreshToken };
