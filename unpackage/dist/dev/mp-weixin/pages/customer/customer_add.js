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
        return { productId: product.productId, number: product.number };
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
    a: $options.getImgUrl("static/image/cusomer/cusomer_name.png"),
    b: $data.customerNameFocus,
    c: common_vendor.o(($event) => $data.customerNameFocus = false),
    d: $data.customer.customerName,
    e: common_vendor.o(($event) => $data.customer.customerName = $event.detail.value),
    f: $options.getImgUrl("static/image/cusomer/cusomer_gender.png"),
    g: $data.customer.sex === "1" ? "#fff" : "#333",
    h: $data.customer.sex === "2" ? "#fff" : "#333",
    i: common_vendor.o((...args) => $options.radioChange && $options.radioChange(...args)),
    j: $options.getImgUrl("static/image/cusomer/customer_phone.png"),
    k: $data.customer.phone,
    l: common_vendor.o(($event) => $data.customer.phone = $event.detail.value),
    m: $options.getImgUrl("static/image/cusomer/cusomer_address.png"),
    n: $data.customer.address,
    o: common_vendor.o(($event) => $data.customer.address = $event.detail.value),
    p: $options.getImgUrl("static/image/cusomer/degree.png"),
    q: common_vendor.o(($event) => $options.changeStar(1)),
    r: $data.customer.grade > 0 ? _ctx.BASEURL + $data.fullStarUrl : _ctx.BASEURL + $data.nullStarUrl,
    s: common_vendor.o(($event) => $options.changeStar(2)),
    t: $data.customer.grade > 1 ? _ctx.BASEURL + $data.fullStarUrl : _ctx.BASEURL + $data.nullStarUrl,
    v: common_vendor.o(($event) => $options.changeStar(3)),
    w: $data.customer.grade > 2 ? _ctx.BASEURL + $data.fullStarUrl : _ctx.BASEURL + $data.nullStarUrl,
    x: $options.getImgUrl("static/image/cusomer/quoted_price.png"),
    y: $data.customer.quotation,
    z: common_vendor.o(($event) => $data.customer.quotation = $event.detail.value),
    A: $options.getImgUrl("static/image/cusomer/arrive.png"),
    B: $data.customer.remark,
    C: common_vendor.o(($event) => $data.customer.remark = $event.detail.value),
    D: common_vendor.t($options.productNumberTotal),
    E: common_vendor.t($options.productRetailPriceTotal),
    F: common_vendor.f($data.customer.customerProducts, (item, index, i0) => {
      return {
        a: common_vendor.t(item.productName),
        b: common_vendor.t(item.type),
        c: common_vendor.t(item.size),
        d: common_vendor.t(item.production),
        e: common_vendor.t(item.color),
        f: common_vendor.t(item.texture),
        g: common_vendor.t(item.retailPrice),
        h: common_vendor.t(item.number),
        i: index
      };
    }),
    G: $options.getImgUrl("static/image/茶几.png"),
    H: $options.getImgUrl("static/image/red_add.png"),
    I: common_vendor.o(($event) => $options.addCustomerProduct()),
    J: common_vendor.o(($event) => $options.addCustomer())
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7f77e776"]]);
wx.createPage(MiniProgramPage);
