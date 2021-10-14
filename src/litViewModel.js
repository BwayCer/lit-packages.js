
import EventEmitter from 'events';
import {noChange} from 'lit';
import {AsyncDirective, directive} from 'lit/async-directive.js';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';


const _errorMessages = {
  chainIdNotExist: 'The chainId "{{chainId}}" is not exist.',
  modelValueTypeNotExpected:
    'The model value type is not accepted. (actually: <{{type}}> "{{value}}")',
};


export class ModelValue {
  constructor(value) {
    this.#_value = value;
    this.#_isCanInterpolate
      = typeof value === 'string' && !!~value.indexOf('{{')
    ;
  }

  #_value;
  #_isCanInterpolate = false;

  get value() {
    return this.#_value;
  }

  get isNA() {
    return this.#_value === undefined;
  }

  getValue(interpolations) {
    return this.isNA ? 'N/A' : this.interpolate(interpolations);
  }

  interpolate(interpolations) {
    let txt = this.#_value;
    return !this.#_isCanInterpolate || interpolations == null
      ? txt
      : Object.entries(interpolations).reduce(
        (accu, [key, value]) => accu.replaceAll(`{{${key}}}`, value),
        txt,
      )
    ;
  }
}


export class ViewModel extends EventEmitter {
  constructor(model = null) {
    super();
    this._modelMap = new Map();
    if (this.#_getModelTypeofInfo(model).name === 'object') {
      this.#_flatModel(model, '', this._modelMap);
    }
  }

  createData(chainId, model) {
    if (typeof chainId === 'string' && chainId !== '') {
      this.delete(chainId);
      this.#_flatModel(model, chainId, this._modelMap);
    }
  }

  // state:            0            1       2        3     4
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

  #_isNotPureData(value, data) {
    switch (this.#_getModelTypeofInfo(value).name) {
      case 'array':
        value.forEach(val => this.#_isNotPureData(val, data));
        break;
      case 'object':
        Object.values(value).forEach(val => this.#_isNotPureData(val, data));
        break;
      case 'other':
        throw new Error(
          _errorMessages.modelValueTypeNotExpected
            .replaceAll('{{type}}', 'array')
            .replaceAll('{{value}}', JSON.stringify(value)),
        );
        break;
    }
  }

  #_transformPureData(data) {
    return JSON.parse(JSON.stringify(data));
  }

  #_flatModel(value, currChain, newData) {
    switch (this.#_getModelTypeofInfo(value).name) {
      case 'undefined':
      case 'null':
        newData.set(currChain, null);
        this.#_updateView(currChain, null);
        break;
      case 'string':
      case 'number':
      case 'boolean':
        newData.set(currChain, value);
        this.#_updateView(currChain, value);
        break;
      case 'array':
        let newValue = this.#_transformPureData(value);
        newData.set(currChain, newValue);
        this.#_updateView(currChain, newValue);
        break;
      case 'object':
        Object.entries(value).forEach(
          item =>
            this.#_flatModel(item[1], currChain + '.' + item[0], newData),
        );
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
      this.#_isNotPureData(value);
      valueType = this.#_getModelTypeofInfo(value).name;
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
            case 'object':
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

    console.error(new Error(
      _errorMessages.chainIdNotExist.replaceAll('{{chainId}}', chainId),
    ));
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
      this.#_updateView(chainId, value);
    } else {
      modelMap.set(chainId_, value_);
    }
    this.#_updateView(chainId_, value_);

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
      this.#_updateView(chainId, newValue);
    }, 0, oldValue);

    return oldValue;
  }

  get(chainId, interpolations) {
    let {
      ok: isCheckOk,
      oldValue,
      oldValueType,
      isQuerryArray,
      index,
    } = this.#_getUpdateInfo(chainId);

    if (!isCheckOk) {
      return 'N/A';
    }

    let value
      = isQuerryArray ? oldValue[index]
      : oldValueType === 'array' ? this.#_transformPureData(oldValue)
      : oldValue
    ;
    let modelValue = new ModelValue(value);
    return modelValue.getValue(interpolations);
  }

  delete(chainId) {
    let modelMap = this._modelMap;
    if (modelMap.has(chainId)) {
      modelMap.delete(chainId);
      this.#_updateView(chainId);
    }
    for (let key of modelMap.keys()) {
      if (key.startsWith(chainId)) {
        modelMap.delete(key);
        this.#_updateView(chainId);
      }
    }
  }

  clear() {
    this._modelMap.clear();
    this.removeAllListeners();
  }

  async #_updateView(chainId, newValue) {
    this.emit(chainId, new ModelValue(newValue));
  }
}

export const viewModel = new ViewModel;


export class LitViewModelDirective extends AsyncDirective {
  #_chainId = '';
  #_interpolations = null;

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

  update(part, [chainId, interpolations = null]) {
    let isUpdate = false;
    if (this.#_chainId !== chainId) {
      isUpdate = true;
      let listener = this.setValue;
      viewModel.removeListener(this.#_chainId, listener);
      viewModel.on(chainId, listener);
      this.#_chainId = chainId;
    }
    if (this.#_interpolationsChanged(interpolations)) {
      isUpdate = true;
      this.#_interpolations = interpolations === null
        ? interpolations
        : {...interpolations}
      ;
    }

    return isUpdate
      ? this.render(chainId, interpolations)
      : noChange
    ;
  }

  render(chainId, interpolations = null) {
    return viewModel.get(chainId, interpolations);
  }

  updateValue(modelValue, interpolations) {
    return modelValue.getValue(interpolations);
  }

  setValue = modelValue => {
    super.setValue(modelValue.isNA
      ? 'N/A'
      : this.updateValue(modelValue, this.#_interpolations),
    );
  }

  #_interpolationsChanged(interpolations) {
    let _interpolations = this.#_interpolations;

    if (interpolations !== _interpolations) {
      return true;
    }
    if (interpolations === null) {
      return false;
    }

    let ip1 = Object.keys(interpolations);
    let ip2 = Object.keys(_interpolations);
    if (ip1.length !== ip2.length) {
      return true;
    }

    for (let key of ip1) {
      if (interpolations[key] !== _interpolations[key]) {
        return true;
      }
    }

    return false;
  }
}

export class LitViewModelUnsafeHTMLDirective extends LitViewModelDirective {
  render(chainId, interpolations) {
    let value = super.render(chainId, interpolations);
    return typeof value === 'symbol' ? value : unsafeHTML(value);
  }

  updateValue(modelValue, interpolations) {
    let value = super.updateValue(modelValue, interpolations);
    return typeof value === 'symbol' ? value : unsafeHTML(value);
  }
}

export const litViewModel = directive(LitViewModelDirective);
export const litViewModelUnsafeHTML
  = directive(LitViewModelUnsafeHTMLDirective);

