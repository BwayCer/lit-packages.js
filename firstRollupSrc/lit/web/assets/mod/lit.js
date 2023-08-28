
// https://lit.dev/docs/components/decorators/#built-in-decorators
// export * from 'lit/decorators.js';


// lit@v2 old version
// export {
  // AttributeCommitter, AttributePart, BooleanAttributePart, CSSResult, DefaultTemplateProcessor, EventPart, LitElement, NodePart, PropertyCommitter, PropertyPart, ReactiveElement, SVGTemplateResult, Template, TemplateInstance, TemplateResult, adoptStyles, createMarker, css, defaultConverter, defaultTemplateProcessor, directive, getCompatibleStyle, html, isDirective, isIterable, isPrimitive, isTemplatePartActive, noChange, notEqual, nothing, parts, removeNodes, render, reparentNodes, supportsAdoptingStyleSheets, svg, templateCaches, templateFactory, unsafeCSS,
// } from 'lit';

// lit@v3
// export {
  // CSSResult, LitElement, ReactiveElement, adoptStyles,
  // css, defaultConverter, getCompatibleStyle, html,
  // noChange, notEqual, nothing,
  // render, supportsAdoptingStyleSheets, svg, unsafeCSS,
// } from 'lit';

// NOTE:
// not found:
// - lit:
//     TemplateResult
// - lit/async-directive.js or lit-html:
//      AttributePart, BooleanAttributePart, PropertyPart, EventPart, ChildPart

export * from 'lit';


export {directive, Directive, PartType} from 'lit/directive.js';
export {cache} from 'lit/directives/cache.js';
export {classMap} from 'lit/directives/class-map.js';
export {repeat} from 'lit/directives/repeat.js';
export {styleMap} from 'lit/directives/style-map.js';
export {unsafeHTML} from 'lit/directives/unsafe-html.js';

export {AsyncDirective} from 'lit/async-directive.js';

export {unsafeStatic} from 'lit/static-html.js';

