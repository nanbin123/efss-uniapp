"use strict";
const store_modules_user = require("../../store/modules/user.js");
const common_vendor = require("../../common/vendor.js");
function hasPermi(binding) {
  const value = common_vendor.unref(binding.value || binding);
  const all_permission = "*:*:*";
  const userStore = store_modules_user.useUserStore();
  const permissions = userStore.permissions || [];
  if (!value || !Array.isArray(value) || value.length === 0) {
    throw new Error(`请设置操作权限标签值（必须是数组）`);
  }
  const permissionFlag = value;
  let a = permissions.some(
    (permission) => all_permission === permission || permissionFlag.includes(permission)
  );
  return a;
}
exports.hasPermi = hasPermi;
