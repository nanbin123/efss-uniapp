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
      },
      isEditable: true,
      amountCollectedFocus: false
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
  onLoad(option) {
    this.receipt.id = option.id;
    components_utils_request.post("receipt/selectReceiptById", { "id": this.receipt.id }).then((res) => {
      if (200 == res.code) {
        this.receipt = res.data;
        this.textateaL = this.receipt.remark.length;
      }
    });
  },
  methods: {
    editOrderForm() {
      if (this.isEditable == true) {
        this.isEditable = false;
      } else if (this.isEditable == false) {
        if (!this.receipt.amountCollected) {
          this.amountCollectedFocus = true;
          common_vendor.index.showToast({
            title: "收款金额不能为空",
            icon: "none"
          });
          return;
        }
        let receipt = {
          id: this.receipt.id,
          amountCollected: this.receipt.amountCollected,
          remark: this.receipt.remark
        };
        let voucherList = this.receipt.voucherList.map((item) => {
          return { id: item.id };
        });
        receipt.voucherList = voucherList;
        components_utils_request.post("receipt/updateReceiptById", JSON.stringify(receipt), "application/json").then((res) => {
          if (200 == res.code) {
            this.isEditable = true;
            common_vendor.index.showToast({
              title: "修改收款单成功",
              icon: "none",
              duration: 2e3
            });
          }
        });
      }
    },
    deleteReceipt() {
      let that = this;
      if (!that.receipt.id) {
        return;
      }
      if (this.isEditable == true) {
        common_vendor.index.showModal({
          title: "提示",
          content: "是否删除收款单",
          success: (res) => {
            if (res.confirm) {
              components_utils_request.post("receipt/deleteReceiptById", { "id": that.receipt.id }).then((res2) => {
                if (200 == res2.code) {
                  this.isEditable = true;
                  that.receipt = {};
                  common_vendor.index.showToast({
                    title: "删除收款单成功",
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
    handInput(value) {
      let val = value.detail.value;
      this.textateaL = val.length;
    },
    onChooseImage() {
      if (!this.isEditable) {
        common_vendor.index.chooseImage({
          count: 9,
          //最多可以选择的图片张
          sizeType: ["original", "compressed"],
          //original 原图，compressed 压缩图
          sourceType: ["album", "camera"],
          //album 从相册选图，camera 使用相机
          success: (res) => {
            if (res.tempFiles.length > 0) {
              for (var i = 0; i < res.tempFilePaths.length; i++) {
                components_utils_request.uploadFiles("receipt/voucher", res.tempFiles[i].path).then((res2) => {
                  if (200 == res2.code) {
                    let that = this;
                    that.receipt.voucherList = that.receipt.voucherList.concat(res2.data);
                    common_vendor.index.hideLoading();
                  }
                });
              }
            }
          }
        });
      }
    },
    //预览图片
    onPreviewImage(index) {
      let imageUrl = [];
      for (var i = 0; i < this.receipt.voucherList.length; i++) {
        let voucherUrl = this.getVoucherUrl(this.receipt.voucherList[i].voucherUrl);
        imageUrl.push(voucherUrl);
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
    a: $options.getImgUrl("static/image/order/order_number.png"),
    b: common_vendor.t($data.receipt.orderNumber),
    c: $options.getImgUrl("static/image/order/cusomer_name_add.png"),
    d: common_vendor.t($data.receipt.customerName),
    e: $options.getImgUrl("static/image/order/total_amount.png"),
    f: common_vendor.t($data.receipt.totalAmount),
    g: $options.getImgUrl("static/image/receipt/price_after_discount.png"),
    h: $options.discount,
    i: common_vendor.o(($event) => $options.discount = $event.detail.value),
    j: $options.getImgUrl("static/image/order/order_actual_amount.png"),
    k: common_vendor.t($data.receipt.actualmoney),
    l: $options.getImgUrl("static/image/order/order_actual_amount.png"),
    m: common_vendor.t($data.receipt.received),
    n: $options.getImgUrl("static/image/receipt/to_be_received.png"),
    o: common_vendor.t($data.receipt.tobeReceived),
    p: $options.getImgUrl("static/image/receipt/amount_collected.png"),
    q: $data.amountCollectedFocus,
    r: common_vendor.o(($event) => $data.amountCollectedFocus = false),
    s: $data.isEditable,
    t: $data.receipt.amountCollected,
    v: common_vendor.o(($event) => $data.receipt.amountCollected = $event.detail.value),
    w: common_vendor.f($data.receipt.voucherList, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.o(($event) => $options.onPreviewImage(index)),
        b: $options.getVoucherUrl(item.voucherUrl)
      }, !$data.isEditable ? {
        c: common_vendor.o(($event) => $options.onDeleteThis(index))
      } : {});
    }),
    x: !$data.isEditable,
    y: common_vendor.o((...args) => $options.onChooseImage && $options.onChooseImage(...args)),
    z: $options.getImgUrl("static/image/receipt/upload-voucher.png"),
    A: $data.isEditable,
    B: common_vendor.o([($event) => $data.receipt.remark = $event.detail.value, (...args) => $options.handInput && $options.handInput(...args)]),
    C: $data.receipt.remark,
    D: common_vendor.t($data.textateaL),
    E: common_vendor.t($data.maxlength),
    F: common_vendor.t($data.isEditable ? "删除" : "取消"),
    G: common_vendor.o(($event) => $options.deleteReceipt()),
    H: common_vendor.t($data.isEditable ? "编辑" : "保存"),
    I: common_vendor.o(($event) => $options.editOrderForm())
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-9b0cb02d"]]);
wx.createPage(MiniProgramPage);
