
import {
  customElement,
  LitElement, html, css,
  classMap, attrMap,
} from '../plugin/litPkg.js';

import sampleLitCss from './_sample.lit.js.scss';
import sampleLitPug from './_sample.lit.js.pug';


@customElement('attr-map-sample', {
  property: {
    red: {type: Boolean, value: true},
    green: {type: Boolean, value: true},
    blue: {type: Boolean, value: false},
  },
})
export class AttrMapSample extends LitElement {
  static get styles() {
    return sampleLitCss(css);
  }

  render() {
    const classInfo = {
      onRed: this.red,
      onGreen: this.green,
      onBlue: this.blue,
    };
    const attrInfo = {
      'data-red': this.red,
      'data-green': this.green,
      'data-blue': this.blue,
    };
    return sampleLitPug(html, {
      classInfo,
      classListTxt: this._randerAttrInfo(classInfo),
      classMap: classMap(classInfo),
      attrListTxt: this._randerAttrInfo(attrInfo),
      attrMap: attrMap(attrInfo),
      redToggleOnClick: _ => this.red = !this.red,
      greenToggleOnClick: _ => this.green = !this.green,
      blueToggleOnClick: _ => this.blue = !this.blue,
    });
  }

  _randerAttrInfo(attrInfo) {
    return Object.keys(attrInfo).filter(key => attrInfo[key]).join(' ');
  }
}


document.body.appendChild(document.createElement('attr-map-sample'));

