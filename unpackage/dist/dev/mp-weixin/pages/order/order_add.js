"use strict";
const common_vendor = require("../../common/vendor.js");
const components_utils_request = require("../../components/utils/request.js");
const store_modules_product = require("../../store/modules/product.js");
const store_modules_transfer_order = require("../../store/modules/transfer_order.js");
const cPicker = () => "../../components/c-picker/c-picker.js";
const _sfc_main = {
  components: {
    cPicker
  },
  options: { styleIsolation: "shared" },
  data() {
    return {
      orderForm: {
        orderProductList: []
      },
      customerNameFocus: true,
      phoneFocus: false,
      addressFocus: false,
      actualmoneyFocus: false,
      popupProduct: {
        productId: "",
        productName: "",
        number: ""
      }
    };
  },
  setup() {
    const productStore = store_modules_product.useProductStore();
    const transferOrderStore = store_modules_transfer_order.useTransferOrderStore();
    return { productStore, transferOrderStore };
  },
  methods: {
    open(item) {
      this.popupProduct.productName = item.productName;
      this.popupProduct.number = item.number;
      this.popupProduct.productId = item.productId;
      this.$refs.popup.open("center");
    },
    cancelTrack() {
      this.$refs.popup.close();
    },
    submitTrack() {
      let orderProductList = this.orderForm.orderProductList;
      let productId = this.popupProduct.productId;
      let orderProduct = orderProductList.filter((obj) => obj.productId == productId)[0];
      orderProduct.number = this.popupProduct.number;
      this.$refs.popup.close();
    },
    //移除指定产品
    deleteProduct(productId) {
      let orderProductList = this.orderForm.orderProductList;
      this.orderForm.orderProductList = orderProductList.filter((obj) => obj.productId != productId);
    },
    //送货时间弹窗
    toggle(val) {
      this.$refs[val].show();
    },
    deliveryHand(value) {
      this.orderForm.deliveryTime = value.result;
    },
    //性别选择
    radioChange(evt) {
      this.orderForm.sex = evt.detail.value;
    },
    // 校验电话号码
    checkPhone() {
      if ("" != this.orderForm.customerPhone && void 0 != this.orderForm.customerPhone) {
        this.phoneFocus = false;
        const reg = /^(1[3-9]\d{9})|(0\d{2,3}-?\d{7,8})$/;
        this.phoneError = !reg.test(this.orderForm.customerPhone);
        if (this.phoneError) {
          common_vendor.index.showToast({
            title: "请输入有效的电话号码",
            icon: "none"
          });
        }
      }
    },
    //确认提交订单
    addOrderForm() {
      if (!this.orderForm.customerName) {
        this.$nextTick(() => {
          this.customerNameFocus = true;
        });
        common_vendor.index.showToast({
          title: "客户姓名不能为空",
          icon: "none"
        });
        return;
      }
      if (!this.orderForm.sex) {
        common_vendor.index.showToast({
          title: "请选择客户性别",
          icon: "none"
        });
        return;
      }
      if (!this.orderForm.customerPhone) {
        this.$nextTick(() => {
          this.phoneFocus = true;
        });
        common_vendor.index.showToast({
          title: "客户电话不能为空",
          icon: "none"
        });
        return;
      } else if (this.phoneError) {
        common_vendor.index.showToast({
          title: "请输入有效的电话号码",
          icon: "none"
        });
        return;
      }
      if (!this.orderForm.customerAddress) {
        this.$nextTick(() => {
          this.addressFocus = true;
        });
        common_vendor.index.showToast({
          title: "客户地址不能为空",
          icon: "none"
        });
        return;
      }
      if (!this.orderForm.actualmoney) {
        this.$nextTick(() => {
          this.actualmoneyFocus = true;
        });
        common_vendor.index.showToast({
          title: "实收金额不能为空",
          icon: "none"
        });
        return;
      }
      if (this.orderForm.orderProductList.length == 0) {
        common_vendor.index.showToast({
          title: "产品不能为空，请选择产品",
          icon: "none"
        });
        return;
      }
      let orderForm = JSON.parse(JSON.stringify(this.orderForm));
      let productInfo = orderForm.orderProductList.map((product) => {
        return { productId: product.productId, number: product.number };
      });
      orderForm.orderProductList = productInfo;
      components_utils_request.post("order/insertOrderForm", JSON.stringify(orderForm), "application/json").then((res) => {
        if (200 == res.code) {
          common_vendor.index.showToast({
            title: "添加销售订单成功",
            icon: "none",
            duration: 2e3
          });
        }
      });
    },
    addOrderProduct() {
      let arrProduct = this.orderForm.orderProductList;
      this.productStore.addProduct(arrProduct);
      common_vendor.index.navigateTo({
        url: "/pages/order/order_product"
      });
    },
    getOrderProduct() {
      let products = JSON.stringify(this.productStore.products);
      this.orderForm.orderProductList = JSON.parse(products);
    },
    getImgUrl(image) {
      return this.BASEURL + image;
    },
    isEmpty(str) {
      return typeof str === "undefined" || "" === str;
    }
  },
  computed: {
    productRetailPriceTotal() {
      let productRetailPriceTotal = 0;
      if (typeof this.orderForm.orderProductList != "undefined") {
        for (let i = 0; i < this.orderForm.orderProductList.length; i++) {
          productRetailPriceTotal += parseFloat(this.orderForm.orderProductList[i].retailPrice) * parseFloat(this.orderForm.orderProductList[i].number);
        }
      }
      this.orderForm.totalAmount = productRetailPriceTotal;
      return productRetailPriceTotal;
    },
    discount() {
      if (this.orderForm.totalAmount == 0 || typeof this.orderForm.totalAmount == "undefined") {
        return 0;
      }
      if (this.orderForm.actualmoney == 0 || typeof this.orderForm.actualmoney == "undefined") {
        return 0;
      }
      let discount = this.orderForm.actualmoney / this.orderForm.totalAmount;
      return discount * 100;
    }
  },
  onShow() {
    let pages = getCurrentPages();
    if (pages.length > 1) {
      let previousPage = pages[pages.length - 2];
      if ("pages/customer/customer_detail" == previousPage.route) {
        let customer = this.transferOrderStore.customer;
        this.orderForm.customerName = customer.customerName;
        this.orderForm.sex = customer.sex;
        this.orderForm.customerPhone = customer.phone;
        this.orderForm.customerAddress = customer.address;
        this.orderForm.customerId = customer.id;
        this.orderForm.orderProductList = customer.customerProducts;
      }
    }
  }
};
if (!Array) {
  const _component_cPicker = common_vendor.resolveComponent("cPicker");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_component_cPicker + _easycom_uni_popup2)();
}
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  _easycom_uni_popup();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $options.getImgUrl("static/image/order/cusomer_name_add.png"),
    b: $data.customerNameFocus,
    c: common_vendor.o(($event) => $data.customerNameFocus = false),
    d: $data.orderForm.customerName,
    e: common_vendor.o(($event) => $data.orderForm.customerName = $event.detail.value),
    f: $options.getImgUrl("static/image/order/cusomer_gender.png"),
    g: $data.orderForm.sex === "1" ? "#fff" : "#333",
    h: $data.orderForm.sex === "1",
    i: $data.orderForm.sex === "2" ? "#fff" : "#333",
    j: $data.orderForm.sex === "2",
    k: common_vendor.o((...args) => $options.radioChange && $options.radioChange(...args)),
    l: $options.getImgUrl("static/image/order/cusomer_phone.png"),
    m: $data.phoneFocus,
    n: common_vendor.o((...args) => $options.checkPhone && $options.checkPhone(...args)),
    o: $data.orderForm.customerPhone,
    p: common_vendor.o(($event) => $data.orderForm.customerPhone = $event.detail.value),
    q: $options.getImgUrl("static/image/order/cusomer_address.png"),
    r: $data.addressFocus,
    s: common_vendor.o(($event) => $data.addressFocus = false),
    t: $data.orderForm.customerAddress,
    v: common_vendor.o(($event) => $data.orderForm.customerAddress = $event.detail.value),
    w: $options.getImgUrl("static/image/order/order_actual_amount.png"),
    x: $data.actualmoneyFocus,
    y: common_vendor.o(($event) => $data.actualmoneyFocus = false),
    z: $data.orderForm.actualmoney,
    A: common_vendor.o(($event) => $data.orderForm.actualmoney = $event.detail.value),
    B: $options.getImgUrl("static/image/order/delivery_time.png"),
    C: common_vendor.t($options.isEmpty($data.orderForm.deliveryTime) ? "请选择" : $data.orderForm.deliveryTime),
    D: common_vendor.o(($event) => $options.toggle("delivery_time")),
    E: $options.isEmpty($data.orderForm.deliveryTime) ? "#a0a0a0" : "#333",
    F: common_vendor.sr("delivery_time", "104119aa-0"),
    G: common_vendor.o($options.deliveryHand),
    H: common_vendor.p({
      mode: "date"
    }),
    I: $options.getImgUrl("static/image/order/total_amount.png"),
    J: $options.productRetailPriceTotal,
    K: common_vendor.o(($event) => $options.productRetailPriceTotal = $event.detail.value),
    L: $options.getImgUrl("static/image/order/discount.png"),
    M: $options.discount,
    N: common_vendor.o(($event) => $options.discount = $event.detail.value),
    O: $options.getImgUrl("static/image/order/choice.png"),
    P: $options.getImgUrl("static/image/add.png"),
    Q: common_vendor.o(($event) => $options.addOrderProduct()),
    R: common_vendor.f($data.orderForm.orderProductList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.productName),
        b: common_vendor.t(item.type),
        c: common_vendor.t(item.size),
        d: common_vendor.t(item.production),
        e: common_vendor.t(item.color),
        f: common_vendor.t(item.texture),
        g: common_vendor.t(item.retailPrice),
        h: common_vendor.t(item.number),
        i: common_vendor.o(($event) => $options.open(item)),
        j: common_vendor.o(($event) => $options.deleteProduct(item.productId))
      };
    }),
    S: $options.getImgUrl("static/image/茶几.png"),
    T: common_vendor.o(($event) => $options.addOrderForm()),
    U: common_vendor.t($data.popupProduct.productName),
    V: $data.popupProduct.number,
    W: common_vendor.o(($event) => $data.popupProduct.number = $event.detail.value),
    X: common_vendor.o(($event) => $options.cancelTrack()),
    Y: common_vendor.o(($event) => $options.submitTrack()),
    Z: common_vendor.sr("popup", "104119aa-1"),
    aa: common_vendor.p({
      type: "bottom",
      ["border-radius"]: "10px 10px 0 0"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-104119aa"]]);
wx.createPage(MiniProgramPage);
