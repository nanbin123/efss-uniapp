"use strict";
const common_vendor = require("../../common/vendor.js");
const components_utils_request = require("../../components/utils/request.js");
const store_modules_product = require("../../store/modules/product.js");
const _sfc_main = {
  data() {
    return {
      fullStarUrl: "static/image/cusomer/star.png",
      nullStarUrl: "static/image/cusomer/empty.png",
      customer: { customerProducts: [] },
      //客户数据
      customerNameFocus: true
    };
  },
  setup() {
    const productStore = store_modules_product.useProductStore();
    return { productStore };
  },
  methods: {
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
    deleteProduct(productId) {
      this.customer.customerProducts = this.customer.customerProducts.filter((item) => item.productId != productId);
      this.productStore.addProduct(this.customer.customerProducts);
    },
    getImgUrl(image) {
      return this.BASEURL + image;
    },
    //意向程度
    changeStar(val) {
      this.customer.grade = val;
    },
    addCustomer() {
      if (!this.customer.customerName) {
        this.$nextTick(() => {
          this.customerNameFocus = true;
        });
        common_vendor.index.showToast({
          title: "客户姓名不能为空",
          icon: "none"
        });
        return;
      }
      if (!this.customer.sex) {
        common_vendor.index.showToast({
          title: "请选择客户性别",
          icon: "none"
        });
        return;
      }
      let customerObj = JSON.parse(JSON.stringify(this.customer));
      let productInfo = customerObj.customerProducts.map((product) => {
        return {
          productId: product.productId,
          number: product.number,
          productImages: product.productImages || []
        };
      });
      customerObj.customerProducts = productInfo;
      components_utils_request.post("customer/insertAddCustomer", JSON.stringify(customerObj), "application/json").then((res) => {
        if (200 == res.code) {
          common_vendor.index.showToast({
            title: "添加意向客户成功",
            icon: "none",
            duration: 2e3
          });
        }
      });
    },
    getCustomerProduct() {
      let products = JSON.stringify(this.productStore.products);
      this.customer.customerProducts = JSON.parse(products);
    },
    addCustomerProduct() {
      let arrProduct = this.customer.customerProducts;
      this.productStore.addProduct(arrProduct);
      common_vendor.index.navigateTo({
        url: "/pages/customer/customer_product"
      });
    },
    radioChange(evt) {
      this.customer.sex = evt.detail.value;
    }
  },
  onLoad(option) {
  },
  computed: {
    productRetailPriceTotal() {
      let productRetailPriceTotal = 0;
      if (typeof this.customer.customerProducts != "undefined") {
        for (let i = 0; i < this.customer.customerProducts.length; i++) {
          productRetailPriceTotal += parseFloat(this.customer.customerProducts[i].retailPrice) * parseFloat(this.customer.customerProducts[i].number);
        }
      }
      return productRetailPriceTotal;
    },
    productNumberTotal() {
      let productNumberTotal = 0;
      if (typeof this.customer.customerProducts != "undefined") {
        for (let i = 0; i < this.customer.customerProducts.length; i++) {
          productNumberTotal += parseFloat(this.customer.customerProducts[i].number);
        }
      }
      return productNumberTotal;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.customerNameFocus,
    b: common_vendor.o(($event) => $data.customerNameFocus = false, "ef"),
    c: $data.customer.customerName,
    d: common_vendor.o(($event) => $data.customer.customerName = $event.detail.value, "82"),
    e: $data.customer.sex === "1" ? "#fff" : "#333",
    f: $data.customer.sex === "2" ? "#fff" : "#333",
    g: common_vendor.o((...args) => $options.radioChange && $options.radioChange(...args), "48"),
    h: $data.customer.phone,
    i: common_vendor.o(($event) => $data.customer.phone = $event.detail.value, "81"),
    j: $data.customer.address,
    k: common_vendor.o(($event) => $data.customer.address = $event.detail.value, "29"),
    l: common_vendor.o(($event) => $options.changeStar(1), "2c"),
    m: $data.customer.grade > 0 ? _ctx.BASEURL + $data.fullStarUrl : _ctx.BASEURL + $data.nullStarUrl,
    n: common_vendor.o(($event) => $options.changeStar(2), "a9"),
    o: $data.customer.grade > 1 ? _ctx.BASEURL + $data.fullStarUrl : _ctx.BASEURL + $data.nullStarUrl,
    p: common_vendor.o(($event) => $options.changeStar(3), "d6"),
    q: $data.customer.grade > 2 ? _ctx.BASEURL + $data.fullStarUrl : _ctx.BASEURL + $data.nullStarUrl,
    r: $data.customer.quotation,
    s: common_vendor.o(($event) => $data.customer.quotation = $event.detail.value, "ef"),
    t: $data.customer.remark,
    v: common_vendor.o(($event) => $data.customer.remark = $event.detail.value, "a6"),
    w: common_vendor.t($options.productNumberTotal),
    x: common_vendor.t($options.productRetailPriceTotal),
    y: common_vendor.f($data.customer.customerProducts, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.productName),
        b: common_vendor.t(item.type),
        c: common_vendor.t(item.size),
        d: common_vendor.t(item.production),
        e: common_vendor.t(item.texture),
        f: common_vendor.t(item.color),
        g: common_vendor.t(item.number),
        h: common_vendor.t(item.retailPrice),
        i: common_vendor.o(($event) => $options.deleteProduct(item.productId), item.productId || index),
        j: item.productImages && item.productImages.length
      }, item.productImages && item.productImages.length ? {
        k: common_vendor.t(item.productImages.length)
      } : {}, {
        l: common_vendor.o(($event) => $options.previewImage(item), item.productId || index),
        m: item.productId || index
      });
    }),
    z: $options.getImgUrl("static/image/red_add.png"),
    A: common_vendor.o(($event) => $options.addCustomerProduct(), "99"),
    B: common_vendor.o(($event) => $options.addCustomer(), "41")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7f77e776"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/customer/customer_add.js.map
