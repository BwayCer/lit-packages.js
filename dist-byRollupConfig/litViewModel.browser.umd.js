!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).litViewModel={})}(this,(function(t){"use strict";function e(t,e){return function(t,e){if(e.get)return e.get.call(t);return e.value}(t,s(t,e,"get"))}function i(t,e,i){return function(t,e,i){if(e.set)e.set.call(t,i);else{if(!e.writable)throw new TypeError("attempted to set read only private field");e.value=i}}(t,s(t,e,"set"),i),i}function s(t,e,i){if(!e.has(t))throw new TypeError("attempted to "+i+" private field on non-instance");return e.get(t)}function n(t,e,i){if(!e.has(t))throw new TypeError("attempted to get private field on non-instance");return i}function r(t,e){if(e.has(t))throw new TypeError("Cannot initialize the same private elements twice on an object")}function o(t,e,i){r(t,e),e.set(t,i)}function l(t,e){r(t,e),e.add(t)}function a(){}function h(){h.init.call(this)}function c(t){return void 0===t._maxListeners?h.defaultMaxListeners:t._maxListeners}function u(t,e,i){if(e)t.call(i);else for(var s=t.length,n=m(t,s),r=0;r<s;++r)n[r].call(i)}function d(t,e,i,s){if(e)t.call(i,s);else for(var n=t.length,r=m(t,n),o=0;o<n;++o)r[o].call(i,s)}function p(t,e,i,s,n){if(e)t.call(i,s,n);else for(var r=t.length,o=m(t,r),l=0;l<r;++l)o[l].call(i,s,n)}function f(t,e,i,s,n,r){if(e)t.call(i,s,n,r);else for(var o=t.length,l=m(t,o),a=0;a<o;++a)l[a].call(i,s,n,r)}function v(t,e,i,s){if(e)t.apply(i,s);else for(var n=t.length,r=m(t,n),o=0;o<n;++o)r[o].apply(i,s)}function _(t,e,i,s){var n,r,o;if("function"!=typeof i)throw new TypeError('"listener" argument must be a function');if((r=t._events)?(r.newListener&&(t.emit("newListener",e,i.listener?i.listener:i),r=t._events),o=r[e]):(r=t._events=new a,t._eventsCount=0),o){if("function"==typeof o?o=r[e]=s?[i,o]:[o,i]:s?o.unshift(i):o.push(i),!o.warned&&(n=c(t))&&n>0&&o.length>n){o.warned=!0;var l=new Error("Possible EventEmitter memory leak detected. "+o.length+" "+e+" listeners added. Use emitter.setMaxListeners() to increase limit");l.name="MaxListenersExceededWarning",l.emitter=t,l.type=e,l.count=o.length,function(t){"function"==typeof console.warn?console.warn(t):console.log(t)}(l)}}else o=r[e]=i,++t._eventsCount;return t}function $(t,e,i){var s=!1;function n(){t.removeListener(e,n),s||(s=!0,i.apply(t,arguments))}return n.listener=i,n}function y(t){var e=this._events;if(e){var i=e[t];if("function"==typeof i)return 1;if(i)return i.length}return 0}function m(t,e){for(var i=new Array(e);e--;)i[e]=t[e];return i}a.prototype=Object.create(null),h.EventEmitter=h,h.usingDomains=!1,h.prototype.domain=void 0,h.prototype._events=void 0,h.prototype._maxListeners=void 0,h.defaultMaxListeners=10,h.init=function(){this.domain=null,h.usingDomains&&undefined.active,this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=new a,this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},h.prototype.setMaxListeners=function(t){if("number"!=typeof t||t<0||isNaN(t))throw new TypeError('"n" argument must be a positive number');return this._maxListeners=t,this},h.prototype.getMaxListeners=function(){return c(this)},h.prototype.emit=function(t){var e,i,s,n,r,o,l,a="error"===t;if(o=this._events)a=a&&null==o.error;else if(!a)return!1;if(l=this.domain,a){if(e=arguments[1],!l){if(e instanceof Error)throw e;var h=new Error('Uncaught, unspecified "error" event. ('+e+")");throw h.context=e,h}return e||(e=new Error('Uncaught, unspecified "error" event')),e.domainEmitter=this,e.domain=l,e.domainThrown=!1,l.emit("error",e),!1}if(!(i=o[t]))return!1;var c="function"==typeof i;switch(s=arguments.length){case 1:u(i,c,this);break;case 2:d(i,c,this,arguments[1]);break;case 3:p(i,c,this,arguments[1],arguments[2]);break;case 4:f(i,c,this,arguments[1],arguments[2],arguments[3]);break;default:for(n=new Array(s-1),r=1;r<s;r++)n[r-1]=arguments[r];v(i,c,this,n)}return!0},h.prototype.addListener=function(t,e){return _(this,t,e,!1)},h.prototype.on=h.prototype.addListener,h.prototype.prependListener=function(t,e){return _(this,t,e,!0)},h.prototype.once=function(t,e){if("function"!=typeof e)throw new TypeError('"listener" argument must be a function');return this.on(t,$(this,t,e)),this},h.prototype.prependOnceListener=function(t,e){if("function"!=typeof e)throw new TypeError('"listener" argument must be a function');return this.prependListener(t,$(this,t,e)),this},h.prototype.removeListener=function(t,e){var i,s,n,r,o;if("function"!=typeof e)throw new TypeError('"listener" argument must be a function');if(!(s=this._events))return this;if(!(i=s[t]))return this;if(i===e||i.listener&&i.listener===e)0==--this._eventsCount?this._events=new a:(delete s[t],s.removeListener&&this.emit("removeListener",t,i.listener||e));else if("function"!=typeof i){for(n=-1,r=i.length;r-- >0;)if(i[r]===e||i[r].listener&&i[r].listener===e){o=i[r].listener,n=r;break}if(n<0)return this;if(1===i.length){if(i[0]=void 0,0==--this._eventsCount)return this._events=new a,this;delete s[t]}else!function(t,e){for(var i=e,s=i+1,n=t.length;s<n;i+=1,s+=1)t[i]=t[s];t.pop()}(i,n);s.removeListener&&this.emit("removeListener",t,o||e)}return this},h.prototype.removeAllListeners=function(t){var e,i;if(!(i=this._events))return this;if(!i.removeListener)return 0===arguments.length?(this._events=new a,this._eventsCount=0):i[t]&&(0==--this._eventsCount?this._events=new a:delete i[t]),this;if(0===arguments.length){for(var s,n=Object.keys(i),r=0;r<n.length;++r)"removeListener"!==(s=n[r])&&this.removeAllListeners(s);return this.removeAllListeners("removeListener"),this._events=new a,this._eventsCount=0,this}if("function"==typeof(e=i[t]))this.removeListener(t,e);else if(e)do{this.removeListener(t,e[e.length-1])}while(e[0]);return this},h.prototype.listeners=function(t){var e,i,s=this._events;return i=s&&(e=s[t])?"function"==typeof e?[e.listener||e]:function(t){for(var e=new Array(t.length),i=0;i<e.length;++i)e[i]=t[i].listener||t[i];return e}
/**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */(e):[],i},h.listenerCount=function(t,e){return"function"==typeof t.listenerCount?t.listenerCount(e):y.call(t,e)},h.prototype.listenerCount=y,h.prototype.eventNames=function(){return this._eventsCount>0?Reflect.ownKeys(this._events):[]};const A=window.ShadowRoot&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,g=Symbol(),w=new Map;class b{constructor(t,e){if(this._$cssResult$=!0,e!==g)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t}get styleSheet(){let t=w.get(this.cssText);return A&&void 0===t&&(w.set(this.cssText,t=new CSSStyleSheet),t.replaceSync(this.cssText)),t}toString(){return this.cssText}}const E=A?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new b("string"==typeof t?t:t+"",g))(e)})(t):t
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */;var S;const C=window.reactiveElementPolyfillSupport,x={toAttribute(t,e){switch(e){case Boolean:t=t?"":null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},T=(t,e)=>e!==t&&(e==e||t==t),M={attribute:!0,type:String,converter:x,reflect:!1,hasChanged:T};class k extends HTMLElement{constructor(){super(),this._$Et=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Ei=null,this.o()}static addInitializer(t){var e;null!==(e=this.l)&&void 0!==e||(this.l=[]),this.l.push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((e,i)=>{const s=this._$Eh(i,e);void 0!==s&&(this._$Eu.set(s,i),t.push(s))})),t}static createProperty(t,e=M){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,s=this.getPropertyDescriptor(t,i,e);void 0!==s&&Object.defineProperty(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(s){const n=this[t];this[e]=s,this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||M}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),this.elementProperties=new Map(t.elementProperties),this._$Eu=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(E(t))}else void 0!==t&&e.push(E(t));return e}static _$Eh(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}o(){var t;this._$Ev=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Ep(),this.requestUpdate(),null===(t=this.constructor.l)||void 0===t||t.forEach((t=>t(this)))}addController(t){var e,i;(null!==(e=this._$Em)&&void 0!==e?e:this._$Em=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$Em)||void 0===e||e.splice(this._$Em.indexOf(t)>>>0,1)}_$Ep(){this.constructor.elementProperties.forEach(((t,e)=>{this.hasOwnProperty(e)&&(this._$Et.set(e,this[e]),delete this[e])}))}createRenderRoot(){var t;const e=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return((t,e)=>{A?t.adoptedStyleSheets=e.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):e.forEach((e=>{const i=document.createElement("style"),s=window.litNonce;void 0!==s&&i.setAttribute("nonce",s),i.textContent=e.cssText,t.appendChild(i)}))})(e,this.constructor.elementStyles),e}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$Em)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$Em)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)}))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$Eg(t,e,i=M){var s,n;const r=this.constructor._$Eh(t,i);if(void 0!==r&&!0===i.reflect){const o=(null!==(n=null===(s=i.converter)||void 0===s?void 0:s.toAttribute)&&void 0!==n?n:x.toAttribute)(e,i.type);this._$Ei=t,null==o?this.removeAttribute(r):this.setAttribute(r,o),this._$Ei=null}}_$AK(t,e){var i,s,n;const r=this.constructor,o=r._$Eu.get(t);if(void 0!==o&&this._$Ei!==o){const t=r.getPropertyOptions(o),l=t.converter,a=null!==(n=null!==(s=null===(i=l)||void 0===i?void 0:i.fromAttribute)&&void 0!==s?s:"function"==typeof l?l:null)&&void 0!==n?n:x.fromAttribute;this._$Ei=o,this[o]=a(e,t.type),this._$Ei=null}}requestUpdate(t,e,i){let s=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||T)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$Ei!==t&&(void 0===this._$ES&&(this._$ES=new Map),this._$ES.set(t,i))):s=!1),!this.isUpdatePending&&s&&(this._$Ev=this._$EC())}async _$EC(){this.isUpdatePending=!0;try{await this._$Ev}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Et&&(this._$Et.forEach(((t,e)=>this[e]=t)),this._$Et=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$Em)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)})),this.update(i)):this._$EU()}catch(t){throw e=!1,this._$EU(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$Em)||void 0===e||e.forEach((t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$Ev}shouldUpdate(t){return!0}update(t){void 0!==this._$ES&&(this._$ES.forEach(((t,e)=>this._$Eg(e,this[e],t))),this._$ES=void 0),this._$EU()}updated(t){}firstUpdated(t){}}
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
var N;k.finalized=!0,k.elementProperties=new Map,k.elementStyles=[],k.shadowRootOptions={mode:"open"},null==C||C({ReactiveElement:k}),(null!==(S=globalThis.reactiveElementVersions)&&void 0!==S?S:globalThis.reactiveElementVersions=[]).push("1.0.1");const L=globalThis.trustedTypes,U=L?L.createPolicy("lit-html",{createHTML:t=>t}):void 0,O=`lit$${(Math.random()+"").slice(9)}$`,P="?"+O,H=`<${P}>`,V=document,R=(t="")=>V.createComment(t),j=t=>null===t||"object"!=typeof t&&"function"!=typeof t,I=Array.isArray,W=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,D=/-->/g,z=/>/g,B=/>|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g,Q=/'/g,J=/"/g,q=/^(?:script|style|textarea)$/i,K=Symbol.for("lit-noChange"),Z=Symbol.for("lit-nothing"),F=new WeakMap,G=V.createTreeWalker(V,129,null,!1),X=(t,e)=>{const i=t.length-1,s=[];let n,r=2===e?"<svg>":"",o=W;for(let e=0;e<i;e++){const i=t[e];let l,a,h=-1,c=0;for(;c<i.length&&(o.lastIndex=c,a=o.exec(i),null!==a);)c=o.lastIndex,o===W?"!--"===a[1]?o=D:void 0!==a[1]?o=z:void 0!==a[2]?(q.test(a[2])&&(n=RegExp("</"+a[2],"g")),o=B):void 0!==a[3]&&(o=B):o===B?">"===a[0]?(o=null!=n?n:W,h=-1):void 0===a[1]?h=-2:(h=o.lastIndex-a[2].length,l=a[1],o=void 0===a[3]?B:'"'===a[3]?J:Q):o===J||o===Q?o=B:o===D||o===z?o=W:(o=B,n=void 0);const u=o===B&&t[e+1].startsWith("/>")?" ":"";r+=o===W?i+H:h>=0?(s.push(l),i.slice(0,h)+"$lit$"+i.slice(h)+O+u):i+O+(-2===h?(s.push(void 0),e):u)}const l=r+(t[i]||"<?>")+(2===e?"</svg>":"");return[void 0!==U?U.createHTML(l):l,s]};class Y{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,r=0;const o=t.length-1,l=this.parts,[a,h]=X(t,e);if(this.el=Y.createElement(a,i),G.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(s=G.nextNode())&&l.length<o;){if(1===s.nodeType){if(s.hasAttributes()){const t=[];for(const e of s.getAttributeNames())if(e.endsWith("$lit$")||e.startsWith(O)){const i=h[r++];if(t.push(e),void 0!==i){const t=s.getAttribute(i.toLowerCase()+"$lit$").split(O),e=/([.?@])?(.*)/.exec(i);l.push({type:1,index:n,name:e[2],strings:t,ctor:"."===e[1]?nt:"?"===e[1]?rt:"@"===e[1]?ot:st})}else l.push({type:6,index:n})}for(const e of t)s.removeAttribute(e)}if(q.test(s.tagName)){const t=s.textContent.split(O),e=t.length-1;if(e>0){s.textContent=L?L.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],R()),G.nextNode(),l.push({type:2,index:++n});s.append(t[e],R())}}}else if(8===s.nodeType)if(s.data===P)l.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(O,t+1));)l.push({type:7,index:n}),t+=O.length-1}n++}}static createElement(t,e){const i=V.createElement("template");return i.innerHTML=t,i}}function tt(t,e,i=t,s){var n,r,o,l;if(e===K)return e;let a=void 0!==s?null===(n=i._$Cl)||void 0===n?void 0:n[s]:i._$Cu;const h=j(e)?void 0:e._$litDirective$;return(null==a?void 0:a.constructor)!==h&&(null===(r=null==a?void 0:a._$AO)||void 0===r||r.call(a,!1),void 0===h?a=void 0:(a=new h(t),a._$AT(t,i,s)),void 0!==s?(null!==(o=(l=i)._$Cl)&&void 0!==o?o:l._$Cl=[])[s]=a:i._$Cu=a),void 0!==a&&(e=tt(t,a._$AS(t,e.values),a,s)),e}class et{constructor(t,e){this.v=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}p(t){var e;const{el:{content:i},parts:s}=this._$AD,n=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:V).importNode(i,!0);G.currentNode=n;let r=G.nextNode(),o=0,l=0,a=s[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new it(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new lt(r,this,t)),this.v.push(e),a=s[++l]}o!==(null==a?void 0:a.index)&&(r=G.nextNode(),o++)}return n}m(t){let e=0;for(const i of this.v)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class it{constructor(t,e,i,s){var n;this.type=2,this._$AH=Z,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cg=null===(n=null==s?void 0:s.isConnected)||void 0===n||n}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cg}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=tt(this,t,e),j(t)?t===Z||null==t||""===t?(this._$AH!==Z&&this._$AR(),this._$AH=Z):t!==this._$AH&&t!==K&&this.$(t):void 0!==t._$litType$?this.T(t):void 0!==t.nodeType?this.S(t):(t=>{var e;return I(t)||"function"==typeof(null===(e=t)||void 0===e?void 0:e[Symbol.iterator])})(t)?this.M(t):this.$(t)}A(t,e=this._$AB){return this._$AA.parentNode.insertBefore(t,e)}S(t){this._$AH!==t&&(this._$AR(),this._$AH=this.A(t))}$(t){this._$AH!==Z&&j(this._$AH)?this._$AA.nextSibling.data=t:this.S(V.createTextNode(t)),this._$AH=t}T(t){var e;const{values:i,_$litType$:s}=t,n="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=Y.createElement(s.h,this.options)),s);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===n)this._$AH.m(i);else{const t=new et(n,this),e=t.p(this.options);t.m(i),this.S(e),this._$AH=t}}_$AC(t){let e=F.get(t.strings);return void 0===e&&F.set(t.strings,e=new Y(t)),e}M(t){I(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new it(this.A(R()),this.A(R()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cg=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class st{constructor(t,e,i,s,n){this.type=1,this._$AH=Z,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=Z}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,s){const n=this.strings;let r=!1;if(void 0===n)t=tt(this,t,e,0),r=!j(t)||t!==this._$AH&&t!==K,r&&(this._$AH=t);else{const s=t;let o,l;for(t=n[0],o=0;o<n.length-1;o++)l=tt(this,s[i+o],e,o),l===K&&(l=this._$AH[o]),r||(r=!j(l)||l!==this._$AH[o]),l===Z?t=Z:t!==Z&&(t+=(null!=l?l:"")+n[o+1]),this._$AH[o]=l}r&&!s&&this.k(t)}k(t){t===Z?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class nt extends st{constructor(){super(...arguments),this.type=3}k(t){this.element[this.name]=t===Z?void 0:t}}class rt extends st{constructor(){super(...arguments),this.type=4}k(t){t&&t!==Z?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name)}}class ot extends st{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=tt(this,t,e,0))&&void 0!==i?i:Z)===K)return;const s=this._$AH,n=t===Z&&s!==Z||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==Z&&(s===Z||n);n&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==i?i:this.element,t):this._$AH.handleEvent(t)}}class lt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){tt(this,t)}}const at=window.litHtmlPolyfillSupport;
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
var ht,ct;null==at||at(Y,it),(null!==(N=globalThis.litHtmlVersions)&&void 0!==N?N:globalThis.litHtmlVersions=[]).push("2.0.1");class ut extends k{constructor(){super(...arguments),this.renderOptions={host:this},this._$Dt=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Dt=((t,e,i)=>{var s,n;const r=null!==(s=null==i?void 0:i.renderBefore)&&void 0!==s?s:e;let o=r._$litPart$;if(void 0===o){const t=null!==(n=null==i?void 0:i.renderBefore)&&void 0!==n?n:null;r._$litPart$=o=new it(e.insertBefore(R(),t),t,void 0,null!=i?i:{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Dt)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Dt)||void 0===t||t.setConnected(!1)}render(){return K}}ut.finalized=!0,ut._$litElement$=!0,null===(ht=globalThis.litElementHydrateSupport)||void 0===ht||ht.call(globalThis,{LitElement:ut});const dt=globalThis.litElementPolyfillSupport;null==dt||dt({LitElement:ut}),(null!==(ct=globalThis.litElementVersions)&&void 0!==ct?ct:globalThis.litElementVersions=[]).push("3.0.1");
/**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
const pt=2,ft=t=>(...e)=>({_$litDirective$:t,values:e});
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */class vt{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */const _t=(t,e)=>{var i,s;const n=t._$AN;if(void 0===n)return!1;for(const t of n)null===(s=(i=t)._$AO)||void 0===s||s.call(i,e,!1),_t(t,e);return!0},$t=t=>{let e,i;do{if(void 0===(e=t._$AM))break;i=e._$AN,i.delete(t),t=e}while(0===(null==i?void 0:i.size))},yt=t=>{for(let e;e=t._$AM;t=e){let i=e._$AN;if(void 0===i)e._$AN=i=new Set;else if(i.has(t))break;i.add(t),gt(e)}};function mt(t){void 0!==this._$AN?($t(this),this._$AM=t,yt(this)):this._$AM=t}function At(t,e=!1,i=0){const s=this._$AH,n=this._$AN;if(void 0!==n&&0!==n.size)if(e)if(Array.isArray(s))for(let t=i;t<s.length;t++)_t(s[t],!1),$t(s[t]);else null!=s&&(_t(s,!1),$t(s));else _t(this,t)}const gt=t=>{var e,i,s,n;t.type==pt&&(null!==(e=(s=t)._$AP)&&void 0!==e||(s._$AP=At),null!==(i=(n=t)._$AQ)&&void 0!==i||(n._$AQ=mt))};class wt extends vt{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,e,i){super._$AT(t,e,i),yt(this),this.isConnected=t._$AU}_$AO(t,e=!0){var i,s;t!==this.isConnected&&(this.isConnected=t,t?null===(i=this.reconnected)||void 0===i||i.call(this):null===(s=this.disconnected)||void 0===s||s.call(this)),e&&(_t(this,t),$t(this))}setValue(t){if((t=>void 0===t.strings)(this._$Ct))this._$Ct._$AI(t,this);else{const e=[...this._$Ct._$AH];e[this._$Ci]=t,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}}
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */class bt extends vt{constructor(t){if(super(t),this.it=Z,t.type!==pt)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===Z||null==t)return this.vt=void 0,this.it=t;if(t===K)return t;if("string"!=typeof t)throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this.vt;this.it=t;const e=[t];return e.raw=e,this.vt={_$litType$:this.constructor.resultType,strings:e,values:[]}}}bt.directiveName="unsafeHTML",bt.resultType=1;const Et=ft(bt),St={chainIdNotExist:'The chainId "{{chainId}}" is not exist.',modelValueTypeNotExpected:'The model value type is not accepted. (actually: <{{type}}> "{{value}}")'};var Ct=new WeakMap,xt=new WeakMap,Tt=new WeakSet;class Mt{constructor(t){l(this,Tt),o(this,Ct,{writable:!0,value:void 0}),o(this,xt,{writable:!0,value:!1}),i(this,Ct,t),i(this,xt,"string"==typeof t&&!!~t.indexOf("{{"))}get value(){return e(this,Ct)}get isNA(){return void 0===e(this,Ct)}getValue(t=null){if(this.isNA)return"N/A";if("function"==typeof t)return t(this);let i=e(this,Ct);return e(this,xt)&&null!==t&&"object"==typeof t&&(i=n(this,Tt,kt).call(this,i,t)),i}}function kt(t,e){return Object.entries(e).reduce(((t,[e,i])=>t.replaceAll(`{{${e}}}`,i)),t)}var Nt=new WeakSet,Lt=new WeakSet,Ut=new WeakSet,Ot=new WeakSet,Pt=new WeakMap,Ht=new WeakSet,Vt=new WeakSet,Rt=new WeakSet;class jt extends h{constructor(t=null){super(),l(this,Rt),l(this,Vt),l(this,Ht),l(this,Ot),l(this,Ut),l(this,Lt),l(this,Nt),o(this,Pt,{writable:!0,value:/^([^\[\]]+[^\[\].])(?:\[(\d+)\])?$/}),this._modelMap=new Map,"object"===n(this,Nt,It).call(this,t).name&&n(this,Ot,zt).call(this,t,"",this._modelMap)}createData(t,e){"string"==typeof t&&""!==t&&(this.delete(t),n(this,Ot,zt).call(this,e,t,this._modelMap))}set(t,e=null){let{ok:i,chainId:s,oldValue:r,oldValueType:o,valueType:l,isQuerryArray:a,index:h}=n(this,Vt,Qt).call(this,t,e);if(!i)return;if(!a&&"array"===o!==("array"===l))return;let c=this._modelMap,u=e;return a?(u=r,r[h]=e,n(this,Rt,Jt).call(this,t,e)):c.set(s,u),n(this,Rt,Jt).call(this,s,u),e}setArray(t){let{ok:e,oldValue:i,oldValueType:s,isQuerryArray:r}=n(this,Vt,Qt).call(this,t,null);if(e&&!r&&"array"===s)return setTimeout((e=>{let i=n(this,Ut,Dt).call(this,e);this._modelMap.set(t,i),n(this,Rt,Jt).call(this,t,i)}),0,i),i}get(t,e){let{ok:i,oldValue:s,oldValueType:r,isQuerryArray:o,index:l}=n(this,Vt,Qt).call(this,t);if(!i)return"N/A";let a=o?s[l]:"array"===r?n(this,Ut,Dt).call(this,s):s;return new Mt(a).getValue(e)}delete(t,e=!1){let i=this._modelMap;i.has(t)&&(i.delete(t),n(this,Rt,Jt).call(this,t));for(let e of i.keys())e.startsWith(t)&&(i.delete(e),n(this,Rt,Jt).call(this,t));e&&this.deleteAllListeners(t)}deleteAllListeners(t){let e=qt.eventNames();for(let i of e)i.startsWith(t)&&qt.removeAllListeners(i)}clear(){this._modelMap.clear(),this.removeAllListeners()}}function It(t){let e="",i=1;switch(null==t?t:t.constructor){case void 0:e="undefined",i=0;break;case null:e="null",i=0;break;case String:e="string";break;case Number:e=isNaN(t)?"null":"number";break;case Boolean:e="boolean";break;case Array:e="array",i=2;break;case Object:e="object",i=3;break;default:e="other",i=4}return{name:e,state:i}}function Wt(t,e){switch(n(this,Nt,It).call(this,t).name){case"array":t.forEach((t=>n(this,Lt,Wt).call(this,t,e)));break;case"object":Object.values(t).forEach((t=>n(this,Lt,Wt).call(this,t,e)));break;case"other":throw new Error(St.modelValueTypeNotExpected.replaceAll("{{type}}","array").replaceAll("{{value}}",JSON.stringify(t)))}}function Dt(t){return JSON.parse(JSON.stringify(t))}function zt(t,e,i){switch(n(this,Nt,It).call(this,t).name){case"undefined":case"null":i.set(e,null),n(this,Rt,Jt).call(this,e,null);break;case"string":case"number":case"boolean":i.set(e,t),n(this,Rt,Jt).call(this,e,t);break;case"array":let s=n(this,Ut,Dt).call(this,t);i.set(e,s),n(this,Rt,Jt).call(this,e,s);break;case"object":Object.entries(t).forEach((t=>n(this,Ot,zt).call(this,t[1],e+"."+t[0],i)))}return i}function Bt(t){let i=t.match(e(this,Pt)),s=null!==i,n=s?i[2]:void 0,r=void 0!==n;return{ok:s,isArray:r,chainId:s?i[1]:"",index:r?parseInt(n):-1}}function Qt(t,e=null){let i="null";null!==e&&(n(this,Lt,Wt).call(this,e),i=n(this,Nt,It).call(this,e).name);let{ok:s,chainId:r,isArray:o,index:l}=n(this,Ht,Bt).call(this,t),a=this._modelMap;if(s&&a.has(r)){let t=a.get(r),s=n(this,Nt,It).call(this,t).name;if(!o||"array"===s){let a=e;if(o)switch(i){case"array":case"object":a=n(this,Ut,Dt).call(this,e)}return{ok:!0,chainId:r,oldValue:t,oldValueType:s,value:a,valueType:i,isQuerryArray:o,index:l}}}return console.error(new Error(St.chainIdNotExist.replaceAll("{{chainId}}",t))),{ok:!1}}async function Jt(t,e){this.emit(t,new Mt(e))}const qt=new jt;var Kt=new WeakMap,Zt=new WeakMap,Ft=new WeakSet;class Gt extends wt{constructor(t){var i,s,n;super(t),l(this,Ft),o(this,Kt,{writable:!0,value:""}),o(this,Zt,{writable:!0,value:null}),n=t=>{super.setValue(t.isNA?"N/A":this.updateValue(t,e(this,Zt)))},(s="setValue")in(i=this)?Object.defineProperty(i,s,{value:n,enumerable:!0,configurable:!0,writable:!0}):i[s]=n,qt.on(e(this,Kt),this.setValue)}reconnected(){qt.on(e(this,Kt),this.setValue)}disconnected(){qt.removeListener(e(this,Kt),this.setValue)}update(t,[s,r=null]){let o=!1;if(e(this,Kt)!==s){o=!0;let t=this.setValue;qt.removeListener(e(this,Kt),t),qt.on(s,t),i(this,Kt,s)}let{isUpdate:l,handleOption:a}=n(this,Ft,Xt).call(this,r);return l&&i(this,Zt,a),o||l?this.render(s,a):K}render(t,e=null){return qt.get(t,e)}updateValue(t,e){return t.getValue(e)}}function Xt(t=null){if("function"==typeof t)return{isUpdate:!0,handleOption:t};let i=!1,s={...t},n=Object.keys(s);0===n.length&&(i=!0,s=null);let r=e(this,Zt),o=null===r,l=i!==o;if(!i&&!o&&(l=!0,n.length===r.length)){let t=!1;for(let e of n)if(s[e]!==r[e]){t=!0;break}l=t}return{isUpdate:l,handleOption:s}}class Yt extends Gt{render(t,e=null){let i=super.render(t,e);return"symbol"==typeof i?i:Et(i)}updateValue(t,e){let i=super.updateValue(t,e);return"symbol"==typeof i?i:Et(i)}}const te=ft(Gt),ee=ft(Yt);t.LitViewModelDirective=Gt,t.LitViewModelUnsafeHTMLDirective=Yt,t.ModelValue=Mt,t.ViewModel=jt,t.litViewModel=te,t.litViewModelUnsafeHTML=ee,t.viewModel=qt,Object.defineProperty(t,"__esModule",{value:!0})}));
