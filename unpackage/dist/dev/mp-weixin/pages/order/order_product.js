"use strict";
const common_vendor = require("../../common/vendor.js");
const components_utils_request = require("../../components/utils/request.js");
const store_modules_product = require("../../store/modules/product.js");
const store_modules_moreSearch = require("../../store/modules/moreSearch.js");
const _sfc_main = {
  data() {
    return {
      productList: [],
      searchVal: "",
      totalMoney: 0,
      totalNumber: 0,
      searchProduct: {}
    };
  },
  setup() {
    const productStore = store_modules_product.useProductStore();
    const moreSearchStore = store_modules_moreSearch.useMoreSearchStore();
    return { productStore, moreSearchStore };
  },
  methods: {
    getProductList() {
      let product = this.moreSearchStore.moreSearch;
      this.searchProduct = product;
      this.$refs.paging.reload();
    },
    refreshProductList(pageNo, pageSize) {
      components_utils_request.post("order/selectListOrderProduct", this.searchProduct).then((res) => {
        if (res.code == 200) {
          var productData = res.rows;
          var products = this.productStore.products;
          for (var i = 0; i < productData.length; i++) {
            let productId = productData[i].productId;
            let newProducts = products.filter((item) => item.productId === productId);
            let isSelected = newProducts.length > 0 ? true : false;
            productData[i].selected = isSelected;
            if (isSelected) {
              productData[i].number = newProducts[0].number;
            }
          }
          this.$refs.paging.complete(productData);
        }
      });
    },
    queryList(pageNo, pageSize) {
      this.searchProduct.pageNum = pageNo;
      this.refreshProductList();
    },
    onCheckchange(e, item) {
      item.selected = e.detail.value.includes("selected");
      if (item.selected === true) {
        this.add(item);
      } else if (item.selected === false) {
        this.subtraction(item);
      }
    },
    selectProduct(item) {
      item.selected = !item.selected;
      if (item.selected === true) {
        this.add(item);
      } else if (item.selected === false) {
        this.subtraction(item);
      }
    },
    subtraction(item) {
      item.number = 0;
      this.totalNumber--;
      this.totalMoney = parseFloat(this.totalMoney) - parseFloat(item.retailPrice);
      this.productStore.subtraction(item.productId);
    },
    add(item) {
      item.number++;
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
            pages[pages.length - 2].$vm.getOrderProduct();
          }
        });
      }
    },
    moreSearch() {
      common_vendor.index.navigateTo({
        url: "/pages/order/order_product_query"
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
  onShow(option) {
    let products = this.productStore.products;
    this.totalNumber = products.reduce((accumulator, currentObject) => {
      return Number(accumulator) + Number(currentObject.number);
    }, 0);
    this.totalMoney = products.reduce((accumulator, currentObject) => {
      return Number(accumulator) + Number(currentObject.retailPrice) * Number(currentObject.number);
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
    c: common_vendor.o(($event) => $data.searchVal = $event.detail.value),
    d: common_vendor.o(($event) => $options.moreSearch()),
    e: common_vendor.f($data.productList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.productName),
        b: common_vendor.t(item.type),
        c: common_vendor.t(item.size),
        d: common_vendor.t(item.production),
        e: common_vendor.t(item.texture),
        f: common_vendor.t(item.color),
        g: common_vendor.t(item.number),
        h: common_vendor.t(item.retailPrice),
        i: item.selected,
        j: common_vendor.o(($event) => $options.onCheckchange($event, item), item.id),
        k: common_vendor.o(($event) => $options.selectProduct(item), item.id),
        l: item.id
      };
    }),
    f: $options.getImgUrl("static/image/茶几.png"),
    g: common_vendor.t($data.totalNumber),
    h: common_vendor.t($data.totalMoney),
    i: common_vendor.o(($event) => $options.confirm()),
    j: common_vendor.sr("paging", "e3ef2e02-0"),
    k: common_vendor.o($options.queryList),
    l: common_vendor.o(($event) => $data.productList = $event),
    m: common_vendor.p({
      modelValue: $data.productList
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
