"use strict";
const common_vendor = require("../../common/vendor.js");
const components_utils_request = require("../../components/utils/request.js");
const _sfc_main = {
  data() {
    return {
      isEditable: true,
      isEditImg: false,
      productNameFocus: true,
      product: {}
    };
  },
  methods: {
    onChooseImage() {
      if (!this.isEditImg) {
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
                components_utils_request.uploadFiles("product/addPriceImage", res.tempFiles[i].path, { productId: this.product.id }).then((res2) => {
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
    onDeleteThis(item, index) {
      common_vendor.index.showModal({
        title: "提示",
        content: "您确定删除吗？",
        success: (res) => {
          if (res.confirm) {
            components_utils_request.post("product/deletePriceImage", { "id": item.id }).then((res2) => {
              if (200 == res2.code) {
                this.product.productImages.splice(index, 1);
              }
            });
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
  onLoad(option) {
    components_utils_request.post("product/selectPriceById", { "id": option.id }).then((res) => {
      if (200 == res.code) {
        this.product = res.data;
      }
    });
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.productNameFocus,
    b: common_vendor.o(($event) => $data.productNameFocus = false),
    c: $data.isEditable,
    d: $data.product.productName,
    e: common_vendor.o(($event) => $data.product.productName = $event.detail.value),
    f: $data.isEditable,
    g: $data.product.type,
    h: common_vendor.o(($event) => $data.product.type = $event.detail.value),
    i: $data.isEditable,
    j: $data.product.size,
    k: common_vendor.o(($event) => $data.product.size = $event.detail.value),
    l: $data.isEditable,
    m: $data.product.production,
    n: common_vendor.o(($event) => $data.product.production = $event.detail.value),
    o: $data.isEditable,
    p: $data.product.color,
    q: common_vendor.o(($event) => $data.product.color = $event.detail.value),
    r: $data.isEditable,
    s: $data.product.texture,
    t: common_vendor.o(($event) => $data.product.texture = $event.detail.value),
    v: $data.isEditable,
    w: $data.product.retailPrice,
    x: common_vendor.o(($event) => $data.product.retailPrice = $event.detail.value),
    y: common_vendor.f($data.product.productImages, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.o(($event) => $options.onPreviewImage(index)),
        b: $options.getProductImgUrl(item.productUrl)
      }, !$data.isEditImg ? {
        c: common_vendor.o(($event) => $options.onDeleteThis(item, index))
      } : {});
    }),
    z: !$data.isEditImg,
    A: common_vendor.o((...args) => $options.onChooseImage && $options.onChooseImage(...args)),
    B: $options.getImgUrl("static/image/receipt/upload-voucher.png")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-436b0c2f"]]);
wx.createPage(MiniProgramPage);
