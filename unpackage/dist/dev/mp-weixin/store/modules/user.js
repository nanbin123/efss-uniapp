"use strict";
const common_vendor = require("../../common/vendor.js");
const useUserStore = common_vendor.defineStore("userStore", {
  state: () => ({
    data: {
      permissions: []
    }
  }),
  actions: {
    addPermissions(permissions) {
      this.permissions = permissions;
    }
  }
});
exports.useUserStore = useUserStore;
