"use strict";
const common_vendor = require("../../common/vendor.js");
const components_utils_request = require("../../components/utils/request.js");
const _sfc_main = {
  data() {
    return {
      outbound: {},
      popupProduct: {
        orderProductId: "",
        productName: "",
        outboundNumber: ""
      }
    };
  },
  methods: {
    importOrder() {
      common_vendor.index.navigateTo({
        url: "/pages/outbound/import_order"
      });
    },
    open(item) {
      this.popupProduct.productName = item.productName;
      this.popupProduct.outboundNumber = item.outboundNumber;
      this.popupProduct.orderProductId = item.orderProductId;
      this.$refs.popup.open("center");
    },
    cancelTrack() {
      this.$refs.popup.close();
    },
    submitTrack() {
      let outboundProductList = this.outbound.outboundProductList;
      let orderProductId = this.popupProduct.orderProductId;
      let outboundProduct = outboundProductList.filter((obj) => obj.orderProductId == orderProductId)[0];
      outboundProduct.outboundNumber = this.popupProduct.outboundNumber;
      this.$refs.popup.close();
    },
    //确认
    confirm() {
      let outboundObj = new Object();
      outboundObj.orderId = this.outbound.orderId;
      let productChooseArray = this.outbound.outboundProductList;
      let outboundProductList = new Array();
      for (var i = 0; i < productChooseArray.length; i++) {
        let outboundProduct = new Object();
        outboundProduct.orderProductId = productChooseArray[i].id;
        outboundProduct.outboundNumber = productChooseArray[i].outboundNumber;
        outboundProductList.push(outboundProduct);
      }
      outboundObj.outboundProductList = outboundProductList;
      components_utils_request.post("outbound/insertOutbound", { "outboundJson": JSON.stringify(outboundObj) }).then((res) => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "出库单添加成功",
          icon: "none",
          duration: 2e3
        });
      });
    },
    getList(orderId) {
      components_utils_request.post("outbound/selectOrderById", { "orderFormId": orderId }).then((res) => {
        if (200 == res.code) {
          this.outbound = res.data;
        }
      });
    },
    getImgUrl(image) {
      return this.BASEURL + image;
    }
  }
};
if (!Array) {
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  _easycom_uni_popup2();
}
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  _easycom_uni_popup();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $options.getImgUrl("static/image/outbound/import_order.png"),
    b: $options.getImgUrl("static/image/receipt/add.png"),
    c: common_vendor.o(($event) => $options.importOrder()),
    d: $options.getImgUrl("static/image/outbound/order_number.png"),
    e: common_vendor.t($data.outbound.orderNumber),
    f: $options.getImgUrl("static/image/cusomer/cusomer_name.png"),
    g: common_vendor.t($data.outbound.customerName),
    h: $options.getImgUrl("static/image/cusomer/customer_phone.png"),
    i: common_vendor.t($data.outbound.phone),
    j: $options.getImgUrl("static/image/cusomer/cusomer_address.png"),
    k: common_vendor.t($data.outbound.address),
    l: $options.getImgUrl("static/image/outbound/sales_name.png"),
    m: common_vendor.t($data.outbound.orderOperator),
    n: $options.getImgUrl("static/image/outbound/sales_telephone.png"),
    o: common_vendor.t($data.outbound.orderOperatorPhone),
    p: $options.getImgUrl("static/image/outbound/product_details.png"),
    q: common_vendor.f($data.outbound.outboundProductList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.productName),
        b: common_vendor.t(item.type),
        c: common_vendor.t(item.size),
        d: common_vendor.t(item.production),
        e: common_vendor.t(item.color),
        f: common_vendor.t(item.texture),
        g: common_vendor.o(($event) => $options.open(item)),
        h: common_vendor.t(item.toBeShippedOutNumber),
        i: common_vendor.t(item.outboundNumber),
        j: common_vendor.o(($event) => $options.open(item))
      };
    }),
    r: $options.getImgUrl("static/image/茶几.png"),
    s: common_vendor.o(($event) => $options.confirm()),
    t: common_vendor.t($data.popupProduct.productName),
    v: $data.popupProduct.outboundNumber,
    w: common_vendor.o(($event) => $data.popupProduct.outboundNumber = $event.detail.value),
    x: common_vendor.o(($event) => $options.cancelTrack()),
    y: common_vendor.o(($event) => $options.submitTrack()),
    z: common_vendor.sr("popup", "8ab6731b-0"),
    A: common_vendor.p({
      type: "bottom",
      ["border-radius"]: "10px 10px 0 0"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-8ab6731b"]]);
wx.createPage(MiniProgramPage);
