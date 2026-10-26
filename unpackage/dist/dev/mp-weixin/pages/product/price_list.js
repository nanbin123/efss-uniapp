"use strict";
const common_vendor = require("../../common/vendor.js");
const components_utils_request = require("../../components/utils/request.js");
const store_modules_moreSearch = require("../../store/modules/moreSearch.js");
const _sfc_main = {
  data() {
    return {
      productList: [],
      pageNum: 1,
      // 当前页
      pageSize: 10,
      // 每页条数				
      searchVal: "",
      searchProduct: {}
    };
  },
  setup() {
    const moreSearchStore = store_modules_moreSearch.useMoreSearchStore();
    return { moreSearchStore };
  },
  methods: {
    async previewImage(item) {
      const res = await components_utils_request.post("product/selectPriceById", { id: item.id });
      if (!res || res.code !== 200 || !res.data)
        return;
      item.productImages = res.data.productImages;
      const images = Array.isArray(item.productImages) ? item.productImages : [];
      const urls = images.filter((img) => img && typeof img.productUrl === "string" && img.productUrl.trim()).map((img) => {
        const url = img.productUrl.trim();
        return /^https?:\/\//i.test(url) ? url : this.BASEURL.replace(/\/$/, "") + "/" + url.replace(/^\//, "");
      });
      if (!urls.length) {
        common_vendor.index.showToast({ title: "暂无更多图片", icon: "none" });
        return;
      }
      common_vendor.index.previewImage({ current: urls[0], urls, indicator: "number", loop: true });
    },
    getProductList() {
      let product = this.moreSearchStore.moreSearch;
      this.searchProduct = product;
      this.$refs.paging.reload();
    },
    async refreshProductList() {
      const res = await components_utils_request.post("product/selectListProduct", this.searchProduct);
      await this.$refs.paging.complete(res.rows);
      await this.$nextTick();
      const ids = new Set(res.rows.map((item) => item.id));
      const items = this.productList.filter((item) => ids.has(item.id));
      await this.loadProductImages(items);
    },
    async loadProductImages(items) {
      let nextIndex = 0;
      const loadNext = async () => {
        while (nextIndex < items.length) {
          const item = items[nextIndex++];
          try {
            const res = await components_utils_request.post("product/selectPriceById", { id: item.id });
            if (res && res.code == 200 && res.data) {
              item.productImages = Array.isArray(res.data.productImages) ? res.data.productImages : [];
            }
          } catch (error) {
          }
        }
      };
      await Promise.all(Array.from({ length: Math.min(4, items.length) }, loadNext));
    },
    queryList(pageNo, pageSize) {
      this.searchProduct.pageNum = pageNo;
      this.refreshProductList();
    },
    getImgUrl(image) {
      return this.BASEURL + image;
    },
    moreSearch() {
      common_vendor.index.navigateTo({
        url: "/pages/product/price_query"
      });
    }
  },
  watch: {
    searchVal(newVal, oldVal) {
      this.searchProduct.productNameOrType = newVal;
      this.$refs.paging.reload();
    }
  },
  onLoad() {
    this.moreSearchStore.clearMoreSearchStore();
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
    c: common_vendor.o(($event) => $data.searchVal = $event.detail.value, "82"),
    d: common_vendor.o(($event) => $options.moreSearch(), "ad"),
    e: common_vendor.f($data.productList, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.productName),
        b: common_vendor.t(item.type || "未填写"),
        c: common_vendor.t(item.size),
        d: common_vendor.t(item.production),
        e: common_vendor.t(item.color),
        f: common_vendor.t(item.texture),
        g: common_vendor.t(item.retailPrice),
        h: "/pages/product/price_detail?id=" + item.id,
        i: item.productImages && item.productImages.length
      }, item.productImages && item.productImages.length ? {
        j: common_vendor.t(item.productImages.length)
      } : {}, {
        k: common_vendor.o(($event) => $options.previewImage(item), item.id),
        l: item.id
      });
    }),
    f: common_vendor.sr("paging", "1c84ae56-0"),
    g: common_vendor.o($options.queryList, "57"),
    h: common_vendor.o(($event) => $data.productList = $event, "a0"),
    i: common_vendor.p({
      modelValue: $data.productList
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1c84ae56"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/product/price_list.js.map
