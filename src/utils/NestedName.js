
const _nestedNameRegex = /(>*)([.&])([A-Za-z0-9_-]+)(?: *: *([A-Za-z0-9_]+))?/g;

export class NestedName {
  constructor(namesTxt) {
    let self = this;
    let currLayer = 0;
    let layerNames = [];

    namesTxt.replace(
      _nestedNameRegex,
      function(_, space, method, layerName, markName) {
        let markName_ = markName;
        if (markName_ === undefined) {
          markName_ = layerName;
        }

        let oldCurrLayer = currLayer;
        currLayer = space.length;

        let isTrim = oldCurrLayer > currLayer;
        if (isTrim) {
          layerNames.length = currLayer;
        }

        layerNames[currLayer] = layerName;
        self[markName_] = layerNames.join('');
      },
    );
  }
}

