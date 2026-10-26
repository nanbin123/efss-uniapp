"use strict";
const common_vendor = require("../../common/vendor.js");
const components_utils_request = require("../../components/utils/request.js");
const store_modules_product = require("../../store/modules/product.js");
const store_modules_moreSearch = require("../../store/modules/moreSearch.js");
const _sfc_main = {
  data() {
    return {
      searchVal: "",
      productList: [],
      totalMoney: 0,
      totalNumber: 0,
      evenatChannel: null,
      searchWarehousingProduct: {}
    };
  },
  setup() {
    const productStore = store_modules_product.useProductStore();
    const moreSearchStore = store_modules_moreSearch.useMoreSearchStore();
    return { productStore, moreSearchStore };
  },
  methods: {
    getProductImageUrls(item) {
      const images = Array.isArray(item.productImages) ? item.productImages : [];
      return images.filter((image) => image && typeof image.productUrl === "string" && image.productUrl.trim()).map((image) => {
        const url = image.productUrl.trim();
        return /^https?:\/\//i.test(url) ? url : this.BASEURL.replace(/\/$/, "") + "/" + url.replace(/^\/+/, "");
      });
    },
    getProductImageCount(item) {
      return this.getProductImageUrls(item).length;
    },
    previewImage(item) {
      const urls = this.getProductImageUrls(item);
      if (!urls.length) {
        common_vendor.index.showToast({ title: "暂无更多图片", icon: "none" });
        return;
      }
      common_vendor.index.previewImage({ current: 0, urls, indicator: "number", loop: true });
    },
    getProductList() {
      let product = this.moreSearchStore.moreSearch;
      this.searchWarehousingProduct = product;
      this.$refs.paging.reload();
    },
    refreshWarehousingProductList() {
      components_utils_request.post("warehousing/selectListWarehousingEntryProduct", this.searchWarehousingProduct).then((res) => {
        if (res.code == 200) {
          let productData = res.data;
          var products = this.productStore.products;
          for (var i = 0; i < productData.length; i++) {
            let productId = productData[i].productId;
            let newProducts = products.filter((item) => item.productId === productId);
            let isSelected = newProducts.length > 0 ? true : false;
            productData[i].selected = isSelected;
            if (isSelected) {
              productData[i].inventoryQuantity = newProducts[0].inventoryQuantity;
            }
          }
          this.$refs.paging.complete(productData);
        }
      });
    },
    queryList(pageNo, pageSize) {
      this.searchWarehousingProduct.pageNum = pageNo;
      this.refreshWarehousingProductList();
    },
    selectProduct(item) {
      item.selected = !item.selected;
      if (item.selected === true) {
        this.add(item);
      } else if (item.selected === false) {
        this.subtraction(item);
      }
    },
    onCheckchange(e, item) {
      item.selected = e.detail.value.includes("selected");
      if (item.selected === true) {
        this.add(item);
      } else if (item.selected === false) {
        this.subtraction(item);
      }
    },
    subtraction(item) {
      item.inventoryQuantity = 0;
      this.totalNumber--;
      this.totalMoney = parseFloat(this.totalMoney) - parseFloat(item.retailPrice);
      this.productStore.subtraction(item.productId);
    },
    add(item) {
      item.inventoryQuantity++;
      this.totalNumber++;
      this.totalMoney = parseFloat(this.totalMoney) + parseFloat(item.retailPrice);
      this.productStore.add(item);
    },
    confirm() {
      let pages = getCurrentPages();
      if (pages.length > 1) {
        common_vendor.index.navigateBack({
          delta: 1,
          success: (event) => {
            pages[pages.length - 2].$vm.getWarehousingProduct();
          }
        });
      }
    },
    moreSearch() {
      common_vendor.index.navigateTo({
        url: "/pages/warehousing/warehousing_product_query"
      });
    },
    getImgUrl(image) {
      return this.BASEURL + image;
    }
  },
  watch: {
    searchVal(newVal, oldVal) {
      this.searchWarehousingProduct.productName = newVal;
      this.$refs.paging.reload();
    }
  },
  onShow(option) {
    let products = this.productStore.products;
    this.totalNumber = products.reduce((accumulator, currentObject) => {
      return Number(accumulator) + Number(currentObject.inventoryQuantity);
    }, 0);
    this.totalMoney = products.reduce((accumulator, currentObject) => {
      return Number(accumulator) + Number(currentObject.retailPrice) * Number(currentObject.inventoryQuantity);
    }, 0);
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
    c: common_vendor.o(($event) => $data.searchVal = $event.detail.value, "e3"),
    d: common_vendor.o(($event) => $options.moreSearch(), "12"),
    e: common_vendor.f($data.productList, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.productName),
        b: common_vendor.t(item.type),
        c: common_vendor.t(item.size),
        d: common_vendor.t(item.production),
        e: common_vendor.t(item.texture),
        f: common_vendor.t(item.color),
        g: common_vendor.t(item.inventoryQuantity),
        h: common_vendor.t(item.retailPrice),
        i: common_vendor.o(($event) => $options.selectProduct(item), index),
        j: item.selected,
        k: common_vendor.o(() => {
        }, index),
        l: common_vendor.o(($event) => $options.onCheckchange($event, item), index),
        m: $options.getProductImageCount(item)
      }, $options.getProductImageCount(item) ? {
        n: common_vendor.t($options.getProductImageCount(item) > 99 ? "99+" : $options.getProductImageCount(item))
      } : {}, {
        o: $options.getProductImageCount(item) ? "查看产品图片，共" + $options.getProductImageCount(item) + "张" : "暂无产品图片",
        p: $options.getProductImageCount(item) ? "preview-button-active" : "none",
        q: common_vendor.o(($event) => $options.previewImage(item), index),
        r: index
      });
    }),
    f: common_vendor.t($data.totalNumber),
    g: common_vendor.t($data.totalMoney),
    h: common_vendor.o(($event) => $options.confirm(), "4b"),
    i: common_vendor.sr("paging", "88559184-0"),
    j: common_vendor.o($options.queryList, "75"),
    k: common_vendor.o(($event) => $data.productList = $event, "ed"),
    l: common_vendor.p({
      modelValue: $data.productList
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-88559184"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/warehousing/warehousing_product.js.map
