"use strict";
const common_vendor = require("../../common/vendor.js");
const components_utils_request = require("../../components/utils/request.js");
const _sfc_main = {
  data() {
    return {
      textateaL: 0,
      maxlength: 200,
      receipt: {
        voucherList: []
      }
    };
  },
  computed: {
    discount() {
      if (this.receipt.totalAmount == 0 || typeof this.receipt.totalAmount == "undefined") {
        return "";
      }
      if (this.receipt.actualmoney == 0 || typeof this.receipt.actualmoney == "undefined") {
        return "";
      }
      let discount = this.receipt.actualmoney / this.receipt.totalAmount * 100;
      return discount == 0 ? "" : discount * 100;
    }
  },
  methods: {
    importOrder() {
      common_vendor.index.navigateTo({
        url: "/pages/receipt/import_order"
      });
    },
    getOrderById(orderId) {
      components_utils_request.post("receipt/selectOrderById", { "orderFormId": orderId }).then((res) => {
        if (200 == res.code) {
          this.receipt = res.data;
          common_vendor.index.hideLoading();
        }
      });
    },
    addReceiptForm() {
      components_utils_request.post("receipt/insertReceipt", JSON.stringify(this.receipt), "application/json").then((res) => {
        if (200 == res.code) {
          common_vendor.index.showToast({
            title: "添加收款单成功",
            icon: "none",
            duration: 2e3
          });
        }
      });
    },
    handInput(value) {
      let val = value.detail.value;
      this.textateaL = val.length;
    },
    onChooseImage() {
      common_vendor.index.chooseImage({
        count: 9,
        //最多可以选择的图片张
        sizeType: ["original", "compressed"],
        //original 原图，compressed 压缩图
        sourceType: ["album", "camera"],
        //album 从相册选图，camera 使用相机
        success: (res) => {
          let that = this;
          if (res.tempFilePaths.length > 0) {
            for (var i = 0; i < res.tempFilePaths.length; i++) {
              components_utils_request.uploadFiles("receipt/voucher", res.tempFiles[i].path).then((res2) => {
                if (200 == res2.code) {
                  that.receipt.voucherList = that.receipt.voucherList.concat(res2.data);
                  common_vendor.index.hideLoading();
                }
              });
            }
          }
        }
      });
    },
    //预览图片
    onPreviewImage(index) {
      let imageUrl = [];
      for (var i = 0; i < this.receipt.voucherList.length; i++) {
        imageUrl.push(this.receipt.voucherList[i].voucher);
      }
      common_vendor.index.previewImage({
        current: index,
        urls: imageUrl
      });
    },
    //删除指定图片
    onDeleteThis(index) {
      common_vendor.index.showModal({
        title: "提示",
        content: "您确定删除吗？",
        success: (res) => {
          if (res.confirm) {
            this.receipt.voucherList.splice(index, 1);
            common_vendor.wx$1.showToast({
              title: "删除成功",
              icon: "success",
              duration: 1e3
            });
          }
        }
      });
    },
    getVoucherUrl(image) {
      let baseUrl = this.BASEURL;
      let baseSubUrl = baseUrl.substring(0, baseUrl.length - 1);
      return baseSubUrl + image;
    },
    getImgUrl(image) {
      return this.BASEURL + image;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $options.getImgUrl("static/image/receipt/import-order.png"),
    b: $options.getImgUrl("static/image/receipt/add.png"),
    c: common_vendor.o(($event) => $options.importOrder()),
    d: $options.getImgUrl("static/image/order/order_number.png"),
    e: common_vendor.t($data.receipt.orderNumber),
    f: $options.getImgUrl("static/image/order/cusomer_name_add.png"),
    g: common_vendor.t($data.receipt.customerName),
    h: $options.getImgUrl("static/image/order/total_amount.png"),
    i: common_vendor.t($data.receipt.totalAmount),
    j: $options.getImgUrl("static/image/receipt/price_after_discount.png"),
    k: $options.discount,
    l: common_vendor.o(($event) => $options.discount = $event.detail.value),
    m: $options.getImgUrl("static/image/order/order_actual_amount.png"),
    n: common_vendor.t($data.receipt.actualmoney),
    o: $options.getImgUrl("static/image/order/order_actual_amount.png"),
    p: common_vendor.t($data.receipt.received),
    q: $options.getImgUrl("static/image/receipt/to_be_received.png"),
    r: common_vendor.t($data.receipt.tobeReceived),
    s: $options.getImgUrl("static/image/receipt/amount_collected.png"),
    t: $data.receipt.amountCollected,
    v: common_vendor.o(($event) => $data.receipt.amountCollected = $event.detail.value),
    w: common_vendor.f($data.receipt.voucherList, (item, index, i0) => {
      return {
        a: common_vendor.o(($event) => $options.onPreviewImage(index)),
        b: $options.getVoucherUrl(item.voucherUrl),
        c: common_vendor.o(($event) => $options.onDeleteThis(index))
      };
    }),
    x: common_vendor.o((...args) => $options.onChooseImage && $options.onChooseImage(...args)),
    y: $options.getImgUrl("static/image/receipt/upload-voucher.png"),
    z: common_vendor.o([($event) => $data.receipt.remark = $event.detail.value, (...args) => $options.handInput && $options.handInput(...args)]),
    A: $data.receipt.remark,
    B: common_vendor.t($data.textateaL),
    C: common_vendor.t($data.maxlength),
    D: common_vendor.o(($event) => $options.addReceiptForm())
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5d9c084a"]]);
wx.createPage(MiniProgramPage);
