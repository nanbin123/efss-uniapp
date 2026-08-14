"use strict";
const common_vendor = require("../../common/vendor.js");
const components_utils_request = require("../../components/utils/request.js");
const _sfc_main = {
  data() {
    return {
      showEditAndDelete: true,
      editText: "编辑",
      productCategoryList: [],
      addOrEditCateGory: "",
      formData: {
        id: "",
        category: ""
      },
      categoryFocus: true
    };
  },
  methods: {
    edit() {
      this.showEditAndDelete = !this.showEditAndDelete;
      if (this.showEditAndDelete) {
        this.editText = "编辑";
      } else {
        this.editText = "取消";
      }
    },
    add() {
      this.addOrEditCateGory = "添加产品类别";
      this.$refs.popup.open("center");
    },
    imgEdit(category, id) {
      this.formData.category = category;
      this.formData.id = id;
      this.addOrEditCateGory = "修改产品类别";
      this.$refs.popup.open("center");
    },
    getList() {
      components_utils_request.post("product/selectCategory", { "pageNum": this.pageNum }).then((res) => {
        if (this.totalCount > 0) {
          this.productCategoryList = res.rows;
        }
        common_vendor.index.hideLoading();
      });
    },
    imgDelete(id) {
      let that = this;
      common_vendor.index.showModal({
        title: "",
        content: "是否删除该项",
        success: function(res) {
          if (res.confirm) {
            components_utils_request.post("product/delProductCategory", { "id": id }).then((res2) => {
              if (200 == res2.code) {
                let index = that.productCategoryList.findIndex((obj) => obj.id == id);
                that.productCategoryList.splice(index, 1);
              }
            });
          }
        }
      });
    },
    cancelArrival() {
      this.formData.category = "";
      this.formData.id = "";
      this.$refs.popup.close();
    },
    submit() {
      if (!this.formData.category) {
        this.categoryFocus = true;
        common_vendor.index.showToast({
          title: "产品类别不能为空",
          icon: "none"
        });
        return;
      }
      let category = this.formData.category;
      if ("添加产品类别" == this.addOrEditCateGory) {
        components_utils_request.post("product/insertProductCategory", { "category": category }).then((res) => {
          if (200 == res.code) {
            this.formData.category = "";
            this.formData.id = "";
            this.$refs.popup.close();
            this.$refs.paging.reload();
            common_vendor.index.showToast({
              title: "添加产品类别成功",
              icon: "none",
              duration: 2e3
            });
          }
        });
      } else if ("修改产品类别" == this.addOrEditCateGory) {
        let id = this.formData.id;
        components_utils_request.post("product/updateProductCategory", { "id": id, "category": category }).then((res) => {
          if (200 == res.code) {
            this.formData.category = "";
            common_vendor.index.showToast({
              title: "修改产品类别成功",
              icon: "none",
              duration: 2e3
            });
            this.formData.category = "";
            this.formData.id = "";
            this.$refs.popup.close();
            this.$refs.paging.reload();
          }
        });
      }
    },
    chooseCategory(id, category) {
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      prevPage.$vm.product.productCategoryName = category;
      prevPage.$vm.product.productCategoryId = id;
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    queryList(pageNo, pageSize) {
      components_utils_request.post("product/selectCategory", { "pageNum": pageNo }).then((res) => {
        this.$refs.paging.complete(res.rows);
      });
    },
    getImgUrl(image) {
      return this.BASEURL + image;
    }
  },
  onLoad() {
  }
};
if (!Array) {
  const _easycom_z_paging2 = common_vendor.resolveComponent("z-paging");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_z_paging2 + _easycom_uni_popup2)();
}
const _easycom_z_paging = () => "../../uni_modules/z-paging/components/z-paging/z-paging.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_z_paging + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.productCategoryList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.category),
        b: common_vendor.o(($event) => $options.imgEdit(item.category, item.id), index),
        c: common_vendor.o(($event) => $options.imgDelete(item.id), index),
        d: index,
        e: item.id,
        f: common_vendor.o(($event) => $options.chooseCategory(item.id, item.category), index)
      };
    }),
    b: $options.getImgUrl("../../static/image/product/edit.png"),
    c: $options.getImgUrl("../../static/image/product/delete.png"),
    d: !$data.showEditAndDelete,
    e: common_vendor.o(($event) => $options.add()),
    f: common_vendor.t($data.editText),
    g: common_vendor.o(($event) => $options.edit()),
    h: common_vendor.sr("paging", "759cc12d-0"),
    i: common_vendor.o($options.queryList),
    j: common_vendor.o(($event) => $data.productCategoryList = $event),
    k: common_vendor.p({
      modelValue: $data.productCategoryList
    }),
    l: common_vendor.t($data.addOrEditCateGory),
    m: $data.categoryFocus,
    n: common_vendor.o(($event) => $data.categoryFocus = false),
    o: $data.formData.category,
    p: common_vendor.o(($event) => $data.formData.category = $event.detail.value),
    q: common_vendor.o(($event) => $options.cancelArrival()),
    r: common_vendor.o(($event) => $options.submit()),
    s: common_vendor.sr("popup", "759cc12d-1"),
    t: common_vendor.p({
      type: "bottom",
      ["border-radius"]: "10px 10px 0 0"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-759cc12d"]]);
wx.createPage(MiniProgramPage);
