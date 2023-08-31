
// https://github.com/andreasbm/lit-translate


import EventEmitter from 'events';

import {noChange} from 'lit';
import {AsyncDirective, directive} from 'lit/async-directive.js';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';

import {juruoReplace, setAnimFrameTimer} from '@bwaycer/tendon';


const _msgPkg = {
  chainIdNotExist: 'The chainId "{{chainId}}" is not exist.',
  modelValueTypeNotExpected:
    'The model value type is not accepted. ("{{value}}")',
};

const _txtNA = 'N/A';


export class ModelValue {
  static parseValue(value, handleOption = null) {
    if (typeof handleOption === 'function') {
      return handleOption(new this(value));
    }

    if (value === undefined) {
      return _txtNA;
    }

    if (
      handleOption !== null && typeof handleOption === 'object'
      && typeof value === 'string' && !!~value.indexOf('{{')
    ) {
      value = this.#_interpolate(value, handleOption);
    }
    return value;
  }

  constructor(value) {
    this.#_value = value;
    this.#_isNA = value === undefined;
    this.#_isCanInterpolated
      = typeof value === 'string' && !!~value.indexOf('{{')
    ;
  }

  #_value;
  #_isNA;
  #_isCanInterpolated = false;

  get value() {
    return this.#_value;
  }

  get isNA() {
    return this.#_isNA;
  }

  parseValue(handleOption = null) {
    if (typeof handleOption === 'function') {
      return handleOption(this);
    }

    if (this.isNA) {
      return _txtNA;
    }

    let value = this.value;
    if (
      this.#_isCanInterpolated
      && handleOption !== null && typeof handleOption === 'object'
    ) {
      value = this.#_interpolate(value, handleOption);
    }
    return value;
  }

  #_interpolate(value, interpolations) {
    return Object.entries(interpolations).reduce(
      (accu, [key, val]) => accu.replaceAll(`{{${key}}}`, val),
      value,
    );
  }
}


export class ViewModel extends EventEmitter {
  constructor(model = null) {
    super();
    this._modelMap = new Map();
    let modelType = this.#_getModelTypeofInfo(model).name;
    if (modelType === 'object') {
      this.#_flatModel(modelType, model, '', this._modelMap);
    }
  }

  createData(chainId, model) {
    if (typeof chainId === 'string' && chainId !== '') {
      this.delete(chainId);
      let modelType = this.#_getModelTypeofInfo(model).name;
      this.#_flatModel(modelType, model, chainId, this._modelMap);
    }
  }

  createFlatData(chainId, flatModel) {
    if (typeof chainId === 'string' && chainId !== '') {
      this.delete(chainId);
      Object.entries(flatModel).forEach(([key, val]) => {
        let valueType = this.#_getModelTypeofInfo(val).name;
        if (valueType !== Object) {
          this.#_flatModel(valueType, val, chainId + '.' + key, this._modelMap);
        }
      });
    }
  }

  // state:    0              1         2        3      4
  // |-----------------|------------|-------|--------|-----|
  //   undefined, null   pure value   Array   Object   ...
  #_getModelTypeofInfo(value) {
    let name = '';
    let state = 1;
    switch (value == null ? value : value.constructor) {
      case undefined:
        name = 'undefined';
        state = 0;
        break;
      case null:
        name = 'null';
        state = 0;
        break;
      case String:
        name = 'string';
        break;
      case Number:
        name = isNaN(value) ? 'null' : 'number';
        break;
      case Boolean:
        name = 'boolean';
        break;
      case Array:
        name = 'array';
        state = 2;
        break;
      case Object:
        name = 'object';
        state = 3;
        break;
      default:
        name = 'other';
        state = 4;
        break;
    }
    return {name, state};
  }

  #_transformPureData(data) {
    return JSON.parse(JSON.stringify(data));
  }

  #_flatModel(valueType, value, currChain, newData) {
    switch (valueType) {
      case 'undefined':
      case 'null':
        newData.set(currChain, null);
        this.#_updateViewFrame(currChain, null);
        break;
      case 'string':
      case 'number':
      case 'boolean':
        newData.set(currChain, value);
        this.#_updateViewFrame(currChain, value);
        break;
      case 'array':
        let newValue = this.#_transformPureData(value);
        newData.set(currChain, newValue);
        this.#_updateViewFrame(currChain, newValue);
        break;
      case 'object':
        Object.entries(value).forEach(([key, val]) => this.#_flatModel(
          this.#_getModelTypeofInfo(val).name,
          val,
          currChain + '.' + key,
          newData,
        ));
        break;
    }
    return newData;
  }

  #_chainIdRegex = /^([^\[\]]+[^\[\].])(?:\[(\d+)\])?$/;

  #_parseChainIdInfo(chainId) {
    let matchChainId = chainId.match(this.#_chainIdRegex);
    let ok = matchChainId !== null;
    let index = ok ? matchChainId[2] : undefined;
    let isArray = index !== undefined;
    return {
      ok,
      isArray,
      chainId: ok ? matchChainId[1] : '',
      index: isArray ? parseInt(index) : -1,
    };
  }

  #_getUpdateInfo(chainId, value = null) {
    let valueType = 'null';
    if (value !== null) {
      let modelTypeofInfo = this.#_getModelTypeofInfo(value);
      if (modelTypeofInfo.state > 2) {
        throw new Error(juruoReplace(_msgPkg.modelValueTypeNotExpected, {
          value: JSON.stringify(value),
        }));
      }
      valueType = modelTypeofInfo.name;
    }

    let {
      ok: isQuerryOk,
      chainId: chainId_,
      isArray: isQuerryArray,
      index,
    } = this.#_parseChainIdInfo(chainId);
    let modelMap = this._modelMap;

    if (isQuerryOk && modelMap.has(chainId_)) {
      let oldValue = modelMap.get(chainId_);
      let oldValueType = this.#_getModelTypeofInfo(oldValue).name;

      if (!isQuerryArray || oldValueType === 'array') {
        let value_ = value;
        if (isQuerryArray) {
          switch (valueType) {
            case 'array':
              value_ = this.#_transformPureData(value);
              break;
          }
        }

        return {
          ok: true,
          chainId: chainId_,
          oldValue,
          oldValueType,
          value: value_,
          valueType,
          isQuerryArray,
          index,
        };
      }
    }

    console.error(new Error(juruoReplace(_msgPkg.chainIdNotExist, {chainId})));
    return {ok: false};
  }

  set(chainId, value = null) {
    let {
      ok: isCheckOk,
      chainId: chainId_,
      oldValue,
      oldValueType,
      valueType,
      isQuerryArray,
      index,
    } = this.#_getUpdateInfo(chainId, value);

    if (!isCheckOk) {
      return;
    }

    // Array 只能替換 Array 欄位
    let isArrayForOldValue = oldValueType === 'array';
    let isArrayForValue = valueType === 'array';
    if (!isQuerryArray && isArrayForOldValue !== isArrayForValue) {
      return;
    }

    let modelMap = this._modelMap;
    let value_ = value;
    if (isQuerryArray) {
      value_ = oldValue;
      oldValue[index] = value;
      this.#_updateViewFrame(chainId, value);
    } else {
      modelMap.set(chainId_, value_);
    }
    this.#_updateViewFrame(chainId_, value_);

    return value;
  }

  setArray(chainId) {
    let {
      ok: isCheckOk,
      oldValue,
      oldValueType,
      isQuerryArray,
    } = this.#_getUpdateInfo(chainId, null);

    if (!isCheckOk || isQuerryArray || oldValueType !== 'array') {
      return;
    }

    setTimeout(arrayAddress => {
      let newValue = this.#_transformPureData(arrayAddress);
      this._modelMap.set(chainId, newValue);
      this.#_updateViewFrame(chainId, newValue);
    }, 0, oldValue);

    return oldValue;
  }

  get(chainId, handleOption) {
    let {
      ok: isCheckOk,
      oldValue,
      oldValueType,
      isQuerryArray,
      index,
    } = this.#_getUpdateInfo(chainId);

    if (!isCheckOk) {
      return _txtNA;
    }

    let value
      = isQuerryArray ? oldValue[index]
      : oldValueType === 'array' ? this.#_transformPureData(oldValue)
      : oldValue
    ;
    return ModelValue.parseValue(value, handleOption);
  }

  delete(chainId, isDeleteListener = false) {
    if (this.#_chainIdRegex.test(chainId)) {
      let modelMap = this._modelMap;
      if (modelMap.has(chainId)) {
        modelMap.delete(chainId);
        this.#_updateViewFrame(chainId);
      }
      for (let key of modelMap.keys()) {
        if (key.startsWith(chainId)) {
          modelMap.delete(key);
          this.#_updateViewFrame(key);
        }
      }
      if (isDeleteListener) {
        this.deleteAllListeners(chainId);
      }
    }
  }

  deleteAllListeners(chainId) {
    if (this.#_chainIdRegex.test(chainId)) {
      let eventNames = viewModel.eventNames();
      for (let key of eventNames) {
        if (key.startsWith(chainId)) {
          viewModel.removeAllListeners(key);
        }
      }
    }
  }

  clear() {
    this._modelMap.clear();
    this.removeAllListeners();
  }


  #_updateView(chainId, newValue) {
    this.emit(chainId, new ModelValue(newValue));
  }

  #_chainIdUpdateTimerId = 0;
  #_chainIdUpdateQueue = [];

  #_updateViewFrame(chainId, value) {
    let queue = this.#_chainIdUpdateQueue;
    if (!~queue.indexOf(chainId)) {
      queue.push([chainId, value]);
    }
    if (this.#_chainIdUpdateTimerId === 0) {
      this.#_chainIdUpdateTimerId
        = setAnimFrameTimer(_ => this.#_requestUpdateViewFrame());
    }
  }

  #_requestUpdateViewFrame() {
    let queue = this.#_chainIdUpdateQueue;
    this.#_chainIdUpdateQueue = [];
    this.#_chainIdUpdateTimerId = 0;

    for (let idx = 0, len = queue.length; idx < len; idx++) {
      let item = queue[idx];
      if (queue.lastIndexOf(item) === idx) {
        this.emit(item[0], new ModelValue(item[1]));
      }
    }
  }


  parse(chainId) {
    if (!this.#_chainIdRegex.test(chainId)) {
      return;
    }

    let modelMap = this._modelMap;
    let isFound = false;
    let rtnAns = {};
    let chainIdPrefixLength = chainId.length + 1;
    for (let [theChainId, theValue] of modelMap.entries()) {
      if (theChainId.startsWith(chainId)) {
        isFound = true;

        let otherChainIdTxt = theChainId.substring(chainIdPrefixLength);
        let splitOtherChainIdList = otherChainIdTxt.split('.');
        let floor = rtnAns;
        let idx = 0;
        for (let len = splitOtherChainIdList.length -1; idx < len; idx++) {
          let key = splitOtherChainIdList[idx];
          if (floor[key] == null || floor[key].constructor !== Object) {
            floor[key] = {};
          }
          floor = floor[key];
        }
        floor[splitOtherChainIdList[idx]] = theValue instanceof Array
          ? this.#_transformPureData(theValue)
          : theValue
        ;
      }
    }

    if (isFound) {
      return rtnAns;
    }
  }
}

export const viewModel = new ViewModel;


export class ViewModelStateDirective extends AsyncDirective {
  #_chainId = '';
  #_handleOption = null;

  constructor(partInfo) {
    super(partInfo);
    viewModel.on(this.#_chainId, this.setValue);
  }

  reconnected() {
    viewModel.on(this.#_chainId, this.setValue);
  }

  disconnected() {
    viewModel.removeListener(this.#_chainId, this.setValue);
  }

  update(part, [chainId, handleOption = null]) {
    let isUpdate = false;
    if (this.#_chainId !== chainId) {
      isUpdate = true;
      let listener = this.setValue;
      viewModel.removeListener(this.#_chainId, listener);
      viewModel.on(chainId, listener);
      this.#_chainId = chainId;
    }

    let {
      isUpdate: isUpdate_,
      handleOption: handleOption_,
    } = this.#_checkHandleOption(handleOption);
    if (isUpdate_) {
      this.#_handleOption = handleOption_;
    }

    return isUpdate || isUpdate_
      ? this.render(chainId, handleOption_)
      : noChange
    ;
  }

  render(chainId, handleOption = null) {
    return viewModel.get(chainId, handleOption);
  }

  updateValue(modelValue, handleOption) {
    return modelValue.parseValue(handleOption);
  }

  setValue = modelValue => {
    super.setValue(modelValue.isNA
      ? _txtNA
      : this.updateValue(modelValue, this.#_handleOption),
    );
  }

  #_checkHandleOption(handleOption = null) {
    if (typeof handleOption === 'function') {
      return {isUpdate: true, handleOption};
    }

    let isNull = false;
    let interpolations_ = {...handleOption};
    let interpolationsKeys = Object.keys(interpolations_);
    if (interpolationsKeys.length === 0) {
      isNull = true;
      interpolations_ = null;
    }

    let oldInterpolations = this.#_handleOption;
    let isNullForOldValue = oldInterpolations === null;

    let isUpdate = isNull !== isNullForOldValue;
    if (!isNull && !isNullForOldValue) {
      isUpdate = true;
      if (interpolationsKeys.length === oldInterpolations.length) {
        let isUpdate_ = false;
        for (let key of interpolationsKeys) {
          if (interpolations_[key] !== oldInterpolations[key]) {
            isUpdate_ = true;
            break;
          }
        }
        isUpdate = isUpdate_;
      }
    }

    return {isUpdate, handleOption: interpolations_};
  }
}

export class ViewModelUnsafeHTMLDirective extends ViewModelStateDirective {
  render(chainId, handleOption = null) {
    let value = super.render(chainId, handleOption);
    return typeof value === 'symbol' ? value : unsafeHTML(value);
  }

  updateValue(modelValue, handleOption) {
    let value = super.updateValue(modelValue, handleOption);
    return typeof value === 'symbol' ? value : unsafeHTML(value);
  }
}

export const viewModelState = directive(ViewModelStateDirective);
export const viewModelUnsafeHTML
  = directive(ViewModelUnsafeHTMLDirective);

