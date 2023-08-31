
import {noChange} from 'lit';
import {directive, Directive, PartType} from 'lit/directive.js';


let _knownElemList = new WeakSet();

class ElemSelfDirective extends Directive {
  constructor(partInfo) {
    super(partInfo);
    if (partInfo.type !== PartType.ELEMENT) {
      throw new Error(
        'The `ElemSelf` directive must be used in the element attribute area.',
      );
    }
  }

  update(part, [info, markName, updated]) {
    let elem = part.element;
    let isNotExist = !_knownElemList.has(elem);
    if (isNotExist) {
      _knownElemList.add(elem);

      if (markName !== undefined) {
        let markName_ = markName || elem.classList[0];
        if (markName_ !== undefined) {
          info[markName_] = elem;
        }
      }
    }
    if (typeof updated === 'function') {
      updated(elem, isNotExist);
    }
    return noChange;
  }
}

let _elemSelfDirective = directive(ElemSelfDirective);
let _elemData = new WeakMap();

export class ElemSelf {
  mark(markTag, updated) {
    if (typeof markTag === 'function') {
      [markTag, updated] = [undefined, markTag];
    }
    return _elemSelfDirective(this, markTag, updated);
  }

  weakMap(markTag) {
    let elem;
    if (markTag instanceof Element) {
      elem = markTag;
    } else if (this.hasOwnProperty(markTag)) {
      elem = this[markTag];
    } else {
      return undefined;
    }

    if (!_elemData.has(elem)) {
      _elemData.set(elem, {});
    }
    return _elemData.get(elem);
  }
}

