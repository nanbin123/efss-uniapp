"use strict";
const common_vendor = require("../../common/vendor.js");
const components_utils_request = require("../../components/utils/request.js");
const store_modules_product = require("../../store/modules/product.js");
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
      condition: false,
      // 根据条件设置是否显示 placeholder 内容
      isEditable: true,
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
    return { productStore };
  },
  methods: {
    open(item) {
      if (this.isEditable == false) {
        this.popupProduct.productName = item.productName;
        this.popupProduct.number = item.number;
        this.popupProduct.productId = item.productId;
        this.$refs.popup.open("center");
      }
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
    deleteProduct() {
      let productId = this.popupProduct.productId;
      let orderProductList = this.orderForm.orderProductList;
      let index = orderProductList.findIndex((item) => item.productId == productId);
      orderProductList.splice(index, 1);
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
    editOrderForm() {
      if (this.isEditable == true) {
        this.isEditable = false;
      } else if (this.isEditable == false) {
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
        let orderForm = JSON.parse(JSON.stringify(this.orderForm));
        let orderProductList = orderForm.orderProductList.map((item) => {
          return { productId: item.productId, number: item.number };
        });
        orderForm.orderProductList = orderProductList;
        components_utils_request.post("order/updateOrderFormById", JSON.stringify(orderForm), "application/json").then((res) => {
          if (200 == res.code) {
            this.isEditable = true;
            common_vendor.index.showToast({
              title: "修改销售订单成功",
              icon: "none",
              duration: 2e3
            });
          }
        });
      }
    },
    deleteOrderForm() {
      let that = this;
      if (this.isEditable == true) {
        common_vendor.index.showModal({
          title: "提示",
          content: "是否删除销售订单",
          success: (res) => {
            if (res.confirm) {
              components_utils_request.post("order/deleteOrderFormById", { "id": that.orderForm.id }).then((res2) => {
                if (200 == res2.code) {
                  this.isEditable = true;
                  that.orderForm = {};
                  common_vendor.index.showToast({
                    title: "删除销售订单成功",
                    icon: "none",
                    duration: 2e3
                  });
                }
              });
            }
          }
        });
      } else if (this.isEditable == false) {
        this.isEditable = true;
      }
    },
    radioChange(evt) {
      this.orderForm.sex = evt.detail.value;
    },
    toggle(val) {
      if (!this.isEditable) {
        this.$refs[val].show();
      }
    },
    deliveryHand(value) {
      this.orderForm.deliveryTime = value.result;
    },
    addOrderProduct() {
      let arrProduct = this.orderForm.orderProductList;
      this.productStore.addProduct(arrProduct);
      if (this.isEditable == false) {
        common_vendor.index.navigateTo({
          url: "/pages/order/order_product"
        });
      }
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
  onLoad(option) {
    components_utils_request.post("order/selectOrderById", { "orderFormId": option.id }).then((res) => {
      if (200 == res.code) {
        this.orderForm = res.data;
      }
    });
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
    a: $options.getImgUrl("static/image/order/order_number.png"),
    b: common_vendor.o(($event) => $data.customerNameFocus = false),
    c: $data.orderForm.orderNumber,
    d: common_vendor.o(($event) => $data.orderForm.orderNumber = $event.detail.value),
    e: $options.getImgUrl("static/image/order/cusomer_name_add.png"),
    f: $data.customerNameFocus,
    g: common_vendor.o(($event) => $data.customerNameFocus = false),
    h: $data.isEditable,
    i: $data.isEditable ? "" : "请输入姓名",
    j: $data.orderForm.customerName,
    k: common_vendor.o(($event) => $data.orderForm.customerName = $event.detail.value),
    l: $options.getImgUrl("static/image/order/cusomer_gender.png"),
    m: $data.orderForm.sex === "1" ? "#fff" : "#333",
    n: $data.isEditable,
    o: $data.orderForm.sex === "1" ? "#00a7e2ff" : "#fff",
    p: $data.orderForm.sex === "1",
    q: $data.orderForm.sex === "2" ? "#fff" : "#333",
    r: $data.isEditable,
    s: $data.orderForm.sex === "2" ? "#00a7e2ff" : "#fff",
    t: $data.orderForm.sex === "2",
    v: common_vendor.o((...args) => $options.radioChange && $options.radioChange(...args)),
    w: $options.getImgUrl("static/image/order/cusomer_phone.png"),
    x: $data.phoneFocus,
    y: common_vendor.o((...args) => $options.checkPhone && $options.checkPhone(...args)),
    z: $data.isEditable,
    A: $data.isEditable ? "" : "请输入客户电话",
    B: $data.orderForm.customerPhone,
    C: common_vendor.o(($event) => $data.orderForm.customerPhone = $event.detail.value),
    D: $options.getImgUrl("static/image/order/cusomer_address.png"),
    E: $data.addressFocus,
    F: common_vendor.o(($event) => $data.addressFocus = false),
    G: $data.isEditable,
    H: $data.isEditable ? "" : "请客户输入地址",
    I: $data.orderForm.customerAddress,
    J: common_vendor.o(($event) => $data.orderForm.customerAddress = $event.detail.value),
    K: $options.getImgUrl("static/image/order/total_amount.png"),
    L: $options.productRetailPriceTotal,
    M: common_vendor.o(($event) => $options.productRetailPriceTotal = $event.detail.value),
    N: $options.getImgUrl("static/image/order/order_actual_amount.png"),
    O: $data.actualmoneyFocus,
    P: common_vendor.o(($event) => $data.actualmoneyFocus = false),
    Q: $data.isEditable,
    R: $data.isEditable ? "" : "请输入收款金额",
    S: $data.orderForm.actualmoney,
    T: common_vendor.o(($event) => $data.orderForm.actualmoney = $event.detail.value),
    U: $options.getImgUrl("static/image/order/discount.png"),
    V: $options.discount,
    W: common_vendor.o(($event) => $options.discount = $event.detail.value),
    X: $options.getImgUrl("static/image/order/delivery_time.png"),
    Y: common_vendor.t($options.isEmpty($data.orderForm.deliveryTime) ? "请选择" : $data.orderForm.deliveryTime),
    Z: common_vendor.o(($event) => $options.toggle("delivery_time")),
    aa: $options.isEmpty($data.orderForm.deliveryTime) ? "#a0a0a0" : "#333",
    ab: common_vendor.sr("delivery_time", "c7fdb702-0"),
    ac: common_vendor.o($options.deliveryHand),
    ad: common_vendor.p({
      mode: "date",
      pageData: $data.orderForm.deliveryTime
    }),
    ae: $options.getImgUrl("static/image/order/choice.png"),
    af: $options.getImgUrl("static/image/add.png"),
    ag: common_vendor.o(($event) => $options.addOrderProduct()),
    ah: common_vendor.f($data.orderForm.orderProductList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.productName),
        b: common_vendor.t(item.type),
        c: common_vendor.t(item.size),
        d: common_vendor.t(item.production),
        e: common_vendor.t(item.texture),
        f: common_vendor.t(item.color),
        g: common_vendor.t(item.number),
        h: common_vendor.t(item.retailPrice),
        i: common_vendor.o(($event) => $options.open(item), item.id),
        j: common_vendor.o(($event) => $options.deleteProduct(item.productId), item.id),
        k: item.id
      };
    }),
    ai: $options.getImgUrl("static/image/茶几.png"),
    aj: !$data.isEditable,
    ak: common_vendor.t($data.isEditable ? "删除" : "取消"),
    al: common_vendor.o(($event) => $options.deleteOrderForm()),
    am: common_vendor.t($data.isEditable ? "编辑" : "保存"),
    an: common_vendor.o(($event) => $options.editOrderForm()),
    ao: common_vendor.t($data.popupProduct.productName),
    ap: $data.popupProduct.number,
    aq: common_vendor.o(($event) => $data.popupProduct.number = $event.detail.value),
    ar: common_vendor.o(($event) => $options.cancelTrack()),
    as: common_vendor.o(($event) => $options.submitTrack()),
    at: common_vendor.sr("popup", "c7fdb702-1"),
    av: common_vendor.p({
      type: "bottom",
      ["border-radius"]: "10px 10px 0 0"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c7fdb702"]]);
wx.createPage(MiniProgramPage);
