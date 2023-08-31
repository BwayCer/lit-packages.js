
import {render} from 'lit';

import {
  stopAnimFramePromise,
  stopPromise, createFlatPromise,
} from '@bwaycer/tendon';


function _jointManagement(method, info) {
  switch (info.type + '-' + method) {
    case 'styleLink-id':
      return `styleLink-${info.url}`;
    case 'styleLink-initial':
      info.elem.media = 'none';
      break;
    case 'styleLink-create': {
      return new Promise((resolve, reject) => {
        let {type, url} = info;
        let id = _jointManagement('id', info);
        let elem = document.createElement('link');
        elem.dataset.viewAttachment = id;
        elem.rel = 'stylesheet';
        elem.href = url;
        elem.media = 'none';
        elem.onload = function () {
          resolve({type, elem: this});
        };
        document.head.appendChild(elem);
      });
    }
    case 'styleLink-ok':
      info.elem.media = 'all';
      break;
    case 'script-id':
      return `script-${info.url}`;
    case 'script-initial':
      info.elem.media = 'none';
      break;
    case 'script-create': {
      return new Promise((resolve, reject) => {
        let {type, url} = info;
        let id = _jointManagement('id', info);
        let elem = document.createElement('script');
        elem.dataset.viewAttachment = id;
        elem.src = url;
        elem.onload = function () {
          resolve({type, elem: this});
        };
        document.head.appendChild(elem);
      });
    }
    case 'script-ok':
      info.elem.media = 'all';
      break;
    default:
      console.error(
        new Error(`Type "${info.type}" does not exist in ViewAttachment.`)
      );
  }
}

export async function updateViewAttachment(infos, timeoutMs = 333) {
  document.querySelectorAll('[data-view-attachment]')
    .forEach(elem => elem.remove())
  ;


  let {promise, resolve} = createFlatPromise();
  let isCallFollowUp = true;
  let followUp = () => {
    if (isCallFollowUp) {
      isCallFollowUp = false;
      resolve();
    }
  }

  let promiseList = [];
  for (let idx = 0, len = infos.length; idx < len; idx++) {
    let info = infos[idx];
    let promise = _jointManagement('create', info)
      .then(result => _jointManagement('ok', result))
    ;
    if (info.sync === true) {
      await promise;
    } else {
      promiseList.push(promise);
    }
  }

  Promise.all([
    Promise.all(promiseList).then(followUp),
    stopPromise(timeoutMs).then(followUp),
  ]);

  return promise;
}


export class ViewTitle {
  _title = document.querySelector('title');
  _icon = Array.from(document.querySelectorAll('link[rel="icon"]'));

  title(title) {
    this._title.innerHTML = title;
  }

  icon(url, size) {
    let _icon = this._icon;
    switch (_icon.length) {
      case 0: {
        let elemIcon = document.createElement('link');
        elemIcon.id = 'favicon';
        elemIcon.rel = 'icon';
        _icon.push(elemIcon);
        document.head.appendChild(elemIcon);
      }
      case 1:
        _icon[0].href = url;
        break;
      default: {
        for (let elemIcon of _icon.values()) {
          if (elemIcon.sizes.value === size) {
            elemIcon.href = url;
            break;
          }
        }
      }
    }
  }
}

export async function updateLitView(elemView, template, isClear = false) {
  if (isClear) {
    elemView.textContent = '';
  }
  await stopAnimFramePromise();
  render(template, elemView, {host: this});
}

