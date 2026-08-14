"use strict";
const common_vendor = require("../../common/vendor.js");
const components_utils_request = require("../../components/utils/request.js");
const cPicker = () => "../../components/c-picker/c-picker.js";
const _sfc_main = {
  components: {
    cPicker
  },
  options: { styleIsolation: "shared" },
  data() {
    return {
      isEditable: true,
      warehousingEntry: { warehousingEntryProductList: [] }
    };
  },
  methods: {
    isDisabled(itemIsEdit) {
      if (this.isEditable) {
        return this.isEditable;
      } else {
        return itemIsEdit;
      }
    },
    onCheckchange(e, item) {
      item.isInWarehouse = e.detail.value.includes("isInWarehouse");
    },
    editWarehousing() {
      if (this.isEditable == true) {
        this.isEditable = false;
      } else if (this.isEditable == false) {
        const data = this.warehousingEntry.warehousingEntryProductList;
        const groupSum = data.reduce((result, currentItem) => {
          if (currentItem.isInWarehouse === true) {
            const group = currentItem["id"];
            result[group] = result[group] || { "id": group, "receivedQuantity": 0 };
            result[group].receivedQuantity++;
          }
          return result;
        }, {});
        let warehousingEntry = JSON.parse(JSON.stringify(this.warehousingEntry));
        warehousingEntry.warehousingEntryProductList = Object.keys(groupSum).map(function(key) {
          return groupSum[key];
        });
        components_utils_request.post("warehousing/updateWarehousingEntryById", JSON.stringify(warehousingEntry), "application/json").then((res) => {
          if (200 == res.code) {
            this.isEditable = true;
            common_vendor.index.showToast({
              title: "修改入库单成功",
              icon: "none",
              duration: 2e3
            });
          }
        });
      }
    },
    deleteWarehousing() {
      let _this = this;
      if (_this.isEditable == true) {
        common_vendor.index.showModal({
          title: "提示",
          content: "是否删除入库单",
          success: (res) => {
            if (res.confirm) {
              components_utils_request.post("warehousing/deleteWarehousingEntryById", { "id": _this.warehousingEntry.id }).then((res2) => {
                if (200 == res2.code) {
                  _this.isEditable = true;
                  _this.warehousingEntry = {};
                  common_vendor.index.showToast({
                    title: "删除入库单成功",
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
    toggle(val) {
      if (!this.isEditable) {
        this.$refs[val].show();
      }
    },
    deliveryHand(value) {
      this.warehousingEntry.recordDate = value.result;
    },
    isEmpty(str) {
      return typeof str === "undefined" || "" === str;
    },
    getImgUrl(image) {
      return this.BASEURL + image;
    }
  },
  onLoad(option) {
    this.warehousingEntry.id = option.id;
    components_utils_request.post("warehousing/selectWarehousingEntryById", { "id": this.warehousingEntry.id }).then((res) => {
      if (200 == res.code) {
        this.warehousingEntry.id = res.data.id;
        this.warehousingEntry.warehousingNumber = res.data.warehousingNumber;
        this.warehousingEntry.recordDate = res.data.recordDate;
        this.warehousingEntry.handledBy = res.data.handledBy;
        this.warehousingEntry.supplier = res.data.supplier;
        this.warehousingEntry.remark = res.data.remark;
        let dataProduct = res.data.warehousingEntryProductList;
        for (var i = 0; i < dataProduct.length; i++) {
          let receivedQuantity = dataProduct[i].receivedQuantity;
          for (var j = 0; j < receivedQuantity; j++) {
            let warehousingEntryProduct = JSON.parse(JSON.stringify(dataProduct[i]));
            warehousingEntryProduct.isInWarehouse = true;
            warehousingEntryProduct.isEdit = true;
            this.warehousingEntry.warehousingEntryProductList.push(warehousingEntryProduct);
          }
          let unInventoryQuantity = dataProduct[i].inventoryQuantity - receivedQuantity;
          for (var k = 0; k < unInventoryQuantity; k++) {
            let warehousingEntryProduct = JSON.parse(JSON.stringify(dataProduct[i]));
            warehousingEntryProduct.isInWarehouse = false;
            warehousingEntryProduct.isEdit = false;
            this.warehousingEntry.warehousingEntryProductList.push(warehousingEntryProduct);
          }
        }
      }
    });
  }
};
if (!Array) {
  const _component_cPicker = common_vendor.resolveComponent("cPicker");
  _component_cPicker();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $options.getImgUrl("static/image/warehousing/warehousing-number.png"),
    b: common_vendor.t($data.warehousingEntry.warehousingNumber),
    c: $options.getImgUrl("static/image/warehousing/record_date.png"),
    d: common_vendor.t($options.isEmpty($data.warehousingEntry.recordDate) ? "请选择记录日期" : $data.warehousingEntry.recordDate),
    e: common_vendor.o(($event) => $options.toggle("record_date")),
    f: $options.isEmpty($data.warehousingEntry.recordDate) ? "#a0a0a0" : "#333",
    g: common_vendor.sr("record_date", "3a2ab797-0"),
    h: common_vendor.o($options.deliveryHand),
    i: common_vendor.p({
      mode: "date",
      pageData: $data.warehousingEntry.recordDate
    }),
    j: $options.getImgUrl("static/image/warehousing/handled_by.png"),
    k: common_vendor.t($data.warehousingEntry.handledBy),
    l: $options.getImgUrl("static/image/warehousing/supplier.png"),
    m: common_vendor.t($data.warehousingEntry.supplier),
    n: $options.getImgUrl("static/image/warehousing/warehousing-number.png"),
    o: $data.isEditable,
    p: $data.warehousingEntry.remark,
    q: common_vendor.o(($event) => $data.warehousingEntry.remark = $event.detail.value),
    r: $options.getImgUrl("static/image/warehousing/choose_product.png"),
    s: common_vendor.f($data.warehousingEntry.warehousingEntryProductList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.productName),
        b: common_vendor.t(item.type),
        c: common_vendor.t(item.production),
        d: common_vendor.t(item.color),
        e: common_vendor.t(item.texture),
        f: common_vendor.t(item.size),
        g: common_vendor.t(item.isInWarehouse == true ? "已入库" : "未入库"),
        h: item.isInWarehouse,
        i: $options.isDisabled(item.isEdit),
        j: common_vendor.o(($event) => $options.onCheckchange($event, item))
      };
    }),
    t: common_vendor.o((...args) => _ctx.onReachBottom && _ctx.onReachBottom(...args)),
    v: common_vendor.t($data.isEditable ? "删除" : "取消"),
    w: common_vendor.o(($event) => $options.deleteWarehousing()),
    x: common_vendor.t($data.isEditable ? "编辑" : "保存"),
    y: common_vendor.o(($event) => $options.editWarehousing())
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-3a2ab797"]]);
wx.createPage(MiniProgramPage);
