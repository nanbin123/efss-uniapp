"use strict";
const common_vendor = require("../../common/vendor.js");
const components_utils_request = require("../../components/utils/request.js");
const _sfc_main = {
  data() {
    return {
      username: "admin",
      password: "admin123"
    };
  },
  methods: {
    watchRouter() {
      this.permissions = ["*:*:*"];
      components_utils_request.get("getInfo").then((res) => {
        common_vendor.index.hideLoading();
        common_vendor.index.setStorageSync("permissions", res.permissions);
      });
    },
    login() {
      let that = this;
      if (!this.username || !this.password) {
        common_vendor.index.showToast({
          title: "请输入账号密码",
          icon: "none"
        });
        return;
      }
      common_vendor.index.request({
        url: this.BASEURL + "login",
        method: "POST",
        data: {
          "username": this.username,
          "password": this.password
        },
        header: {
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/json;charset=UTF-8"
        },
        success(res) {
          if (200 == res.data.code) {
            common_vendor.index.setStorageSync("token", res.data.token);
            that.watchRouter();
            common_vendor.index.redirectTo({
              url: "/pages/index/index"
            });
          } else {
            common_vendor.index.showToast({
              title: res.data.msg,
              icon: "none"
            });
          }
        },
        fail(res) {
          common_vendor.index.showToast({
            title: "请求超时，请重试",
            icon: "none"
          });
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.username,
    b: common_vendor.o(($event) => $data.username = $event.detail.value),
    c: $data.password,
    d: common_vendor.o(($event) => $data.password = $event.detail.value),
    e: common_vendor.o((...args) => $options.login && $options.login(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e4e4508d"]]);
wx.createPage(MiniProgramPage);
