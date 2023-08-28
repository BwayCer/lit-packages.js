
import {
  LitElement, html, css,
} from 'lit';
import {
  customElement, property,
} from 'lit/decorators.js';
import {
  viewModel, litViewModel, litViewModelUnsafeHTML,
} from '../assets/directive/viewModel.js';

import sampleLitCss from './_sample.lit.js.scss';
import sampleLitPug from './_sample.lit.js.pug';


@customElement('view-model-sample')
export class ViewModelSample extends LitElement {
  @property({type: Object, reflect: true, attribute: 'data-interpolation-name'})
  interpolationName = 'litViewModel';

  static styles = sampleLitCss(css);

  _updateCount = 0;

  render() {
    return sampleLitPug(html, {
      lifecycleCount: this._updateCount + 1,
      interpolationName: this.interpolationName,
      requestUpdateOnClick:
        _ => this.requestUpdate(),
      interpolationsOnChange:
        evt => this.interpolationName = evt.currentTarget.value,
      viewModel,
      litViewModel,
      litViewModelUnsafeHTML,
    });
  }

  updated(changedProperties) {
    this._updateCount += 1;
  }
}


viewModel.createData('main', {
  text:
    'Hello <span style="background: #556b2f; color: #f0ffff;">{{name}}</span>',
});

Object.assign(window, {viewModel});

document.body.appendChild(document.createElement('view-model-sample'));
