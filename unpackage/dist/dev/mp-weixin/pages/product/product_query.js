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
    b: common_vendor.o(($event) => $data.productForm.productName = $event.detail.value, "52"),
    c: $data.productForm.type,
    d: common_vendor.o(($event) => $data.productForm.type = $event.detail.value, "5b"),
    e: $data.productForm.size,
    f: common_vendor.o(($event) => $data.productForm.size = $event.detail.value, "66"),
    g: $data.productForm.production,
    h: common_vendor.o(($event) => $data.productForm.production = $event.detail.value, "78"),
    i: $data.productForm.color,
    j: common_vendor.o(($event) => $data.productForm.color = $event.detail.value, "44"),
    k: $data.productForm.texture,
    l: common_vendor.o(($event) => $data.productForm.texture = $event.detail.value, "ef"),
    m: $data.productForm.stock,
    n: common_vendor.o(($event) => $data.productForm.stock = $event.detail.value, "a8"),
    o: $data.productForm.purchasePrice,
    p: common_vendor.o(($event) => $data.productForm.purchasePrice = $event.detail.value, "bf"),
    q: $data.productForm.retailPrice,
    r: common_vendor.o(($event) => $data.productForm.retailPrice = $event.detail.value, "8a"),
    s: common_vendor.o((...args) => $options.clearFilters && $options.clearFilters(...args), "6f"),
    t: common_vendor.o((...args) => $options.search && $options.search(...args), "a0")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1ea615b2"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/product/product_query.js.map
