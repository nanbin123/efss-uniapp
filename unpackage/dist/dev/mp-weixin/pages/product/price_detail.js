"use strict";
const common_vendor = require("../../common/vendor.js");
const components_utils_request = require("../../components/utils/request.js");
const _sfc_main = {
  data() {
    return {
      isEditable: true,
      isEditImg: false,
      uploading: false,
      productNameFocus: true,
      product: {}
    };
  },
  methods: {
    onChooseImage() {
      if (this.isEditImg || this.uploading)
        return;
      common_vendor.index.chooseImage({
        count: 9,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success: async (res) => {
          const paths = res.tempFilePaths || [];
          if (!paths.length) {
            common_vendor.index.showToast({ title: "未获取到图片文件，请重新选择", icon: "none" });
            return;
          }
          this.uploading = true;
          try {
            for (const path of paths) {
              const result = await components_utils_request.uploadFiles("product/addPriceImage", path, { productId: this.product.id });
              if (!result || result.code != 200)
                break;
              const images = Array.isArray(this.product.productImages) ? this.product.productImages : [];
              this.product.productImages = images.concat(result.data || []);
            }
          } catch (error) {
            common_vendor.index.hideLoading();
            common_vendor.index.showToast({ title: "图片上传失败，请重试", icon: "none" });
          } finally {
            this.uploading = false;
          }
        },
        fail: (error) => {
          if (/cancel/i.test(error.errMsg || ""))
            return;
          common_vendor.index.showToast({ title: "选择图片失败，请检查相册或相机权限", icon: "none" });
        }
      });
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
    b: common_vendor.o(($event) => $data.productNameFocus = false, "25"),
    c: $data.isEditable,
    d: $data.product.productName,
    e: common_vendor.o(($event) => $data.product.productName = $event.detail.value, "69"),
    f: $data.isEditable,
    g: $data.product.type,
    h: common_vendor.o(($event) => $data.product.type = $event.detail.value, "5f"),
    i: $data.isEditable,
    j: $data.product.size,
    k: common_vendor.o(($event) => $data.product.size = $event.detail.value, "05"),
    l: $data.isEditable,
    m: $data.product.production,
    n: common_vendor.o(($event) => $data.product.production = $event.detail.value, "d3"),
    o: $data.isEditable,
    p: $data.product.color,
    q: common_vendor.o(($event) => $data.product.color = $event.detail.value, "3a"),
    r: $data.isEditable,
    s: $data.product.texture,
    t: common_vendor.o(($event) => $data.product.texture = $event.detail.value, "7a"),
    v: $data.isEditable,
    w: $data.product.retailPrice,
    x: common_vendor.o(($event) => $data.product.retailPrice = $event.detail.value, "88"),
    y: common_vendor.f($data.product.productImages, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.o(($event) => $options.onPreviewImage(index), "58"),
        b: $options.getProductImgUrl(item.productUrl)
      }, !$data.isEditImg ? {
        c: common_vendor.o(($event) => $options.onDeleteThis(item, index), "98")
      } : {});
    }),
    z: !$data.isEditImg,
    A: common_vendor.o((...args) => $options.onChooseImage && $options.onChooseImage(...args), "1e"),
    B: $options.getImgUrl("static/image/receipt/upload-voucher.png")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-436b0c2f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/product/price_detail.js.map
