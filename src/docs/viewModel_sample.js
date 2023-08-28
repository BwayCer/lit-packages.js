
import {
  LitElement, html, css,
} from 'lit';
import {
  customElement, property,
} from 'lit/decorators.js';
import {
  viewModel, litViewModel, litViewModelUnsafeHTML,
} from './litViewModel.js';


@customElement('my-element')
export class MyElement extends LitElement {
  @property({type: Object, reflect: true, attribute: 'data-interpolation-name'})
  interpolationName = 'litViewModel';

  static get styles() {
    return css`
      :host {
        font-size: 16px;
        line-height: 1.6em;
        display: block;
        padding: 1em 0.4em;
      }
      pre {
        margin: 0;
      }
      input {
        line-height: 1.4em;
        padding: 0 0.4em;
      }
      .tagCode {
        background: antiquewhite;
      }
      .interpolationNameInput {
        width: 38em;
      }
    `;
  }

  _updateCount = 0;

  render() {
    let interpolations = {name: this.interpolationName};
    return html`
<pre><code class="tagCode">&lt;my-element data-lifecycle-count="${
  this._updateCount + 1
}" data-interpolation-name="${
  this.interpolationName
}"&gt;</code>
  touchRootElement: <button @click=${
  () => this.requestUpdate()
}>requestUpdate</button>
  interpolations: { name: <input type="text" @change=${
  evt => this.interpolationName = evt.currentTarget.value
} value=${this.interpolationName}></input> }
  text: <input class="interpolationNameInput" type="text" @change=${
  evt => viewModel.set('main.text', evt.currentTarget.value)
} value=${litViewModel('main.text')}></input>
  state: "${litViewModel('main.text', {name: this.interpolationName})}"
  stateHTML: "${litViewModelUnsafeHTML('main.text', interpolations)}"
  text length: "${litViewModel(
    'main.text',
    modelValue => modelValue.getValue(interpolations).toString().length
  )}"
<code class="tagCode">&lt;/my-element&gt;</code></pre>
    `;
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

document.body.appendChild(document.createElement('my-element'));

