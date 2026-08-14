"use strict";
const unCheckedStatus = 0;
const halfCheckedStatus = 1;
const isCheckedStatus = 2;
function deepClone(originData) {
  const type = Object.prototype.toString.call(originData);
  let data;
  if (type === "[object Array]") {
    data = [];
    for (let i = 0; i < originData.length; i++) {
      data.push(deepClone(originData[i]));
    }
  } else if (type === "[object Object]") {
    data = {};
    for (const prop in originData) {
      if (originData.hasOwnProperty(prop)) {
        data[prop] = deepClone(originData[prop]);
      }
    }
  } else {
    data = originData;
  }
  return data;
}
function getAllNodes(list, type, value, packDisabledkey = true) {
  if (!list || list.length === 0) {
    return [];
  }
  const res = [];
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (item[type] === value) {
      if (packDisabledkey && item.disabled || !item.disabled) {
        res.push(item);
      }
    }
  }
  return res;
}
function getAllNodeKeys(list, type, value, packDisabledkey = true) {
  if (!list || list.length === 0) {
    return null;
  }
  const res = [];
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (item[type] === value) {
      if (packDisabledkey && item.disabled || !item.disabled) {
        res.push(item.key);
      }
    }
  }
  return res.length ? res : null;
}
function logError(msg, ...args) {
  console.error(`DaTree: ${msg}`, ...args);
}
const toString = Object.prototype.toString;
function is(val, type) {
  return toString.call(val) === `[object ${type}]`;
}
function isNumber(val) {
  return is(val, "Number");
}
function isString(val) {
  return is(val, "String");
}
function isFunction(val) {
  return typeof val === "function";
}
function isArray(val) {
  return val && Array.isArray(val);
}
exports.deepClone = deepClone;
exports.getAllNodeKeys = getAllNodeKeys;
exports.getAllNodes = getAllNodes;
exports.halfCheckedStatus = halfCheckedStatus;
exports.isArray = isArray;
exports.isCheckedStatus = isCheckedStatus;
exports.isFunction = isFunction;
exports.isNumber = isNumber;
exports.isString = isString;
exports.logError = logError;
exports.unCheckedStatus = unCheckedStatus;
