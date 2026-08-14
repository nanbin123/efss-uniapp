"use strict";
const common_vendor = require("../../common/vendor.js");
const components_daTree_utils = require("./utils.js");
const components_daTree_props = require("./props.js");
const _sfc_main = common_vendor.defineComponent({
  name: "DaTree",
  props: components_daTree_props.basicProps,
  emits: ["change", "expand"],
  setup(props, { emit }) {
    const dataRef = common_vendor.ref([]);
    const datalist = common_vendor.ref([]);
    const datamap = common_vendor.ref({});
    const expandedKeys = common_vendor.ref([]);
    const checkedKeys = common_vendor.ref(null);
    const loadLoading = common_vendor.ref(false);
    let fieldMap = {
      value: "value",
      label: "label",
      children: "children",
      disabled: "disabled",
      append: "append",
      leaf: "leaf",
      sort: "sort"
    };
    function initData() {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      fieldMap = {
        value: ((_a = props.field) == null ? void 0 : _a.key) || ((_b = props.field) == null ? void 0 : _b.value) || props.valueField || "value",
        label: ((_c = props.field) == null ? void 0 : _c.label) || props.labelField || "label",
        children: ((_d = props.field) == null ? void 0 : _d.children) || props.childrenField || "children",
        disabled: ((_e = props.field) == null ? void 0 : _e.disabled) || props.disabledField || "disabled",
        append: ((_f = props.field) == null ? void 0 : _f.append) || props.appendField || "append",
        leaf: ((_g = props.field) == null ? void 0 : _g.leaf) || props.leafField || "leaf",
        sort: ((_h = props.field) == null ? void 0 : _h.sort) || props.sortField || "sort"
      };
      const data = components_daTree_utils.deepClone(dataRef.value);
      datalist.value = [];
      datamap.value = {};
      handleTreeData(data);
      datalist.value = checkInitData(datalist.value);
    }
    function handleTreeData(data = [], parent = null, level = 0, insertIndex = -1) {
      return data.reduce((prev, cur, index) => {
        var _a, _b, _c;
        const key = cur[fieldMap.value];
        const children = cur[fieldMap.children] || null;
        const newItem = createNewItem(cur, index, parent, level);
        if (insertIndex > -1) {
          const index2 = (((_a = parent.childrenKeys) == null ? void 0 : _a.length) || 0) + insertIndex + 1;
          if (!((_b = parent == null ? void 0 : parent.childrenKeys) == null ? void 0 : _b.includes(key))) {
            datamap.value[key] = newItem;
            datalist.value.splice(index2, 0, newItem);
            parent.children.push(newItem);
            if ((_c = newItem.parentKeys) == null ? void 0 : _c.length) {
              newItem.parentKeys.forEach((k) => {
                datamap.value[k].childrenKeys = [...datamap.value[k].childrenKeys, newItem.key];
              });
            }
          }
        } else {
          datamap.value[key] = newItem;
          datalist.value.push(newItem);
        }
        const hasChildren = children && children.length > 0;
        if (hasChildren) {
          const childrenData = handleTreeData(children, newItem, level + 1);
          newItem.children = childrenData;
          const childrenKeys = childrenData.reduce((p, k) => {
            const keys = k.childrenKeys;
            p.push(...keys, k.key);
            return p;
          }, []);
          newItem.childrenKeys = childrenKeys;
        }
        prev.push(newItem);
        return prev;
      }, []);
    }
    function createNewItem(item, index, parent, level) {
      var _a;
      const key = item[fieldMap.value];
      const label = item[fieldMap.label];
      const sort = item[fieldMap.sort] || 0;
      const children = item[fieldMap.children] || null;
      const append = item[fieldMap.append] || null;
      let disabled = item[fieldMap.disabled] || false;
      disabled = (parent == null ? void 0 : parent.disabled) || disabled;
      let isLeaf = components_daTree_utils.isFunction(props.isLeafFn) ? props.isLeafFn(item) : item[fieldMap.leaf] || false;
      const isEmptyChildren = children && children.length === 0;
      let showArrow = true;
      let expand = props.defaultExpandAll || false;
      const isLoadMode = props.loadMode && components_daTree_utils.isFunction(props.loadApi);
      if (!children) {
        expand = false;
        if (isLoadMode) {
          showArrow = true;
        } else {
          isLeaf = true;
          showArrow = false;
        }
      }
      if (isEmptyChildren) {
        expand = false;
        if (isLoadMode) {
          showArrow = true;
        } else {
          isLeaf = true;
          showArrow = false;
        }
      }
      if (isLeaf) {
        showArrow = false;
        expand = false;
      } else {
        showArrow = true;
      }
      if (!props.showCheckbox) {
        if (props.onlyRadioLeaf) {
          if (!isLeaf) {
            disabled = true;
          } else {
            disabled = ((_a = parent == null ? void 0 : parent.originItem) == null ? void 0 : _a.disabled) || false;
          }
        }
      }
      if (disabled) {
        if (isLeaf || !children || isEmptyChildren) {
          expand = false;
          showArrow = false;
        }
      }
      const parentKey = parent ? parent.key : null;
      const show = props.defaultExpandAll || level === 0;
      const newItem = {
        key,
        parentKey,
        label,
        append,
        isLeaf,
        showArrow,
        level,
        expand,
        show,
        sort,
        disabled,
        loaded: false,
        loading: false,
        indexs: [index],
        checkedStatus: components_daTree_utils.unCheckedStatus,
        parentKeys: [],
        childrenKeys: [],
        children: [],
        originItem: item
      };
      if (parent) {
        newItem.parentKeys = [parent.key, ...parent.parentKeys];
        newItem.indexs = [...parent.indexs, index];
      }
      return newItem;
    }
    function checkInitData(list) {
      let checkedKeyList = null;
      let expandedKeyList = [];
      if (props.showCheckbox) {
        checkedKeyList = [...new Set(checkedKeys.value || [])];
        expandedKeyList = props.expandChecked ? [...checkedKeys.value || [], ...expandedKeys.value || []] : expandedKeys.value;
      } else {
        checkedKeyList = checkedKeys.value || null;
        expandedKeyList = props.expandChecked && checkedKeys.value ? [checkedKeys.value, ...expandedKeys.value || []] : expandedKeys.value;
      }
      handleCheckState(list, checkedKeyList, true);
      expandedKeyList = [...new Set(expandedKeyList)];
      if (!props.defaultExpandAll) {
        handleExpandState(list, expandedKeyList, true);
      }
      list.sort((a, b) => {
        if (a.sort === 0 && b.sort === 0) {
          return 0;
        }
        if (a.parentKey === b.parentKey) {
          if (a.sort - b.sort > 0) {
            return 1;
          } else {
            return -1;
          }
        }
        return 0;
      });
      return list;
    }
    function handleCheckState(list, checkedKeyList, checked = true) {
      if (props.showCheckbox) {
        if (checkedKeyList == null ? void 0 : checkedKeyList.length) {
          checkedKeyList.forEach((k) => {
            const item = datamap.value[k];
            if (item) {
              checkTheChecked(item, checked);
            }
          });
        }
        return;
      }
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        if (item.key === checkedKeyList) {
          checkTheRadio(item, checked);
          break;
        }
      }
    }
    function checkTheChecked(item, checked = true) {
      const { childrenKeys, parentKeys, disabled = false } = item;
      if (!props.checkedDisabled && disabled)
        return;
      item.checkedStatus = checked ? components_daTree_utils.isCheckedStatus : components_daTree_utils.unCheckedStatus;
      if (!props.checkStrictly) {
        childrenKeys.forEach((k) => {
          const childrenItem = common_vendor.unref(datamap)[k];
          childrenItem.checkedStatus = !props.checkedDisabled && childrenItem.disabled ? childrenItem.checkedStatus : item.checkedStatus;
        });
        parentKeys.forEach((k) => {
          const parentItem = datamap.value[k];
          parentItem.checkedStatus = getParentCheckedStatus(parentItem);
        });
      }
    }
    function checkTheRadio(item, checked) {
      var _a;
      const { parentKeys, isLeaf, disabled = false } = item;
      if (!props.checkedDisabled && disabled)
        return;
      if (props.onlyRadioLeaf && !isLeaf) {
        components_daTree_utils.logError(`限制了末节点选中，当前[${item.label}]非末节点`);
        return;
      }
      if ((_a = datalist.value) == null ? void 0 : _a.length) {
        datalist.value.forEach((k) => {
          k.checkedStatus = components_daTree_utils.unCheckedStatus;
        });
      }
      parentKeys.forEach((k) => {
        const parentItem = datamap.value[k];
        parentItem.checkedStatus = checked ? getParentCheckedStatus(parentItem) : components_daTree_utils.unCheckedStatus;
      });
      item.checkedStatus = checked ? components_daTree_utils.isCheckedStatus : components_daTree_utils.unCheckedStatus;
    }
    function handleExpandState(list, expandedKeyList, expand = true) {
      var _a, _b, _c;
      if (expand === false) {
        for (let i = 0; i < list.length; i++) {
          const item = list[i];
          if (expandedKeyList == null ? void 0 : expandedKeyList.includes(item.key)) {
            item.expand = false;
            if ((_a = item.childrenKeys) == null ? void 0 : _a.length) {
              item.childrenKeys.forEach((ck) => {
                datamap.value[ck].expand = false;
                datamap.value[ck].show = false;
              });
            }
          }
        }
        return;
      }
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        if (expandedKeyList == null ? void 0 : expandedKeyList.includes(item.key)) {
          item.expand = true;
          if ((_b = item.children) == null ? void 0 : _b.length) {
            item.children.forEach((k) => {
              const kItem = common_vendor.unref(datamap)[k.key];
              kItem.show = true;
            });
          }
          if ((_c = item.parentKeys) == null ? void 0 : _c.length) {
            item.parentKeys.forEach((k) => {
              var _a2;
              const kItem = common_vendor.unref(datamap)[k];
              kItem.expand = true;
              if ((_a2 = kItem.children) == null ? void 0 : _a2.length) {
                kItem.children.forEach((k2) => {
                  const skItem = common_vendor.unref(datamap)[k2.key];
                  skItem.show = true;
                });
              }
            });
          }
        }
      }
    }
    function handleCheckChange(item) {
      const { childrenKeys, parentKeys, checkedStatus, isLeaf, disabled = false } = item;
      if (!props.showCheckbox)
        return;
      if (disabled)
        return;
      item.checkedStatus = checkedStatus === components_daTree_utils.isCheckedStatus ? components_daTree_utils.unCheckedStatus : components_daTree_utils.isCheckedStatus;
      if (!props.checkStrictly) {
        if (props.expandChecked) {
          item.show = true;
          item.expand = (childrenKeys == null ? void 0 : childrenKeys.length) > 0 || isLeaf;
        }
        childrenKeys.forEach((k) => {
          var _a;
          const childrenItem = common_vendor.unref(datamap)[k];
          childrenItem.checkedStatus = childrenItem.disabled ? childrenItem.checkedStatus : item.checkedStatus;
          if (props.expandChecked) {
            childrenItem.show = true;
            childrenItem.expand = ((_a = childrenItem == null ? void 0 : childrenItem.childrenKeys) == null ? void 0 : _a.length) > 0 || childrenItem.isLeaf;
          }
        });
      } else {
        if (props.expandChecked) {
          components_daTree_utils.logError(`多选时，当 checkStrictly 为 true 时，不支持选择自动展开子节点属性(expandChecked)`);
        }
      }
      if (!props.checkStrictly) {
        parentKeys.forEach((k) => {
          const parentItem = datamap.value[k];
          parentItem.checkedStatus = getParentCheckedStatus(parentItem);
        });
      }
      const hasCheckedKeys = [];
      for (let i = 0; i < datalist.value.length; i++) {
        const k = datalist.value[i];
        if (k.checkedStatus === components_daTree_utils.isCheckedStatus) {
          if (props.packDisabledkey && k.disabled || !k.disabled) {
            hasCheckedKeys.push(k.key);
          }
        }
      }
      checkedKeys.value = [...hasCheckedKeys];
      emit("change", hasCheckedKeys, item);
    }
    function handleRadioChange(item) {
      var _a;
      const { parentKeys, checkedStatus, key, disabled = false, isLeaf } = item;
      if (props.showCheckbox)
        return;
      if (props.onlyRadioLeaf && !isLeaf)
        handleExpandedChange(item);
      if (disabled)
        return;
      if ((_a = datalist.value) == null ? void 0 : _a.length) {
        for (let i = 0; i < datalist.value.length; i++) {
          const k = datalist.value[i];
          k.checkedStatus = components_daTree_utils.unCheckedStatus;
        }
      }
      parentKeys.forEach((k) => {
        const parentItem = datamap.value[k];
        parentItem.checkedStatus = getParentCheckedStatus(parentItem);
      });
      item.checkedStatus = checkedStatus === components_daTree_utils.isCheckedStatus ? components_daTree_utils.unCheckedStatus : components_daTree_utils.isCheckedStatus;
      checkedKeys.value = key;
      emit("change", key, item);
    }
    function handleLabelClick(item) {
      if (props.showCheckbox) {
        handleCheckChange(item);
      } else {
        handleRadioChange(item);
      }
    }
    async function handleExpandedChange(item) {
      if (props.filterValue)
        return;
      const { expand, loading = false, disabled } = item;
      if (loadLoading.value && loading)
        return;
      checkExpandedChange(item);
      item.expand = !expand;
      let currentItem = null;
      if (!disabled) {
        if (!props.showCheckbox && props.onlyRadioLeaf && props.loadMode) {
          components_daTree_utils.logError(`单选时，当 onlyRadioLeaf 为 true 时不支持动态数据`);
        } else {
          currentItem = await loadExpandNode(item);
        }
      }
      emit("expand", !expand, currentItem || item || null);
    }
    function checkExpandedChange(item) {
      const { expand, childrenKeys, children = null } = item;
      if (expand) {
        if (childrenKeys == null ? void 0 : childrenKeys.length) {
          childrenKeys.forEach((k) => {
            if (common_vendor.unref(datamap)[k]) {
              common_vendor.unref(datamap)[k].show = false;
              common_vendor.unref(datamap)[k].expand = false;
            }
          });
        }
      } else {
        if (children == null ? void 0 : children.length) {
          const childrenKeys2 = children.map((k) => k.key);
          childrenKeys2.forEach((k) => {
            if (common_vendor.unref(datamap)[k]) {
              common_vendor.unref(datamap)[k].show = true;
            }
          });
        }
      }
    }
    async function loadExpandNode(item) {
      var _a;
      const { expand, key, loaded, children } = item;
      if ((children == null ? void 0 : children.length) && !props.alwaysFirstLoad) {
        return item;
      }
      if (expand && props.loadMode && !loaded) {
        if (components_daTree_utils.isFunction(props.loadApi)) {
          expandedKeys.value.push(key);
          loadLoading.value = true;
          item.loading = true;
          const currentNode = components_daTree_utils.deepClone(item);
          const apiRes = await props.loadApi(currentNode);
          let newChildren = [...((_a = item.originItem) == null ? void 0 : _a.children) || [], ...apiRes || []];
          const newChildrenObj = {};
          newChildren = newChildren.reduce((total, next) => {
            newChildrenObj[next[fieldMap.value]] ? "" : newChildrenObj[next[fieldMap.value]] = total.push(next);
            return total;
          }, []);
          item.originItem.children = newChildren || null;
          if (apiRes == null ? void 0 : apiRes.length) {
            const insertIndex = datalist.value.findIndex((k) => k.key === item.key);
            handleTreeData(apiRes, item, item.level + 1, insertIndex);
            datalist.value = checkInitData(datalist.value);
          } else {
            item.expand = false;
            item.isLeaf = true;
            item.showArrow = false;
          }
          loadLoading.value = false;
          item.loading = false;
          item.loaded = true;
        }
      } else {
        const eki = expandedKeys.value.findIndex((k) => k === key);
        if (eki >= 0) {
          expandedKeys.value.splice(eki, 1);
        }
      }
      return item;
    }
    function getParentCheckedStatus(item) {
      if (!item) {
        return components_daTree_utils.unCheckedStatus;
      }
      if (!props.checkedDisabled && item.disabled) {
        return item.checkedStatus || components_daTree_utils.unCheckedStatus;
      }
      if (!props.showCheckbox) {
        return components_daTree_utils.halfCheckedStatus;
      }
      const { children } = item;
      const childrenCheckedAll = children.every((k) => k.checkedStatus === components_daTree_utils.isCheckedStatus);
      if (childrenCheckedAll) {
        return components_daTree_utils.isCheckedStatus;
      }
      const childrenUncheckedAll = children.every((k) => k.checkedStatus === components_daTree_utils.unCheckedStatus);
      if (childrenUncheckedAll) {
        return components_daTree_utils.unCheckedStatus;
      }
      return components_daTree_utils.halfCheckedStatus;
    }
    function filterData() {
      if (props.filterValue === "") {
        datalist.value.forEach((k) => {
          k.show = true;
        });
        return;
      }
      datalist.value.forEach((k) => {
        if (k.label.indexOf(props.filterValue) > -1) {
          k.show = true;
          k.parentKeys.forEach((k2) => {
            datamap.value[k2].show = true;
          });
        } else {
          k.show = false;
        }
      });
      datalist.value.forEach((k) => {
        if (k.show) {
          k.parentKeys.forEach((k2) => {
            datamap.value[k2].show = true;
          });
        }
      });
    }
    const getCheckedKeys = () => components_daTree_utils.getAllNodeKeys(datalist.value, "checkedStatus", components_daTree_utils.isCheckedStatus, props.packDisabledkey);
    function setCheckedKeys(keys, checked = true) {
      if (props.showCheckbox) {
        if (!components_daTree_utils.isArray(keys)) {
          components_daTree_utils.logError(`setCheckedKeys 第一个参数非数组，传入的是[${keys}]`);
          return;
        }
        const list2 = datalist.value;
        if (checked === false) {
          let newCheckedKeys2 = [];
          for (let i = 0; i < checkedKeys.value.length; i++) {
            const ck = checkedKeys.value[i];
            if (!keys.includes(ck)) {
              newCheckedKeys2.push(ck);
            }
          }
          newCheckedKeys2 = [...new Set(newCheckedKeys2)];
          checkedKeys.value = newCheckedKeys2;
          handleCheckState(list2, keys, false);
          return;
        }
        const newCheckedKeys = [...checkedKeys.value, ...keys];
        checkedKeys.value = [...new Set(newCheckedKeys)];
        handleCheckState(list2, checkedKeys.value, true);
        if (props.expandChecked && checked) {
          expandedKeys.value = [.../* @__PURE__ */ new Set([...checkedKeys.value || [], ...keys || []])];
          handleExpandState(list2, keys, true);
        }
        return;
      }
      if (components_daTree_utils.isArray(keys)) {
        keys = keys[0];
      }
      if (!components_daTree_utils.isString(keys) && !components_daTree_utils.isNumber(keys)) {
        components_daTree_utils.logError("setCheckedKeys 第一个参数字符串或数字，传入的是==>", keys);
        return;
      }
      const list = datalist.value;
      checkedKeys.value = checked ? keys : null;
      if (props.expandChecked && checked) {
        handleExpandState(list, [keys], true);
      }
      handleCheckState(list, keys, !!checked);
    }
    const getHalfCheckedKeys = () => components_daTree_utils.getAllNodeKeys(datalist.value, "checkedStatus", components_daTree_utils.halfCheckedStatus, props.packDisabledkey);
    const getUncheckedKeys = () => components_daTree_utils.getAllNodeKeys(datalist.value, "checkedStatus", components_daTree_utils.unCheckedStatus, props.packDisabledkey);
    const getExpandedKeys = () => components_daTree_utils.getAllNodeKeys(datalist.value, "expand", true);
    const getUnexpandedKeys = () => components_daTree_utils.getAllNodeKeys(datalist.value, "expand", false);
    function setExpandedKeys(keys, expand = true) {
      if (!Array.isArray(keys) && keys !== "all") {
        components_daTree_utils.logError("setExpandedKeys 第一个参数非数组，传入的是===>", keys);
        return;
      }
      const list = datalist.value;
      if (keys === "all") {
        list.forEach((k) => {
          k.expand = expand;
          if (k.level > 0) {
            k.show = expand;
          }
        });
        return;
      }
      if (expand === false) {
        const newExpandedKeys2 = [];
        for (let i = 0; i < expandedKeys.value.length; i++) {
          const ek = expandedKeys.value[i];
          if (!keys.includes(ek)) {
            newExpandedKeys2.push(ek);
          }
        }
        expandedKeys.value = [...new Set(newExpandedKeys2)];
        handleExpandState(list, keys, false);
        return;
      }
      const newExpandedKeys = [];
      for (let i = 0; i < list.length; i++) {
        if (keys.includes(list[i].key)) {
          newExpandedKeys.push(list[i].key);
        }
      }
      expandedKeys.value = [...new Set(newExpandedKeys)];
      handleExpandState(list, newExpandedKeys, true);
    }
    const getCheckedNodes = () => components_daTree_utils.getAllNodes(datalist.value, "checkedStatus", components_daTree_utils.isCheckedStatus, props.packDisabledkey);
    const getHalfCheckedNodes = () => components_daTree_utils.getAllNodes(datalist.value, "checkedStatus", components_daTree_utils.halfCheckedStatus, props.packDisabledkey);
    const getUncheckedNodes = () => components_daTree_utils.getAllNodes(datalist.value, "checkedStatus", components_daTree_utils.unCheckedStatus, props.packDisabledkey);
    const getExpandedNodes = () => components_daTree_utils.getAllNodes(datalist.value, "expand", true);
    const getUnexpandedNodes = () => components_daTree_utils.getAllNodes(datalist.value, "expand", false);
    common_vendor.watch(
      () => props.defaultExpandedKeys,
      (v) => {
        if (v == null ? void 0 : v.length) {
          expandedKeys.value = v;
        } else {
          expandedKeys.value = [];
        }
      },
      { immediate: true }
    );
    common_vendor.watch(
      () => props.defaultCheckedKeys,
      (v) => {
        if (props.showCheckbox) {
          if (v == null ? void 0 : v.length) {
            checkedKeys.value = v;
          } else {
            checkedKeys.value = [];
          }
        } else {
          if (v || v === 0) {
            checkedKeys.value = v;
          } else {
            checkedKeys.value = null;
          }
        }
      },
      { immediate: true }
    );
    common_vendor.watch(
      () => props.data,
      (v) => {
        dataRef.value = components_daTree_utils.deepClone(v);
        setTimeout(() => {
          initData();
        }, 36);
      },
      { immediate: true, deep: true }
    );
    common_vendor.watch(
      () => props.filterValue,
      () => {
        filterData();
      }
    );
    return {
      datalist,
      unCheckedStatus: components_daTree_utils.unCheckedStatus,
      halfCheckedStatus: components_daTree_utils.halfCheckedStatus,
      isCheckedStatus: components_daTree_utils.isCheckedStatus,
      handleCheckChange,
      handleRadioChange,
      handleLabelClick,
      handleExpandedChange,
      loadLoading,
      // updateChildrenByKey: () => {},
      // insertBeforeByKey: () => {},
      // insertAfterByKey: () => {},
      getCheckedKeys,
      setCheckedKeys,
      getHalfCheckedKeys,
      getUncheckedKeys,
      getExpandedKeys,
      getUnexpandedKeys,
      setExpandedKeys,
      getCheckedNodes,
      getHalfCheckedNodes,
      getUncheckedNodes,
      getExpandedNodes,
      getUnexpandedNodes
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f(_ctx.datalist, (item, k0, i0) => {
      return common_vendor.e({
        a: item.showArrow && !_ctx.filterValue
      }, item.showArrow && !_ctx.filterValue ? common_vendor.e({
        b: _ctx.loadLoading && item.loading
      }, _ctx.loadLoading && item.loading ? {} : {
        c: common_vendor.n({
          "is-right": !item.expand
        })
      }, {
        d: common_vendor.o(($event) => _ctx.handleExpandedChange(item), item.key)
      }) : {}, _ctx.showCheckbox ? common_vendor.e({
        e: item.checkedStatus === _ctx.isCheckedStatus
      }, item.checkedStatus === _ctx.isCheckedStatus ? {} : item.checkedStatus === _ctx.halfCheckedStatus ? {} : {}, {
        f: item.checkedStatus === _ctx.halfCheckedStatus,
        g: common_vendor.n(`da-tree-item__checkbox--${_ctx.checkboxPlacement}`),
        h: common_vendor.n({
          "is--disabled": item.disabled
        }),
        i: common_vendor.o(($event) => _ctx.handleCheckChange(item), item.key)
      }) : {}, !_ctx.showCheckbox && _ctx.showRadioIcon ? common_vendor.e({
        j: item.checkedStatus === _ctx.isCheckedStatus
      }, item.checkedStatus === _ctx.isCheckedStatus ? {} : item.checkedStatus === _ctx.halfCheckedStatus ? {} : {}, {
        k: item.checkedStatus === _ctx.halfCheckedStatus,
        l: common_vendor.n(`da-tree-item__checkbox--${_ctx.checkboxPlacement}`),
        m: common_vendor.n({
          "is--disabled": item.disabled
        }),
        n: common_vendor.o(($event) => _ctx.handleRadioChange(item), item.key)
      }) : {}, {
        o: common_vendor.t(item.label),
        p: item.append
      }, item.append ? {
        q: common_vendor.t(item.append)
      } : {}, {
        r: common_vendor.n("da-tree-item__label--" + item.checkedStatus),
        s: common_vendor.o(($event) => _ctx.handleLabelClick(item), item.key),
        t: item.show ? 1 : "",
        v: item.level * _ctx.indent + "px",
        w: item.key
      });
    }),
    b: _ctx.showCheckbox,
    c: !_ctx.showCheckbox && _ctx.showRadioIcon,
    d: _ctx.themeColor
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
