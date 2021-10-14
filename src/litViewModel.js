
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
  constructor(model = {}) {
    super();
    this._modelMap = this.#_flatModel(model, '', new Map());
  }

  createData(chainId, model) {
    this.delete(chainId);
    this.#_flatModel(model, chainId, this._modelMap);
  }

  set(chainId, value = null) {
    this.#_allowTypeof(value);

    let modelMap = this._modelMap;
    if (!modelMap.has(chainId)) {
      console.error(new Error(
        _errorMessages.chainIdNotExist.replaceAll('{{chainId}}', chainId),
      ));
      return;
    }

    modelMap.set(chainId, value);
    this.#_updateView(chainId, value);

    return value;
  }

  get(chainId, interpolations) {
    let modelMap = this._modelMap;

    if (!modelMap.has(chainId)) {
      console.error(new Error(
        _errorMessages.chainIdNotExist.replaceAll('{{chainId}}', chainId),
      ));
      return 'N/A';
    }

    let value = modelMap.get(chainId);
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

  #_allowTypeof(value, isValue = true) {
    switch (value == null || value.constructor) {
      case true: return 'null';
      case String: return 'string';
      case Number: return 'number';
      case Boolean: return 'boolean';
      case Array: return 'array';
      case Object:
        if (isValue) {
          throw new Error(
            _errorMessages.modelValueTypeNotExpected
              .replaceAll('{{type}}', 'object')
              .replaceAll('{{value}}', JSON.stringify(value)),
          );
        }
        return 'object';
      default:
        throw new Error(
          _errorMessages.modelValueTypeNotExpected
            .replaceAll('{{type}}', typeof value)
            .replaceAll('{{value}}', JSON.stringify(value)),
        );
    }
  }

  #_flatModel(data, currChain, newData) {
    switch (this.#_allowTypeof(data, false)) {
      case 'null':
        newData.set(currChain, null);
        this.#_updateView(currChain, null);
        break;
      case 'string':
      case 'number':
      case 'boolean':
        newData.set(currChain, data);
        this.#_updateView(currChain, data);
        break;
      case 'array':
        for (let val of data) {
          this.#_allowTypeof(val);
        }
        newData.set(currChain, data);
        this.#_updateView(currChain, data);
        break;
      case 'object':
        Object.entries(data).forEach(
          item =>
            this.#_flatModel(item[1], currChain + '.' + item[0], newData),
        );
        break;
    }
    return newData;
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

