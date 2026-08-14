"use strict";
const components_utils_request = require("../../components/utils/request.js");
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      receiptList: [],
      searchVal: "",
      searchReceipt: {}
    };
  },
  methods: {
    discount(item) {
      if (item.totalAmount == 0 || typeof item.totalAmount == "undefined") {
        return "";
      }
      if (item.actualmoney == 0 || typeof item.actualmoney == "undefined") {
        return "";
      }
      let discount = item.actualmoney / item.totalAmount * 100;
      return discount == 0 ? "" : discount * 100;
    },
    refreshOutboundList() {
      components_utils_request.post("receipt/selectReceipt", this.searchReceipt).then((res) => {
        this.$refs.paging.complete(res.rows);
      });
    },
    queryList(pageNo, pageSize) {
      this.searchReceipt.pageNum = pageNo;
      this.refreshOutboundList();
    },
    getImgUrl(image) {
      return this.BASEURL + image;
    }
  },
  watch: {
    searchVal(newVal, oldVal) {
      if (newVal != null) {
        this.searchReceipt = { "customerNameOrPhone": newVal };
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
    a: common_vendor.s("backgroundImage:url(" + $options.getImgUrl("static/image/search.png") + ")"),
    b: $data.searchVal,
    c: common_vendor.o(($event) => $data.searchVal = $event.detail.value),
    d: common_vendor.f($data.receiptList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.orderNumber),
        b: common_vendor.t(item.customerName),
        c: common_vendor.t(item.customerPhone),
        d: common_vendor.t(item.customerAddress),
        e: common_vendor.t(item.totalAmount),
        f: common_vendor.t($options.discount(item)),
        g: common_vendor.t(item.actualmoney),
        h: common_vendor.t(item.received),
        i: common_vendor.t(item.tobeReceived),
        j: common_vendor.t(item.amountCollected),
        k: "/pages/receipt/receipt_detail?id=" + item.id,
        l: item.id
      };
    }),
    e: common_vendor.sr("paging", "eb4910b4-0"),
    f: common_vendor.o($options.queryList),
    g: common_vendor.o(($event) => $data.receiptList = $event),
    h: common_vendor.p({
      modelValue: $data.receiptList
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-eb4910b4"]]);
wx.createPage(MiniProgramPage);
