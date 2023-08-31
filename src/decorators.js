
// NOTE:
//   由於 lit 還在使用 `{kind, elements, finisher()}` 方案，
//   想使用 lit/decorators.js 則必須選用 legacy 版本的 babel 裝飾器及
//   @babel/plugin-proposal-class-properties,
//   @babel/plugin-proposal-private-methods 二者的支援。
//   babel 2023-05 版本無法向下兼容，且如 lit @property 刪除 class 屬性的方法
//   並無其他方法可以替代，這或許是 lit 官方還無法提供更新的原因
//   https://github.com/lit/lit/issues/3200。
//   個人認為新版本的調用方式較為合理，所以決定設計新版可用的裝飾器方案。


// @customElement('my-element')
// class MyElement extends LitElement {
//   @property({type: String})
//   prop = '...';
//
//   @state()
//   _prop = 0;
//
//   @query('selector', true)
//   elem = null;
//
//   @query('selector', true)
//   elemCache = null;
//
//   // @queryAll,
//   // @queryAsync(...)
//
//   ...
// }
//
// same as
//
// @customElement('my-element', {
//   property: {
//     prop: {type: String, value: '...'},
//     _prop: {state: true, value: 0},
//   },
//   query: {
//     elem: 'selector',
//   },
//   queryCache: {
//     elem: 'selector',
//   },
//   // queryAll: {...},
//   // queryAsync: {...},
// })
// class MyElement extends LitElement {
//   ...
// }
export const customElement = (tagName, setMember) => clazz => {
  if (typeof tagName === 'string') {
    customElements.define(tagName, clazz);
  }

  if (!setMember) return;

  const {
    property,
    // eventOptions
  } = setMember;
  const queryAllowList = [
    'query', 'queryCache', 'queryAll', 'queryAsync',
    // queryAssignedElements, queryAssignedNodes,
  ];

  const properties = [];
  if (property) {
    for (const key in property) {
      if (Object.hasOwn(property, key)) {
        clazz.createProperty(key, property[key]);
        properties.push([key, property[key].value]);
      }
    }
  }

  for (const memberName of queryAllowList) {
    const info = setMember[memberName];
    if (info) {
      for (const key in info) {
        if (Object.hasOwn(info, key)) {
          _setQuery(memberName, clazz, key, info[key]);
        }
      }
    }
  }


  // maybe user performUpdate or lit performUpdate
  const isSuper = !Object.hasOwn(clazz.prototype, 'performUpdate');
  const refPerformUpdate = clazz.prototype.performUpdate;
  let isPanding = true;
  clazz.prototype.performUpdate = function () {
    // 預防性質，邏輯上會被原本 performUpdate 取代
    if (isPanding) {
      isPanding = false;
      _setProperties(this, properties);
    }
    refPerformUpdate.call(this);
    if (isSuper) {
      Reflect.deleteProperty(clazz.prototype, 'performUpdate');
      clazz.prototype.performUpdate = clazz.prototype.performUpdate;
    } else {
      clazz.prototype.performUpdate = refPerformUpdate;
    }
  };
};

function _setProperties(self, properties) {
  for (const [key, val] of properties) {
    // 刪除 instance 下的屬性並把值複製到 constructor.prototype
    // 因為 lit @property 設計會在 performUpdate 時執行檢查。
    Reflect.deleteProperty(self, key);
    self[key] = val;
  }
}

function _setQuery(type, clazz, memberName, selector) {
  let getMethod;
  switch (type) {
    case 'query':
      getMethod = function () {
        return this.renderRoot?.querySelector(selector) ?? null;
      };
      break;
    case 'queryCache':
      getMethod = function () {
        const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
        if (this[key] === undefined) {
          this[key] = this.renderRoot?.querySelector(selector) ?? null;
        }
        return this[key];
      };
      break;
    case 'queryAll':
      getMethod = function () {
        return this.renderRoot?.querySelectorAll(selector) ?? [];
      };
      break;
    case 'queryAll':
      getMethod = function () {
        return this.renderRoot?.querySelectorAll(selector) ?? [];
      };
      break;
    case 'queryAsync':
      getMethod = async function () {
        await this.updateComplete;
        return this.renderRoot?.querySelector(selector);
      };
      break;
  }

  Reflect.defineProperty(clazz.prototype, memberName, {
    get: getMethod,
    enumerable: true,
    configurable: true,
  });
}

