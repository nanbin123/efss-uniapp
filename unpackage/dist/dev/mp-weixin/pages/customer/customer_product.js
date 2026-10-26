"use strict";
const common_vendor = require("../../common/vendor.js");
const components_utils_request = require("../../components/utils/request.js");
const store_modules_product = require("../../store/modules/product.js");
const store_modules_moreSearch = require("../../store/modules/moreSearch.js");
const _sfc_main = {
  data() {
    return {
      productList: [],
      searchProduct: {},
      searchVal: "",
      totalMoney: 0,
      totalNumber: 0,
      customerId: ""
    };
  },
  setup() {
    const productStore = store_modules_product.useProductStore();
    const moreSearchStore = store_modules_moreSearch.useMoreSearchStore();
    return { productStore, moreSearchStore };
  },
  methods: {
    getProductImageCount(item) {
      return Array.isArray(item.productImages) ? item.productImages.length : 0;
    },
    //获取商品第一张图片（空数组时显示默认图）
    getProductImg(item) {
      if (item.productImages && item.productImages.length > 0) {
        let url = item.productImages[0].productUrl;
        return this.BASEURL + (url.startsWith("/") ? url.substring(1) : url);
      }
      return this.getImgUrl("static/image/茶几.png");
    },
    // 点击放大预览，支持左右滑动切换所有图片
    previewImage(item) {
      if (!item.productImages || item.productImages.length === 0) {
        common_vendor.index.showToast({ title: "暂无更多图片", icon: "none" });
        return;
      }
      const urls = item.productImages.map((img) => {
        let url = img.productUrl;
        return this.BASEURL + (url.startsWith("/") ? url.substring(1) : url);
      });
      common_vendor.index.previewImage({
        current: 0,
        // 从第一张开始
        urls,
        // 所有图片地址
        indicator: "number",
        // 显示 1/3 数字指示器
        loop: true
        // 循环切换
      });
    },
    getProductList() {
      let product = this.moreSearchStore.moreSearch;
      this.searchProduct = product;
      this.$refs.paging.reload();
    },
    refreshProductList() {
      components_utils_request.post("customer/selectListCustomerProduct", this.searchProduct).then((res) => {
        if (res.code == 200) {
          let productData = res.rows;
          var products = this.productStore.products;
          for (var i = 0; i < productData.length; i++) {
            let productId = productData[i].productId;
            let newProducts = products.filter((item) => productId && item.productId === productId);
            let isSelected = newProducts.length > 0 ? true : false;
            productData[i].selected = isSelected;
            if (isSelected) {
              productData[i].number = newProducts[0].number;
            }
          }
          this.$refs.paging.complete(res.rows);
        }
      });
    },
    queryList(pageNo, pageSize) {
      this.searchProduct.pageNum = pageNo;
      this.refreshProductList();
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
    add(item) {
      item.number++;
      this.totalNumber++;
      this.totalMoney = parseFloat(this.totalMoney) + parseFloat(item.retailPrice);
    },
    subtraction(item) {
      item.number = 0;
      this.totalNumber--;
      this.totalMoney = parseFloat(this.totalMoney) - parseFloat(item.retailPrice);
    },
    confirm() {
      var productChooseArray = this.productList.filter(function(item) {
        return item.selected == true;
      });
      this.productStore.addProduct(productChooseArray);
      let pages = getCurrentPages();
      if (pages.length > 1) {
        common_vendor.index.navigateBack({
          delta: 1,
          success: (event) => {
            pages[pages.length - 2].$vm.getCustomerProduct();
          }
        });
      }
    },
    moreSearch() {
      common_vendor.index.navigateTo({
        url: "/pages/customer/customer_product_query"
      });
    },
    getImgUrl(image) {
      return this.BASEURL + image;
    }
  },
  watch: {
    searchVal(newVal, oldVal) {
      this.searchProduct.productName = newVal;
      this.$refs.paging.reload();
    }
  },
  onShow() {
    let products = this.productStore.products;
    this.totalNumber = products.reduce((accumulator, currentObject) => {
      return accumulator + currentObject.number;
    }, 0);
    this.totalMoney = products.reduce((accumulator, currentObject) => {
      return accumulator + currentObject.retailPrice * currentObject.number;
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
    c: common_vendor.o(($event) => $data.searchVal = $event.detail.value, "c2"),
    d: common_vendor.o(($event) => $options.moreSearch(), "ad"),
    e: common_vendor.f($data.productList, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.productName),
        b: common_vendor.t(item.type),
        c: common_vendor.t(item.size),
        d: common_vendor.t(item.production),
        e: common_vendor.t(item.texture),
        f: common_vendor.t(item.color),
        g: common_vendor.t(item.number),
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
    h: common_vendor.o(($event) => $options.confirm(), "d3"),
    i: common_vendor.sr("paging", "e68c9f1c-0"),
    j: common_vendor.o($options.queryList, "ef"),
    k: common_vendor.o(($event) => $data.productList = $event, "2c"),
    l: common_vendor.p({
      modelValue: $data.productList
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e68c9f1c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/customer/customer_product.js.map
