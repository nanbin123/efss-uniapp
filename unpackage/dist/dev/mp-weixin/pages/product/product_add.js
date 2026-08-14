"use strict";
const common_vendor = require("../../common/vendor.js");
const components_utils_request = require("../../components/utils/request.js");
const _sfc_main = {
  data() {
    return {
      product: {
        productName: "",
        type: "",
        size: "",
        production: "",
        productType: "",
        color: "",
        texture: "",
        stock: 0,
        retailPrice: "",
        purchasePrice: "",
        category: "",
        productCategoryId: "",
        productImages: []
      },
      productNameFocus: true
    };
  },
  methods: {
    productAdd() {
      if (!this.product.productName) {
        this.productNameFocus = true;
        common_vendor.index.showToast({
          title: "品名不能为空",
          icon: "none"
        });
        return;
      }
      components_utils_request.post("product/insertProduct", JSON.stringify(this.product), "application/json").then((res) => {
        if (200 == res.code) {
          let _this = this;
          Object.keys(_this.product).forEach(function(key) {
            if ("productImages" == key) {
              _this.product[key] = [];
            } else if ("stock" == key) {
              _this.product[key] = 0;
            } else {
              _this.product[key] = "";
            }
          });
          common_vendor.index.showToast({
            title: "添加产品成功",
            icon: "none",
            duration: 2e3
          });
        }
      });
    },
    chooseCategory() {
      common_vendor.index.navigateTo({
        url: "/pages/product/category"
      });
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
                components_utils_request.uploadFiles("product/insertImage", res.tempFiles[i].path).then((res2) => {
                  if (200 == res2.code) {
                    let that = this;
                    that.product.productImages = that.product.productImages.concat(res2.data);
                    common_vendor.index.hideLoading();
                  }
                });
              }
            }
          }
        });
      }
    },
    onPreviewImage(index) {
      let imageUrl = [];
      for (var i = 0; i < this.product.productImages.length; i++) {
        let productUrl = this.getProductImgUrl(this.product.productImages[i].productUrl);
        imageUrl.push(productUrl);
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
            this.product.productImages.splice(index, 1);
          }
        }
      });
    },
    getProductImgUrl(image) {
      let baseUrl = this.BASEURL;
      let baseSubUrl = baseUrl.substring(0, baseUrl.length - 1);
      return baseSubUrl + image;
    },
    getImgUrl(image) {
      return this.BASEURL + image;
    }
  },
  onLoad() {
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.productNameFocus,
    b: common_vendor.o(($event) => $data.productNameFocus = false),
    c: $data.product.productName,
    d: common_vendor.o(($event) => $data.product.productName = $event.detail.value),
    e: $data.product.type,
    f: common_vendor.o(($event) => $data.product.type = $event.detail.value),
    g: $data.product.size,
    h: common_vendor.o(($event) => $data.product.size = $event.detail.value),
    i: $data.product.production,
    j: common_vendor.o(($event) => $data.product.production = $event.detail.value),
    k: $data.product.color,
    l: common_vendor.o(($event) => $data.product.color = $event.detail.value),
    m: $data.product.texture,
    n: common_vendor.o(($event) => $data.product.texture = $event.detail.value),
    o: $data.product.stock,
    p: common_vendor.o(($event) => $data.product.stock = $event.detail.value),
    q: $data.product.purchasePrice,
    r: common_vendor.o(($event) => $data.product.purchasePrice = $event.detail.value),
    s: $data.product.retailPrice,
    t: common_vendor.o(($event) => $data.product.retailPrice = $event.detail.value),
    v: common_vendor.s("background-image:url(" + $options.getImgUrl("static/image/common/right.png") + ")"),
    w: $data.product.productCategoryName,
    x: common_vendor.o(($event) => $data.product.productCategoryName = $event.detail.value),
    y: common_vendor.o(($event) => $options.chooseCategory()),
    z: common_vendor.f($data.product.productImages, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.o(($event) => $options.onPreviewImage(index)),
        b: $options.getProductImgUrl(item.productUrl)
      }, !_ctx.isEditable ? {
        c: common_vendor.o(($event) => $options.onDeleteThis(index))
      } : {});
    }),
    A: !_ctx.isEditable,
    B: common_vendor.o((...args) => $options.onChooseImage && $options.onChooseImage(...args)),
    C: $options.getImgUrl("static/image/receipt/upload-voucher.png"),
    D: common_vendor.o((...args) => $options.productAdd && $options.productAdd(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-b086a63e"]]);
wx.createPage(MiniProgramPage);
