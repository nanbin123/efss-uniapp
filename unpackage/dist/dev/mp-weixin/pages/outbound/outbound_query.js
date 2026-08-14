"use strict";
const common_vendor = require("../../common/vendor.js");
const store_modules_moreSearch = require("../../store/modules/moreSearch.js");
const cPicker = () => "../../components/c-picker/c-picker.js";
const _sfc_main = {
  components: {
    cPicker
  },
  data() {
    return {
      start_date: "",
      outboundForm: {}
    };
  },
  setup() {
    const moreSearchStore = store_modules_moreSearch.useMoreSearchStore();
    return {
      moreSearchStore
    };
  },
  methods: {
    search() {
      let order = this.outboundForm;
      this.moreSearchStore.addMoreSearch(order);
      let pages = getCurrentPages();
      if (pages.length > 1) {
        common_vendor.index.navigateBack({
          delta: 1,
          success: (event) => {
            pages[pages.length - 2].$vm.getOutbountList();
          }
        });
      }
    },
    clearFilters() {
      let that = this;
      Object.keys(this.outboundForm).forEach(function(key) {
        that.outboundForm[key] = "";
      });
      this.moreSearchStore.clearMoreSearchStore(this.outboundForm);
    },
    getImgUrl(image) {
      return this.BASEURL + image;
    },
    isEmpty(str) {
      return typeof str === "undefined" || "" === str;
    }
  },
  onShow() {
    this.outboundForm = this.moreSearchStore.moreSearch;
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.outboundForm.customerName,
    b: common_vendor.o(($event) => $data.outboundForm.customerName = $event.detail.value),
    c: $data.outboundForm.customerPhone,
    d: common_vendor.o(($event) => $data.outboundForm.customerPhone = $event.detail.value),
    e: common_vendor.o((...args) => $options.clearFilters && $options.clearFilters(...args)),
    f: common_vendor.o((...args) => $options.search && $options.search(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-29c4dc9e"]]);
wx.createPage(MiniProgramPage);
