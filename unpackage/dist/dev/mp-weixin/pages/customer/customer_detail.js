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
  data() {
    this.getDate({
      format: true
    });
    return {
      isEditable: true,
      fullStarUrl: "static/image/cusomer/star.png",
      nullStarUrl: "static/image/cusomer/empty.png",
      customer: { customerProducts: [], listCustomerArrival: [], listCustomerTailAfter: [] },
      //客户数据
      addOrEditArrival: "",
      arrivalFormData: {
        id: "",
        customerId: "",
        arrivalTime: "",
        arrivalLength: "",
        arrivalRecord: "",
        arrivalType: ""
      },
      tailAfterFormData: {
        id: "",
        customerId: "",
        arrivalTime: "",
        arrivalLength: "",
        arrivalRecord: "",
        arrivalType: ""
      },
      popupProduct: {
        productId: "",
        productName: "",
        number: ""
      },
      customerId: "",
      //存放列表传来的意向客户id
      customerNameFocus: true,
      phoneFocus: false
    };
  },
  setup() {
    const productStore = store_modules_product.useProductStore();
    const transferOrderStore = store_modules_transfer_order.useTransferOrderStore();
    return { productStore, transferOrderStore };
  },
  methods: {
    //获取商品第一张图片（空数组时显示默认图）
    getProductImg(item) {
      if (item.productImages && item.productImages.length > 0) {
        let url = item.productImages[0].productUrl;
        return this.BASEURL + (url.startsWith("/") ? url.substring(1) : url);
      }
      return this.getImgUrl("static/image/茶几.png");
    },
    // 点击放大预览，支持左右滑动切换所有图片
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
    // 校验电话号码
    checkPhone() {
      this.phoneFocus = false;
      const reg = /^(1[3-9]\d{9})|(0\d{2,3}-?\d{7,8})$/;
      this.phoneError = !reg.test(this.customer.phone);
      if (this.phoneError) {
        common_vendor.index.showToast({
          title: "请输入有效的电话号码",
          icon: "none"
        });
      }
    },
    //移除指定产品
    deleteProduct(productId) {
      let customerProducts = this.customer.customerProducts;
      this.customer.customerProducts = customerProducts.filter((obj) => obj.productId != productId);
    },
    //移除指定跟踪记录
    deleteCustomerTailAfter(id) {
      let customerTailAfters = this.customer.listCustomerTailAfter;
      this.customer.listCustomerTailAfter = customerTailAfters.filter((obj) => obj.id != id);
    },
    //移除指定到店记录
    deleteCustomerArrival(id) {
      let customerarrivals = this.customer.listCustomerArrival;
      this.customer.listCustomerArrival = customerarrivals.filter((obj) => obj.id != id);
    },
    editCustomerForm() {
      if (this.isEditable == true) {
        this.isEditable = false;
      } else if (this.isEditable == false) {
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
        if (!this.customer.phone) {
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
        let customerForm = JSON.parse(JSON.stringify(this.customer));
        let customerProductList = customerForm.customerProducts.map((item) => {
          return { productId: item.productId, number: item.number };
        });
        customerForm.customerProducts = customerProductList;
        components_utils_request.post("customer/updateCustomerById", JSON.stringify(this.customer), "application/json").then((res) => {
          if (200 == res.code) {
            this.isEditable = true;
            common_vendor.index.showToast({
              title: "修改客户成功",
              icon: "none",
              duration: 2e3
            });
          }
        });
      }
    },
    //客户性别点击触发事件
    radioChange(evt) {
      this.customer.sex = evt.detail.value;
    },
    deleteCustomerForm() {
      let that = this;
      if (this.isEditable == true) {
        common_vendor.index.showModal({
          title: "提示",
          content: "是否删除客户吗？",
          success: (res) => {
            if (res.confirm) {
              components_utils_request.post("customer/deleteCustomerById", { "id": that.customer.id }).then((res2) => {
                if (200 == res2.code) {
                  this.isEditable = true;
                  that.customer = {};
                  common_vendor.index.showToast({
                    title: "删除客户成功",
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
    getDate() {
      const date = /* @__PURE__ */ new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      month = month > 9 ? month : "0" + month;
      day = day > 9 ? day : "0" + day;
      return `${year}-${month}-${day}`;
    },
    //时间选择
    toggle(val) {
      this.$refs[val].show();
    },
    tailAfterToggle(val) {
      this.$refs[val].show();
    },
    arrivalTimeHand(value) {
      this.arrivalFormData.arrivalTime = value.result;
    },
    tailAfterTimeHand(value) {
      this.tailAfterFormData.arrivalTime = value.result;
    },
    //意向程度
    changeStar(val) {
      if (this.isEditable == false) {
        this.customer.grade = val;
      }
    },
    //提交到店记录
    submitArrival() {
      let arrivalFormData = JSON.parse(JSON.stringify(this.arrivalFormData));
      arrivalFormData.customerId = this.customer.id;
      let listCustomerArrival = this.customer.listCustomerArrival;
      if ("添加到店记录" == this.addOrEditArrival) {
        listCustomerArrival.unshift(arrivalFormData);
      } else if ("修改到店记录" == this.addOrEditArrival) {
        this.customer.listCustomerArrival = listCustomerArrival.map((item) => item.id == arrivalFormData.id ? arrivalFormData : item);
      }
      let that = this;
      Object.keys(this.arrivalFormData).forEach(function(key) {
        that.arrivalFormData[key] = "";
      });
      this.$refs.arrival_popup.close();
    },
    //添加到店记录
    arriveAdd() {
      if (this.isEditable == false) {
        this.addOrEditArrival = "添加到店记录";
        this.arrivalFormData.arrivalTime = this.getDate();
        this.arrivalFormData.arrivalType = "arrival";
        this.$refs.arrival_popup.open("center");
      }
    },
    cancelArrival() {
      let that = this;
      Object.keys(this.arrivalFormData).forEach(function(key) {
        that.arrivalFormData[key] = "";
      });
      this.$refs.arrival_popup.close();
    },
    //修改到店记录
    editCustomerArrival(item) {
      this.addOrEditArrival = "修改到店记录";
      if (this.isEditable == false) {
        this.$refs.arrival_popup.open("center");
        this.arrivalFormData.id = item.id;
        this.arrivalFormData.arrivalType = "arrival";
        this.arrivalFormData.customerId = item.customerId;
        this.arrivalFormData.arrivalTime = item.arrivalTime;
        this.arrivalFormData.arrivalLength = item.arrivalLength;
        this.arrivalFormData.arrivalRecord = item.arrivalRecord;
      }
    },
    //添加跟踪记录
    trackAdd() {
      if (this.isEditable == false) {
        this.addOrEditArrival = "添加跟踪记录";
        this.tailAfterFormData.arrivalTime = this.getDate();
        this.tailAfterFormData.arrivalType = "tailafter";
        this.$refs.tailafter_popup.open("center");
      }
    },
    cancelTrack() {
      let that = this;
      Object.keys(this.tailAfterFormData).forEach(function(key) {
        that.tailAfterFormData[key] = "";
      });
      this.$refs.tailafter_popup.close();
    },
    //提交跟踪记录 
    submitTrack() {
      let tailAfterFormData = JSON.parse(JSON.stringify(this.tailAfterFormData));
      tailAfterFormData.customerId = this.customer.id;
      let listCustomerTailAfter = this.customer.listCustomerTailAfter;
      if ("添加跟踪记录" == this.addOrEditArrival) {
        listCustomerTailAfter.unshift(tailAfterFormData);
      } else if ("修改跟踪记录" == this.addOrEditArrival) {
        this.customer.listCustomerTailAfter = listCustomerTailAfter.map((item) => item.id == tailAfterFormData.id ? tailAfterFormData : item);
      }
      let that = this;
      Object.keys(this.tailAfterFormData).forEach(function(key) {
        that.tailAfterFormData[key] = "";
      });
      this.$refs.tailafter_popup.close();
    },
    editCustomerTailAfter(item) {
      this.addOrEditArrival = "修改跟踪记录";
      if (this.isEditable == false) {
        this.tailAfterFormData.id = item.id;
        this.tailAfterFormData.arrivalType = "tailafter";
        this.tailAfterFormData.customerId = item.customerId;
        this.tailAfterFormData.arrivalTime = item.arrivalTime;
        this.tailAfterFormData.arrivalLength = item.arrivalLength;
        this.tailAfterFormData.arrivalRecord = item.arrivalRecord;
        this.$refs.tailafter_popup.open("center");
      }
    },
    getCustomerProduct() {
      let products = JSON.stringify(this.productStore.products);
      common_vendor.index.__f__("log", "at pages/customer/customer_detail.vue:523", JSON.stringify(products));
      this.customer.customerProducts = JSON.parse(products);
    },
    addCustomerProduct() {
      if (this.isEditable == false) {
        let customerProductList = this.customer.customerProducts;
        if (!!customerProductList) {
          this.productStore.addProduct(customerProductList);
        }
        common_vendor.index.navigateTo({
          url: "/pages/customer/customer_product"
        });
      }
    },
    // 产品修改数量弹窗
    openPopupProductNumber(item) {
      this.popupProduct.productName = item.productName;
      this.popupProduct.number = item.number;
      this.popupProduct.productId = item.productId;
      this.$refs.popup_product_number.open("center");
    },
    cancelProductNumber() {
      let that = this;
      Object.keys(this.popupProduct).forEach(function(key) {
        that.popupProduct[key] = "";
      });
      this.$refs.popup_product_number.close("center");
    },
    submitProductNumber() {
      let customerProductList = this.customer.customerProducts;
      let productId = this.popupProduct.productId;
      let customerProduct = customerProductList.filter((obj) => obj.productId == productId)[0];
      customerProduct.number = this.popupProduct.number;
      this.$refs.popup_product_number.close();
    },
    /**
     * 转订单
     */
    transferOrder() {
      let customerForm = new Object();
      customerForm.customerName = this.customer.customerName;
      customerForm.sex = this.customer.sex;
      customerForm.phone = this.customer.phone;
      customerForm.address = this.customer.address;
      customerForm.id = this.customer.id;
      customerForm.customerProducts = this.customer.customerProducts;
      this.transferOrderStore.addCustomer(customerForm);
      if (this.isEditable == true) {
        common_vendor.index.navigateTo({
          url: "/pages/order/order_add"
        });
      }
    },
    getImgUrl(image) {
      return this.BASEURL + image;
    }
  },
  watch: {},
  onLoad(option) {
    this.customerId = option.id;
    components_utils_request.post("customer/selectCustomerById", { "id": this.customerId }).then((res) => {
      if (200 == res.code) {
        this.customer = res.data || {};
      }
    });
  },
  computed: {}
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
  return common_vendor.e({
    a: $data.customerNameFocus,
    b: common_vendor.o(($event) => $data.customerNameFocus = false, "33"),
    c: $data.isEditable,
    d: $data.isEditable ? "" : "请输入客户姓名",
    e: $data.customer.customerName,
    f: common_vendor.o(($event) => $data.customer.customerName = $event.detail.value, "1a"),
    g: $data.customer.sex === "1" ? "#fff" : "#333",
    h: $data.isEditable,
    i: $data.customer.sex === "1" ? "#38c1b9" : "#fff",
    j: $data.customer.sex === "1",
    k: $data.customer.sex === "2" ? "#fff" : "#333",
    l: $data.isEditable,
    m: $data.customer.sex === "2" ? "#38c1b9" : "#fff",
    n: $data.customer.sex === "2",
    o: common_vendor.o((...args) => $options.radioChange && $options.radioChange(...args), "bb"),
    p: $data.phoneFocus,
    q: common_vendor.o((...args) => $options.checkPhone && $options.checkPhone(...args), "f2"),
    r: $data.isEditable,
    s: $data.customer.phone,
    t: common_vendor.o(($event) => $data.customer.phone = $event.detail.value, "5a"),
    v: $data.isEditable,
    w: $data.customer.address,
    x: common_vendor.o(($event) => $data.customer.address = $event.detail.value, "9d"),
    y: common_vendor.o(($event) => $options.changeStar(1), "e9"),
    z: $data.customer.grade > 0 ? _ctx.BASEURL + $data.fullStarUrl : _ctx.BASEURL + $data.nullStarUrl,
    A: common_vendor.o(($event) => $options.changeStar(2), "85"),
    B: $data.customer.grade > 1 ? _ctx.BASEURL + $data.fullStarUrl : _ctx.BASEURL + $data.nullStarUrl,
    C: common_vendor.o(($event) => $options.changeStar(3), "0d"),
    D: $data.customer.grade > 2 ? _ctx.BASEURL + $data.fullStarUrl : _ctx.BASEURL + $data.nullStarUrl,
    E: $data.isEditable,
    F: $data.customer.quotation,
    G: common_vendor.o(($event) => $data.customer.quotation = $event.detail.value, "09"),
    H: $data.isEditable,
    I: $data.customer.remark,
    J: common_vendor.o(($event) => $data.customer.remark = $event.detail.value, "7b"),
    K: !$data.isEditable
  }, !$data.isEditable ? {} : {}, {
    L: common_vendor.o(($event) => $options.arriveAdd(), "6f"),
    M: common_vendor.f($data.customer.listCustomerArrival, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.arrivalTime),
        b: common_vendor.t(item.arrivalLength),
        c: common_vendor.o(($event) => $options.editCustomerArrival(item), "d4"),
        d: common_vendor.t(item.arrivalRecord)
      }, !$data.isEditable ? {
        e: common_vendor.o(($event) => $options.deleteCustomerArrival(item.id), "ac")
      } : {}, {
        f: item.id
      });
    }),
    N: !$data.isEditable,
    O: !$data.isEditable
  }, !$data.isEditable ? {} : {}, {
    P: common_vendor.o(($event) => $options.trackAdd(), "47"),
    Q: common_vendor.f($data.customer.listCustomerTailAfter, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.arrivalTime),
        b: common_vendor.t(item.arrivalLength),
        c: common_vendor.t(item.arrivalRecord)
      }, !$data.isEditable ? {
        d: common_vendor.o(($event) => $options.deleteCustomerTailAfter(item.id), "68")
      } : {}, {
        e: common_vendor.o(($event) => $options.editCustomerTailAfter(item), "9b"),
        f: item.id
      });
    }),
    R: !$data.isEditable,
    S: !$data.isEditable
  }, !$data.isEditable ? {} : {}, {
    T: common_vendor.o(($event) => $options.addCustomerProduct(), "79"),
    U: common_vendor.f($data.customer.customerProducts, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.productName),
        b: common_vendor.t(item.type),
        c: common_vendor.t(item.size),
        d: common_vendor.t(item.production),
        e: common_vendor.t(item.texture),
        f: common_vendor.t(item.color),
        g: common_vendor.t(item.number),
        h: common_vendor.t(item.retailPrice),
        i: common_vendor.o(($event) => $options.openPopupProductNumber(item), item.productId || index)
      }, !$data.isEditable ? {
        j: common_vendor.o(($event) => $options.deleteProduct(item.productId), item.productId || index)
      } : {}, {
        k: item.productImages && item.productImages.length
      }, item.productImages && item.productImages.length ? {
        l: common_vendor.t(item.productImages.length)
      } : {}, {
        m: common_vendor.o(($event) => $options.previewImage(item), item.productId || index),
        n: item.productId || index
      });
    }),
    V: !$data.isEditable,
    W: common_vendor.t($data.isEditable ? "删除" : "取消"),
    X: common_vendor.o(($event) => $options.deleteCustomerForm(), "aa"),
    Y: $data.isEditable == true
  }, $data.isEditable == true ? {
    Z: common_vendor.o(($event) => $options.transferOrder(), "09")
  } : {}, {
    aa: common_vendor.t($data.isEditable ? "编辑" : "保存"),
    ab: common_vendor.o(($event) => $options.editCustomerForm(), "5e"),
    ac: common_vendor.t($data.addOrEditArrival),
    ad: common_vendor.t($data.arrivalFormData.arrivalTime),
    ae: common_vendor.o(($event) => $options.toggle("arrival_date"), "70"),
    af: $data.arrivalFormData.arrivalTime == "yyyy-MM-dd" ? "#a0a0a0" : "#333",
    ag: common_vendor.sr("arrival_date", "50fb23cd-1,50fb23cd-0"),
    ah: common_vendor.o($options.arrivalTimeHand, "cf"),
    ai: common_vendor.p({
      mode: "date"
    }),
    aj: $data.arrivalFormData.arrivalLength,
    ak: common_vendor.o(($event) => $data.arrivalFormData.arrivalLength = $event.detail.value, "c0"),
    al: $data.arrivalFormData.arrivalRecord,
    am: common_vendor.o(($event) => $data.arrivalFormData.arrivalRecord = $event.detail.value, "7b"),
    an: common_vendor.o(($event) => $options.cancelArrival(), "a5"),
    ao: common_vendor.o(($event) => $options.submitArrival(), "18"),
    ap: common_vendor.sr("arrival_popup", "50fb23cd-0"),
    aq: common_vendor.p({
      type: "bottom",
      ["border-radius"]: "10px 10px 0 0"
    }),
    ar: common_vendor.t($data.addOrEditArrival),
    as: common_vendor.t($data.tailAfterFormData.arrivalTime),
    at: common_vendor.o(($event) => $options.tailAfterToggle("tail_after_date"), "41"),
    av: $data.tailAfterFormData.arrivalTime == "yyyy-MM-dd" ? "#a0a0a0" : "#333",
    aw: common_vendor.sr("tail_after_date", "50fb23cd-3,50fb23cd-2"),
    ax: common_vendor.o($options.tailAfterTimeHand, "c1"),
    ay: common_vendor.p({
      mode: "date"
    }),
    az: $data.tailAfterFormData.arrivalLength,
    aA: common_vendor.o(($event) => $data.tailAfterFormData.arrivalLength = $event.detail.value, "8b"),
    aB: $data.tailAfterFormData.arrivalRecord,
    aC: common_vendor.o(($event) => $data.tailAfterFormData.arrivalRecord = $event.detail.value, "d8"),
    aD: common_vendor.o(($event) => $options.cancelTrack(), "43"),
    aE: common_vendor.o(($event) => $options.submitTrack(), "e0"),
    aF: common_vendor.sr("tailafter_popup", "50fb23cd-2"),
    aG: common_vendor.p({
      type: "bottom",
      ["border-radius"]: "10px 10px 0 0"
    }),
    aH: common_vendor.t($data.popupProduct.productName),
    aI: $data.popupProduct.number,
    aJ: common_vendor.o(($event) => $data.popupProduct.number = $event.detail.value, "f2"),
    aK: common_vendor.o(($event) => $options.cancelProductNumber(), "6a"),
    aL: common_vendor.o(($event) => $options.submitProductNumber(), "00"),
    aM: common_vendor.sr("popup_product_number", "50fb23cd-4"),
    aN: common_vendor.p({
      type: "bottom",
      ["border-radius"]: "10px 10px 0 0"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-50fb23cd"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/customer/customer_detail.js.map
