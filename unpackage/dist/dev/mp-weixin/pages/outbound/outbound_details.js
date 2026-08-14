"use strict";
const common_vendor = require("../../common/vendor.js");
const components_utils_request = require("../../components/utils/request.js");
const _sfc_main = {
  data() {
    return {
      outbound: { outboundProductList: [] },
      isEditable: true
    };
  },
  methods: {
    checkOutboundProduct(item) {
      if (!this.isEditable) {
        item.isOutbound = !item.isOutbound;
      }
    },
    onCheckchange(e, item) {
      item.isOutbound = e.detail.value.includes("isOutbound");
    },
    isDisabled(itemIsEdit) {
      if (this.isEditable) {
        return this.isEditable;
      } else {
        return itemIsEdit;
      }
    },
    //修改操作
    editOutbound() {
      if (this.isEditable == true) {
        this.isEditable = false;
      } else if (this.isEditable == false) {
        const data = this.outbound.outboundProductList;
        const groupSum = data.reduce((result, currentItem) => {
          if (currentItem.isOutbound === true && currentItem.isEdit === false) {
            const group = currentItem["id"];
            result[group] = result[group] || { "id": group, "outboundNumber": 0 };
            result[group].outboundNumber++;
          }
          return result;
        }, {});
        let outboundProductList = Object.keys(groupSum).map(function(key) {
          return groupSum[key];
        });
        components_utils_request.post("outbound/updateOutboundNumber", JSON.stringify(outboundProductList), "application/json").then((res) => {
          if (200 == res.code) {
            this.getOutboundById();
            this.isEditable = true;
            common_vendor.index.showToast({
              title: "出库成功",
              icon: "none",
              duration: 2e3
            });
          }
        });
      }
    },
    deleteOutbound() {
      let _this = this;
      if (_this.isEditable == true) {
        common_vendor.index.showModal({
          title: "提示",
          content: "是否删除出库单",
          success: (res) => {
            if (res.confirm) {
              components_utils_request.post("outbound/deleteOutboundById", { "id": _this.outbound.id }).then((res2) => {
                if (200 == res2.code) {
                  _this.isEditable = true;
                  _this.outbound = {};
                  common_vendor.index.showToast({
                    title: "删除出库单成功",
                    icon: "none",
                    duration: 2e3
                  });
                }
              });
            }
          }
        });
      } else if (_this.isEditable == false) {
        _this.isEditable = true;
      }
    },
    getOutboundById() {
      components_utils_request.post("outbound/selectOutboundById", { "id": this.outbound.id }).then((res) => {
        if (200 == res.code) {
          this.outbound = { outboundProductList: [] };
          let resData = res.data;
          console.log("resData", JSON.stringify(resData));
          this.outbound.id = resData.id;
          this.outbound.orderNumber = resData.orderNumber;
          this.outbound.customerName = resData.customerName;
          this.outbound.phone = resData.phone;
          this.outbound.address = resData.address;
          this.outbound.orderOperator = resData.orderOperator;
          this.outbound.orderOperatorPhone = resData.orderOperatorPhone;
          let dataProduct = res.data.outboundProductList;
          for (var i = 0; i < dataProduct.length; i++) {
            let outboundNumber = dataProduct[i].outboundNumber;
            console.log("outboundNumber", outboundNumber);
            for (var j = 0; j < outboundNumber; j++) {
              let outboundProduct = JSON.parse(JSON.stringify(dataProduct[i]));
              outboundProduct.isOutbound = true;
              outboundProduct.isEdit = true;
              this.outbound.outboundProductList.push(outboundProduct);
            }
            let orderProductNumber = dataProduct[i].orderProductNumber;
            let toBeShippedOutNumber = orderProductNumber - outboundNumber;
            for (var j = 0; j < toBeShippedOutNumber; j++) {
              let outboundProduct = JSON.parse(JSON.stringify(dataProduct[i]));
              outboundProduct.isOutbound = false;
              outboundProduct.isEdit = false;
              this.outbound.outboundProductList.push(outboundProduct);
            }
          }
        }
      });
    },
    getImgUrl(image) {
      return this.BASEURL + image;
    }
  },
  onLoad(option) {
    this.outbound.id = option.id;
    this.getOutboundById();
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $options.getImgUrl("static/image/outbound/order_number.png"),
    b: common_vendor.t($data.outbound.orderNumber),
    c: $options.getImgUrl("static/image/cusomer/cusomer_name.png"),
    d: common_vendor.t($data.outbound.customerName),
    e: $options.getImgUrl("static/image/cusomer/customer_phone.png"),
    f: common_vendor.t($data.outbound.phone),
    g: $options.getImgUrl("static/image/cusomer/cusomer_address.png"),
    h: common_vendor.t($data.outbound.address),
    i: $options.getImgUrl("static/image/outbound/sales_name.png"),
    j: common_vendor.t($data.outbound.orderOperator),
    k: $options.getImgUrl("static/image/outbound/sales_telephone.png"),
    l: common_vendor.t($data.outbound.orderOperatorPhone),
    m: $options.getImgUrl("static/image/outbound/product_details.png"),
    n: common_vendor.f($data.outbound.outboundProductList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.productName),
        b: common_vendor.t(item.type),
        c: common_vendor.t(item.size),
        d: common_vendor.t(item.production),
        e: common_vendor.t(item.color),
        f: common_vendor.t(item.texture),
        g: common_vendor.o(($event) => $options.checkOutboundProduct(item)),
        h: common_vendor.t(item.orderProductNumber),
        i: common_vendor.t(item.isOutbound == true ? "已出库" : "未出库"),
        j: common_vendor.o(($event) => _ctx.open(item)),
        k: item.isOutbound,
        l: $options.isDisabled(item.isEdit),
        m: common_vendor.o(($event) => $options.onCheckchange($event, item))
      };
    }),
    o: $options.getImgUrl("static/image/茶几.png"),
    p: common_vendor.o((...args) => _ctx.onReachBottom && _ctx.onReachBottom(...args)),
    q: common_vendor.t($data.isEditable ? "删除" : "取消"),
    r: common_vendor.o(($event) => $options.deleteOutbound()),
    s: common_vendor.t($data.isEditable ? "编辑" : "保存"),
    t: common_vendor.o(($event) => $options.editOutbound())
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-b3cf1138"]]);
wx.createPage(MiniProgramPage);
