"use strict";
const common_vendor = require("../../common/vendor.js");
const useTransferOrderStore = common_vendor.defineStore("transferOrderStore", {
  state: () => ({
    data: {
      customer: { customerProducts: [] }
    }
  }),
  actions: {
    addCustomer(customer) {
      this.customer = customer;
    }
  }
});
exports.useTransferOrderStore = useTransferOrderStore;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/store/modules/transfer_order.js.map
