"use strict";
const common_vendor = require("../../common/vendor.js");
const components_utils_request = require("../../components/utils/request.js");
const DaTree = () => "../../components/da-tree/index.js";
common_vendor.ref(null);
const _sfc_main = {
  data() {
    return {
      user: {},
      roomTreeDataLift: [],
      roomTreeDataRight: [],
      userNameFocus: false,
      userPasswordFocus: false,
      userPhonenumberFocus: false
    };
  },
  components: {
    DaTree
  },
  methods: {
    addUserForm() {
      if (!this.user.userName) {
        this.userNameFocus = true;
        common_vendor.index.showToast({
          title: "账号不能为空",
          icon: "none"
        });
        return;
      }
      if (!this.user.password) {
        this.userPasswordFocus = true;
        common_vendor.index.showToast({
          title: "密码不能为空",
          icon: "none"
        });
        return;
      }
      if (!this.user.phonenumber) {
        this.userPhonenumberFocus = true;
        common_vendor.index.showToast({
          title: "手机号不能为空",
          icon: "none"
        });
        return;
      }
      let leftCheckedKeys = this.$refs.menuRefLeft.getCheckedKeys();
      let rightCheckedKeys = this.$refs.menuRefRight.getCheckedKeys();
      if (leftCheckedKeys && !rightCheckedKeys) {
        this.user.menuIds = leftCheckedKeys;
      } else if (rightCheckedKeys && !leftCheckedKeys) {
        this.user.menuIds = rightCheckedKeys;
      }
      if (leftCheckedKeys && rightCheckedKeys) {
        Array.prototype.push.apply(leftCheckedKeys, rightCheckedKeys);
        this.user.menuIds = leftCheckedKeys;
      }
      components_utils_request.post("system/user/insertUser", JSON.stringify(this.user), "application/json").then((res) => {
        if (200 == res.code) {
          common_vendor.index.showToast({
            title: "添加员工成功",
            icon: "none",
            duration: 2e3
          });
          this.user = {};
        }
      });
    },
    getImgUrl(image) {
      return this.BASEURL + image;
    }
  },
  onLoad(option) {
    components_utils_request.get("system/menu/userTreeselect").then((res) => {
      if (200 == res.code) {
        let data = res.data[0];
        this.roomTreeData = data.children;
        let treeDataLength = Math.round(data.children.length / 2);
        this.roomTreeDataLift = data.children.slice(0, treeDataLength);
        this.roomTreeDataRight = data.children.slice(treeDataLength, data.children.length);
        common_vendor.index.hideLoading();
      }
    });
  }
};
if (!Array) {
  const _component_DaTree = common_vendor.resolveComponent("DaTree");
  _component_DaTree();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $options.getImgUrl("static/image/user/user_name.png"),
    b: $data.userNameFocus,
    c: common_vendor.o(($event) => $data.userNameFocus = false),
    d: $data.user.userName,
    e: common_vendor.o(($event) => $data.user.userName = $event.detail.value),
    f: $options.getImgUrl("static/image/user/user_name.png"),
    g: $data.userPasswordFocus,
    h: common_vendor.o(($event) => $data.userPasswordFocus = false),
    i: $data.user.password,
    j: common_vendor.o(($event) => $data.user.password = $event.detail.value),
    k: $options.getImgUrl("static/image/user/nick_name.png"),
    l: $data.user.nickName,
    m: common_vendor.o(($event) => $data.user.nickName = $event.detail.value),
    n: $options.getImgUrl("static/image/order/cusomer_phone.png"),
    o: $data.userPhonenumberFocus,
    p: common_vendor.o(($event) => $data.userPhonenumberFocus = false),
    q: $data.user.phonenumber,
    r: common_vendor.o(($event) => $data.user.phonenumber = $event.detail.value),
    s: $options.getImgUrl("static/image/user/permission.png"),
    t: common_vendor.sr("menuRefLeft", "a2c87eef-0"),
    v: common_vendor.o(_ctx.handleTreeChange),
    w: common_vendor.o(_ctx.handleExpandChange),
    x: common_vendor.p({
      data: $data.roomTreeDataLift,
      labelField: "label",
      valueField: "id",
      defaultExpandAll: true,
      showCheckbox: true
    }),
    y: common_vendor.sr("menuRefRight", "a2c87eef-1"),
    z: common_vendor.o(_ctx.handleTreeChange),
    A: common_vendor.o(_ctx.handleExpandChange),
    B: common_vendor.p({
      data: $data.roomTreeDataRight,
      labelField: "label",
      valueField: "id",
      defaultExpandAll: true,
      showCheckbox: true
    }),
    C: common_vendor.o(($event) => $options.addUserForm())
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a2c87eef"]]);
wx.createPage(MiniProgramPage);
