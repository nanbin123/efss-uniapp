"use strict";
const common_vendor = require("../../common/vendor.js");
const components_utils_request = require("../../components/utils/request.js");
const _sfc_main = {
  data() {
    return {
      isEditable: true,
      productNameFocus: true,
      product: {}
    };
  },
  methods: {
    editProduct() {
      if (this.isEditable == true) {
        this.isEditable = false;
      } else if (this.isEditable == false) {
        if (!this.product.productName) {
          this.$nextTick(() => {
            this.productNameFocus = true;
          });
          common_vendor.index.showToast({
            title: "品名不能为空",
            icon: "none"
          });
          return;
        }
        let product = JSON.stringify(this.product);
        components_utils_request.post("product/updateProductById", product, "application/json").then((res) => {
          if (200 == res.code) {
            this.isEditable = true;
            common_vendor.index.showToast({
              title: "修改产品成功",
              icon: "none",
              duration: 2e3
            });
          }
        });
      }
    },
    deleteProduct() {
      let that = this;
      if (this.isEditable == true) {
        common_vendor.index.showModal({
          title: "提示",
          content: "是否删除产品",
          success: (res) => {
            if (res.confirm) {
              components_utils_request.post("product/deleteProductById", { "id": that.product.id }).then((res2) => {
                if (200 == res2.code) {
                  this.isEditable = true;
                  that.product = {};
                  common_vendor.index.showToast({
                    title: "删除产品成功",
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
    chooseCategory() {
      if (!this.isEditable) {
        common_vendor.index.navigateTo({
          url: "/pages/product/category"
        });
      }
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
                components_utils_request.uploadFiles("product/insertImage", res.tempFiles[i].path, { productId: this.product.id }).then((res2) => {
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
  onLoad(option) {
    components_utils_request.post("product/selectProductById", { "id": option.id }).then((res) => {
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
    w: $data.product.stock,
    x: common_vendor.o(($event) => $data.product.stock = $event.detail.value),
    y: $data.isEditable,
    z: $data.product.purchasePrice,
    A: common_vendor.o(($event) => $data.product.purchasePrice = $event.detail.value),
    B: $data.isEditable,
    C: $data.product.retailPrice,
    D: common_vendor.o(($event) => $data.product.retailPrice = $event.detail.value),
    E: common_vendor.o(($event) => $options.chooseCategory()),
    F: common_vendor.s("background-image:url(" + $options.getImgUrl("static/image/common/right.png") + ")"),
    G: $data.isEditable,
    H: $data.product.productCategoryName,
    I: common_vendor.o(($event) => $data.product.productCategoryName = $event.detail.value),
    J: common_vendor.f($data.product.productImages, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.o(($event) => $options.onPreviewImage(index)),
        b: $options.getProductImgUrl(item.productUrl)
      }, !$data.isEditable ? {
        c: common_vendor.o(($event) => $options.onDeleteThis(index))
      } : {});
    }),
    K: !$data.isEditable,
    L: common_vendor.o((...args) => $options.onChooseImage && $options.onChooseImage(...args)),
    M: $options.getImgUrl("static/image/receipt/upload-voucher.png"),
    N: common_vendor.t($data.isEditable ? "删除" : "取消"),
    O: common_vendor.o(($event) => $options.deleteProduct()),
    P: common_vendor.t($data.isEditable ? "编辑" : "保存"),
    Q: common_vendor.o(($event) => $options.editProduct())
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-0591f1f7"]]);
wx.createPage(MiniProgramPage);
