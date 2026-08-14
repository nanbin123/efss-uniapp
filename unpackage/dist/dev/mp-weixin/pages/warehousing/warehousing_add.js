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
      warehousingEntry: {},
      popupProduct: {
        productId: "",
        productName: "",
        inventoryQuantity: ""
      }
    };
  },
  setup() {
    const productStore = store_modules_product.useProductStore();
    return { productStore };
  },
  methods: {
    //选择产品
    addWarehousingProduct() {
      let warehousingEntryProductList = this.warehousingEntry.warehousingEntryProductList;
      if (!!warehousingEntryProductList) {
        this.productStore.addProduct(warehousingEntryProductList);
      }
      common_vendor.index.navigateTo({
        url: "/pages/warehousing/warehousing_product"
      });
    },
    getWarehousingProduct() {
      let products = JSON.stringify(this.productStore.products);
      this.warehousingEntry.warehousingEntryProductList = JSON.parse(products);
    },
    //确认提交 订单
    addWarehousing() {
      let warehousingEntryObj = JSON.parse(JSON.stringify(this.warehousingEntry));
      let productInfo = warehousingEntryObj.warehousingEntryProductList.map((map) => {
        return { productId: map.productId, inventoryQuantity: map.inventoryQuantity };
      });
      warehousingEntryObj.warehousingEntryProductList = productInfo;
      components_utils_request.post("warehousing/insertWarehousingEntry", JSON.stringify(warehousingEntryObj), "application/json").then((res) => {
        if (200 == res.code) {
          common_vendor.index.showToast({
            title: "添加入库单成功",
            icon: "none",
            duration: 2e3
          });
          this.warehousingEntry = "";
        }
      });
    },
    open(item) {
      this.popupProduct.productName = item.productName;
      this.popupProduct.inventoryQuantity = item.inventoryQuantity;
      this.popupProduct.productId = item.productId;
      this.$refs.popup.open("center");
    },
    cancelTrack() {
      this.$refs.popup.close();
    },
    submitTrack() {
      let warehousingEntryProductList = this.warehousingEntry.warehousingEntryProductList;
      let productId = this.popupProduct.productId;
      let warehousingEntryProduct = warehousingEntryProductList.filter((obj) => obj.productId == productId)[0];
      warehousingEntryProduct.inventoryQuantity = this.popupProduct.inventoryQuantity;
      this.$refs.popup.close();
    },
    recordDateHand(value) {
      this.warehousingEntry.recordDate = value.result;
    },
    //时间弹窗
    toggle(val) {
      this.$refs[val].show();
    },
    isEmpty(str) {
      return typeof str === "undefined" || "" === str;
    },
    getImgUrl(image) {
      return this.BASEURL + image;
    }
  },
  onLoad() {
    let date = /* @__PURE__ */ new Date();
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    let formattedDate = `${year}-${month}-${day}`;
    this.warehousingEntry.recordDate = formattedDate;
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
    a: $options.getImgUrl("static/image/warehousing/record_date.png"),
    b: common_vendor.t($options.isEmpty($data.warehousingEntry.recordDate) ? "请选择" : $data.warehousingEntry.recordDate),
    c: common_vendor.o(($event) => $options.toggle("record_date")),
    d: $options.isEmpty($data.warehousingEntry.recordDate) ? "#a0a0a0" : "#333",
    e: common_vendor.sr("record_date", "8e2422c0-0"),
    f: common_vendor.o($options.recordDateHand),
    g: common_vendor.p({
      mode: "date"
    }),
    h: $options.getImgUrl("static/image/warehousing/supplier.png"),
    i: $data.warehousingEntry.supplier,
    j: common_vendor.o(($event) => $data.warehousingEntry.supplier = $event.detail.value),
    k: $options.getImgUrl("static/image/warehousing/warehousing-number.png"),
    l: $data.warehousingEntry.remark,
    m: common_vendor.o(($event) => $data.warehousingEntry.remark = $event.detail.value),
    n: $options.getImgUrl("static/image/warehousing/choose_product.png"),
    o: $options.getImgUrl("static/image/add.png"),
    p: common_vendor.o(($event) => $options.addWarehousingProduct()),
    q: common_vendor.f($data.warehousingEntry.warehousingEntryProductList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.productName),
        b: common_vendor.t(item.type),
        c: common_vendor.t(item.size),
        d: common_vendor.t(item.production),
        e: common_vendor.t(item.color),
        f: common_vendor.t(item.texture),
        g: common_vendor.t(item.retailPrice),
        h: common_vendor.t(item.inventoryQuantity),
        i: common_vendor.o(($event) => $options.open(item))
      };
    }),
    r: $options.getImgUrl("static/image/茶几.png"),
    s: common_vendor.o(($event) => $options.addWarehousing()),
    t: common_vendor.t($data.popupProduct.productName),
    v: $data.popupProduct.inventoryQuantity,
    w: common_vendor.o(($event) => $data.popupProduct.inventoryQuantity = $event.detail.value),
    x: common_vendor.o(($event) => $options.cancelTrack()),
    y: common_vendor.o(($event) => $options.submitTrack()),
    z: common_vendor.sr("popup", "8e2422c0-1"),
    A: common_vendor.p({
      type: "bottom",
      ["border-radius"]: "10px 10px 0 0"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-8e2422c0"]]);
wx.createPage(MiniProgramPage);
