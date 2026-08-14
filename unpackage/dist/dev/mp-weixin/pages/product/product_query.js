"use strict";
const common_vendor = require("../../common/vendor.js");
const store_modules_moreSearch = require("../../store/modules/moreSearch.js");
const _sfc_main = {
  data() {
    return {
      productForm: {
        productName: "",
        type: "",
        size: "",
        production: "",
        productType: "",
        color: "",
        texture: "",
        stock: "",
        retailPrice: "",
        purchasePrice: "",
        productNameOrType: ""
      }
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
      let product = this.productForm;
      this.moreSearchStore.addMoreSearch(product);
      let pages = getCurrentPages();
      if (pages.length > 1) {
        common_vendor.index.navigateBack({
          delta: 1,
          success: (event) => {
            pages[pages.length - 2].$vm.getProductList();
          }
        });
      }
    },
    clearFilters() {
      let _this = this;
      Object.keys(this.productForm).forEach(function(key) {
        _this.productForm[key] = "";
      });
    },
    getImgUrl(image) {
      return this.BASEURL + image;
    },
    isEmpty(str) {
      return typeof str === "undefined" || "" === str;
    }
  },
  onShow() {
    this.productForm = this.moreSearchStore.moreSearch;
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.productForm.productName,
    b: common_vendor.o(($event) => $data.productForm.productName = $event.detail.value),
    c: $data.productForm.type,
    d: common_vendor.o(($event) => $data.productForm.type = $event.detail.value),
    e: $data.productForm.size,
    f: common_vendor.o(($event) => $data.productForm.size = $event.detail.value),
    g: $data.productForm.production,
    h: common_vendor.o(($event) => $data.productForm.production = $event.detail.value),
    i: $data.productForm.color,
    j: common_vendor.o(($event) => $data.productForm.color = $event.detail.value),
    k: $data.productForm.texture,
    l: common_vendor.o(($event) => $data.productForm.texture = $event.detail.value),
    m: $data.productForm.stock,
    n: common_vendor.o(($event) => $data.productForm.stock = $event.detail.value),
    o: $data.productForm.purchasePrice,
    p: common_vendor.o(($event) => $data.productForm.purchasePrice = $event.detail.value),
    q: $data.productForm.retailPrice,
    r: common_vendor.o(($event) => $data.productForm.retailPrice = $event.detail.value),
    s: common_vendor.o((...args) => $options.clearFilters && $options.clearFilters(...args)),
    t: common_vendor.o((...args) => $options.search && $options.search(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1ea615b2"]]);
wx.createPage(MiniProgramPage);
