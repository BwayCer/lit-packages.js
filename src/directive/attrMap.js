
import {
  noChange,
  directive, Directive, PartType,
} from '../lit';


class AttrMap extends Directive {
  constructor(partInfo) {
    super(partInfo);
    if (partInfo.type !== PartType.ELEMENT) {
      throw new Error('The `AttrMap` directive must be used in the element attribute area.');
    }
  }

  _ownAttributeName = new Map();

  // https://lit.dev/docs/templates/custom-directives/#differences-between-update()-and-render()
  // NOTE:
  // - 在瀏覽器環境處調用 `this.render()` 無效，猜測與 PartType.ELEMENT 有關吧？
  update(part, [attrInfo]) {
    if (attrInfo.constructor !== Object) {
      throw new TypeError('Failed to execute `AttrMap` directive: parameter 1 is not of type `Object`.');
    }

    const _ownAttributeName = this._ownAttributeName;
    const elem = part.element;

    for (let [name, propName] of _ownAttributeName.values()) {
      if (!Object.hasOwn(attrInfo, name)) {
        elem.removeAttribute(propName);
        _ownAttributeName.delete(name);
      }
    }

    this._resolveAttrInfo(attrInfo).forEach((item) => {
      let [name, propName, value] = item;
      let prevValue = _ownAttributeName.get(name);
      if (value !== prevValue) {
        elem.setAttribute(propName, value);
        _ownAttributeName.set(name, item);
      }
    });

    return noChange;
  }

  render(attrInfo) {
    return this._resolveAttrInfo(attrInfo)
      .map(([_, propName, value]) =>
        value === '' ? propName : `${propName}="${val}"`,
      )
      .join(' ')
    ;
  }

  _resolveAttrInfo(attrInfo) {
    return Object.entries(attrInfo).reduce((accu, [name, val]) => {
      let isEffectiveValue = false;
      let value = val;
      switch (val === null || typeof val) {
        case 'string':
          isEffectiveValue = val !== '';
          break;
        case 'number':
          isEffectiveValue = true;
          break;
        case 'boolean':
          isEffectiveValue = val;
          value = '';
          break;
      }
      if (isEffectiveValue) {
        let propName = name.replace(/([A-Z])/g, '-$1').toLowerCase();
        accu.push([name, propName, value]);
      }
      return accu;
    }, []);
  }
}

export const attrMap = directive(AttrMap);

