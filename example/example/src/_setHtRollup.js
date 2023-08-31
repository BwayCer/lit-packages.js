
import useLitPkg from '../modules/@bwaycer/lits/src/useLitPkg.js';


export function setConfig(config, coreUtils, cmdArgv) {
  useLitPkg(config, coreUtils, cmdArgv, {
    replacePath: 'web/plugin/mod/lit.js',
  });
}

