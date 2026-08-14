"use strict";
const common_vendor = require("../../common/vendor.js");
const components_utils_request = require("../../components/utils/request.js");
const DaTree = () => "../../components/da-tree/index.js";
const _sfc_main = {
  data() {
    return {
      user: {},
      roomTreeDataLift: [],
      roomTreeDataRight: [],
      defaultCheckedKeysValue: [],
      isEditable: true,
      checkedDisabled: true,
      userNameFocus: false,
      userPasswordFocus: false,
      userPhonenumberFocus: false
    };
  },
  components: {
    DaTree
  },
  methods: {
    editUserForm() {
      if (this.isEditable == true) {
        this.isEditable = false;
        this.roomTreeDataLift.forEach((child) => {
          child.disabled = false;
        });
        this.roomTreeDataRight.forEach((child) => {
          child.disabled = false;
        });
      } else if (this.isEditable == false) {
        this.editUser();
        this.isEditable = true;
        this.roomTreeDataLift.forEach((child) => {
          child.disabled = true;
        });
        this.roomTreeDataRight.forEach((child) => {
          child.disabled = true;
        });
      }
    },
    deleteUserForm() {
      if (this.isEditable == true) {
        common_vendor.index.showModal({
          title: "提示",
          content: "是否删除该员工信息",
          success: (res) => {
            if (res.confirm) {
              this.removeUserByIds();
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          }
        });
      } else if (this.isEditable == false) {
        this.isEditable = true;
        this.roomTreeDataLift.forEach((child) => {
          child.disabled = true;
        });
        this.roomTreeDataRight.forEach((child) => {
          child.disabled = true;
        });
      }
    },
    removeUserByIds() {
      components_utils_request.post("system/user/removeUserByIds", { "userIds": [this.user.userId] }).then((res) => {
        if (200 == res.code) {
          common_vendor.index.navigateBack({
            delta: 1,
            success: (event) => {
              prevPage.getList();
            }
          });
        }
      });
    },
    editUser() {
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
      components_utils_request.post("system/user/editUser", JSON.stringify(this.user), "application/json").then((res) => {
        let pages = getCurrentPages();
        if (pages.length > 1) {
          pages[pages.length - 2];
          if (200 == res.code) {
            common_vendor.index.hideLoading();
            common_vendor.index.showToast({
              title: "编辑用户成功",
              icon: "none",
              duration: 2e3
            });
          }
        }
      });
    },
    getImgUrl(image) {
      return this.BASEURL + image;
    }
  },
  onLoad(option) {
    this.user.userId = option.userId;
    components_utils_request.get("system/user/getUserByUserId", { "userId": this.user.userId }).then((res) => {
      if (200 == res.code) {
        this.user = res.data;
      }
    });
    components_utils_request.get("system/menu/userMenuTreeselect", { "userId": this.user.userId }).then((res) => {
      if (200 == res.code) {
        res.menus[0];
        let datePromise = res.menus[0].children;
        datePromise.forEach((child) => {
          child.disabled = true;
        });
        let treeDataLength = Math.round(datePromise.length / 2);
        this.roomTreeDataLift = datePromise.slice(0, treeDataLength);
        this.roomTreeDataRight = datePromise.slice(treeDataLength, datePromise.length);
        this.defaultCheckedKeysValue = res.checkedKeys;
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
    d: $data.isEditable,
    e: $data.user.userName,
    f: common_vendor.o(($event) => $data.user.userName = $event.detail.value),
    g: $options.getImgUrl("static/image/user/nick_name.png"),
    h: $data.userPasswordFocus,
    i: common_vendor.o(($event) => $data.userPasswordFocus = false),
    j: $data.isEditable,
    k: $data.user.nickName,
    l: common_vendor.o(($event) => $data.user.nickName = $event.detail.value),
    m: $options.getImgUrl("static/image/order/cusomer_phone.png"),
    n: $data.userPhonenumberFocus,
    o: common_vendor.o(($event) => $data.userPhonenumberFocus = false),
    p: $data.isEditable,
    q: $data.user.phonenumber,
    r: common_vendor.o(($event) => $data.user.phonenumber = $event.detail.value),
    s: $options.getImgUrl("static/image/user/permission.png"),
    t: common_vendor.sr("menuRefLeft", "e039a8b6-0"),
    v: common_vendor.o(_ctx.handleTreeChange),
    w: common_vendor.o(_ctx.handleExpandChange),
    x: common_vendor.p({
      data: $data.roomTreeDataLift,
      labelField: "label",
      valueField: "id",
      defaultExpandAll: true,
      showCheckbox: true,
      checkedDisabled: $data.checkedDisabled,
      defaultCheckedKeys: $data.defaultCheckedKeysValue
    }),
    y: common_vendor.sr("menuRefRight", "e039a8b6-1"),
    z: common_vendor.o(_ctx.handleTreeChange),
    A: common_vendor.o(_ctx.handleExpandChange),
    B: common_vendor.p({
      data: $data.roomTreeDataRight,
      labelField: "label",
      valueField: "id",
      defaultExpandAll: true,
      showCheckbox: true,
      checkedDisabled: $data.checkedDisabled,
      defaultCheckedKeys: $data.defaultCheckedKeysValue
    }),
    C: common_vendor.t($data.isEditable ? "删除" : "取消"),
    D: common_vendor.o(($event) => $options.deleteUserForm()),
    E: common_vendor.t($data.isEditable ? "编辑" : "保存"),
    F: common_vendor.o(($event) => $options.editUserForm())
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e039a8b6"]]);
wx.createPage(MiniProgramPage);
