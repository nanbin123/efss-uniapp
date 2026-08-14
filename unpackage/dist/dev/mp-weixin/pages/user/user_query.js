"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      user: {}
    };
  },
  methods: {
    clearFilters() {
      this.user = {};
    },
    getImgUrl(image) {
      return this.BASEURL + image;
    }
  },
  onLoad(option) {
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $options.getImgUrl("static/image/user/user_name.png"),
    b: $data.user.userName,
    c: common_vendor.o(($event) => $data.user.userName = $event.detail.value),
    d: $options.getImgUrl("static/image/user/nick_name.png"),
    e: $data.user.nickName,
    f: common_vendor.o(($event) => $data.user.nickName = $event.detail.value),
    g: $options.getImgUrl("static/image/order/cusomer_phone.png"),
    h: $data.user.phonenumber,
    i: common_vendor.o(($event) => $data.user.phonenumber = $event.detail.value),
    j: common_vendor.o((...args) => $options.clearFilters && $options.clearFilters(...args)),
    k: common_vendor.o((...args) => _ctx.search && _ctx.search(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
