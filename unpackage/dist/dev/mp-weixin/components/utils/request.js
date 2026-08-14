"use strict";
const common_vendor = require("../../common/vendor.js");
const BASEURL = "http://127.0.0.1:8080/";
function get(url, data = {}, contentType = "application/x-www-form-urlencoded;charset=UTF-8") {
  return request(url, data, "GET", contentType);
}
function post(url, data = {}, contentType = "application/x-www-form-urlencoded;charset=UTF-8") {
  return request(url, data, "POST", contentType);
}
function uploadFiles(url, files, formData = {}) {
  return uploadImg(url, files, formData);
}
function uploadImg(url, files, formData) {
  console.log("files", files);
  return new Promise(function(resolve, reject) {
    common_vendor.index.showLoading({
      title: "上传中"
    });
    common_vendor.index.uploadFile({
      url: BASEURL + url,
      filePath: files,
      name: "file",
      header: {
        "Authorization": common_vendor.index.getStorageSync("token"),
        "Accept": "application/json"
      },
      formData,
      success(res) {
        if (res.data) {
          let resData = JSON.parse(res.data);
          if (resData.code == 401 || resData.code == 403) {
            common_vendor.index.removeStorageSync("token");
            common_vendor.index.showToast({
              title: "登录失效，请重新登录",
              icon: "none"
            });
            setTimeout(() => {
              common_vendor.index.reLaunch({
                url: "/pages/login/login"
              });
            }, 1e3);
          }
          if (resData.code == 200) {
            resolve(resData);
          }
        } else {
          resolve(null);
          common_vendor.index.hideLoading();
        }
      }
    });
  });
}
function request(url, data = {}, method = "GET", contentType) {
  return new Promise(function(resolve, reject) {
    common_vendor.index.request({
      url: BASEURL + url,
      method,
      data,
      header: {
        "Authorization": common_vendor.index.getStorageSync("token"),
        "Accept": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": contentType
      },
      success(res) {
        if (res.data) {
          if (res.data.code == 401 || res.data.code == 403) {
            common_vendor.index.removeStorageSync("token");
            common_vendor.index.showToast({
              title: "登录失效，请重新登录",
              icon: "none"
            });
            setTimeout(() => {
              common_vendor.index.reLaunch({
                url: "/pages/login/login"
              });
            }, 1e3);
          }
          if (res.data.code == 500) {
            common_vendor.index.showToast({
              title: res.data.msg,
              icon: "none"
            });
          }
          if (res.data.code == 200) {
            resolve(res.data);
          }
        } else {
          resolve(null);
        }
      },
      fail(res) {
        common_vendor.index.showToast({
          title: "请求超时，请重试",
          icon: "none"
        });
      }
    });
  });
}
exports.get = get;
exports.post = post;
exports.uploadFiles = uploadFiles;
