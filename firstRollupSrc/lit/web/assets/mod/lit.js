
// https://lit.dev/docs/components/decorators/#built-in-decorators
// export * from 'lit/decorators.js';


// NOTE:
// v3 vs v2 difference:
// - not found:
//   - lit:
//       (排除分散到各文件的方法，
//        剩下的大部分是筆者沒用過的，所以也不知是被移除或者提供新的替代物)
//       SVGTemplateResult, Template, TemplateInstance, TemplateResult,
//       isDirective, isIterable, isPrimitive, isTemplatePartActive, parts,
//   - lit/async-directive.js or lit-html:
//        AttributePart, BooleanAttributePart, PropertyPart, EventPart, ChildPart
//        (猜測是建議使用 `PartType` 判斷並以字串回傳，所以用不到就沒提供吧！)

// lit@v3
export {
  'CSSResult', 'LitElement', 'ReactiveElement', 'adoptStyles', 'css',
  'defaultConverter', 'getCompatibleStyle', 'html', 'isServer', 'noChange',
  'notEqual', 'nothing', 'render', 'supportsAdoptingStyleSheets', 'svg',
  'unsafeCSS'
  // _$LE, _$LH,
} from 'lit';


export {directive, Directive, PartType} from 'lit/directive.js';
export {cache} from 'lit/directives/cache.js';
export {classMap} from 'lit/directives/class-map.js';
export {repeat} from 'lit/directives/repeat.js';
export {styleMap} from 'lit/directives/style-map.js';
export {unsafeHTML} from 'lit/directives/unsafe-html.js';

export {AsyncDirective} from 'lit/async-directive.js';

export {unsafeStatic} from 'lit/static-html.js';

