"use strict";
const components_utils_request = require("../../components/utils/request.js");
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      userList: [],
      searchVal: "",
      searchUser: {}
    };
  },
  methods: {
    refreshUserList() {
      components_utils_request.get("system/user/selectPhoneUserList", this.searchUser).then((res) => {
        this.$refs.paging.complete(res.rows);
      });
    },
    queryList(pageNo, pageSize) {
      this.searchUser.pageNum = pageNo;
      this.refreshUserList();
    },
    getImgUrl(image) {
      return this.BASEURL + image;
    }
  },
  watch: {
    searchVal(newVal, oldVal) {
      if (newVal != null) {
        this.searchUser = { "nickNameOrPhonenumber": newVal };
        this.$refs.paging.reload();
      }
    }
  }
};
if (!Array) {
  const _easycom_z_paging2 = common_vendor.resolveComponent("z-paging");
  _easycom_z_paging2();
}
const _easycom_z_paging = () => "../../uni_modules/z-paging/components/z-paging/z-paging.js";
if (!Math) {
  _easycom_z_paging();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.s("background-image:url(" + $options.getImgUrl("static/image/search.png") + ")"),
    b: $data.searchVal,
    c: common_vendor.o(($event) => $data.searchVal = $event.detail.value),
    d: common_vendor.f($data.userList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.userName),
        b: common_vendor.t(item.nickName),
        c: common_vendor.t(item.phonenumber),
        d: common_vendor.t(item.createTime),
        e: "/pages/user/user_detail?userId=" + item.userId,
        f: item.userId
      };
    }),
    e: common_vendor.sr("paging", "9a754c08-0"),
    f: common_vendor.o($options.queryList),
    g: common_vendor.o(($event) => $data.userList = $event),
    h: common_vendor.p({
      modelValue: $data.userList
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-9a754c08"]]);
wx.createPage(MiniProgramPage);
