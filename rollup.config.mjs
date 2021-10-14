
import path from 'path';

import rollupNodeResolve from '@rollup/plugin-node-resolve';
import rollupNodePolyfills from 'rollup-plugin-node-polyfills';
import {babel as rollupBabel} from '@rollup/plugin-babel';
import {terser as rollupTerser} from 'rollup-plugin-terser';


const _basePath = path.join(import.meta.url.substring(5), '../src');


let _resolveExternal = (() => {
  const _nativeModules = [
    'events', 'stream', 'util', 'path', 'buffer', 'querystring', 'url',
    'string_decoder', 'punycode', 'http', 'https', 'os', 'assert',
    'constants', 'timers', 'console', 'vm', 'zlib', 'tty', 'domain',
    'dns', 'dgram', 'child_process', 'cluster', 'module', 'net',
    'readline', 'repl', 'tls', 'fs', 'fs/promises', 'crypto',
  ];

  return function _resolveExternal(handle) {
    return (id, fromPath) => {
      let isEntry = false;
      let isNativeModules = false;
      let isExternal = false;

      if (fromPath === undefined) {
        return handle(true, isNativeModules, isExternal);
      }

      let basePath = _basePath + '/';
      let filePath
        = id.startsWith('/') ? id
        : id.startsWith('.') ? path.join(fromPath, '..', id)
        : null
      ;

      if (!fromPath.startsWith('/')) {
        isNativeModules = isExternal = true;
      } else if (!fromPath.startsWith(basePath)) {
        isExternal = true;
      } else if (filePath === null) {
        if (~_nativeModules.indexOf(id)) {
          isNativeModules = isExternal = true;
        } else {
          isExternal = true;
        }
      } else if (!filePath.startsWith(basePath)) {
        isExternal = true;
      }
      return handle(isEntry, isNativeModules, isExternal);
    };
  };
})();

let _plugins = [
  rollupNodeResolve({
    browser: true,
    preferBuiltins: false,
    moduleDirectories: ['node_modules'],
  }),
  rollupNodePolyfills(),
  rollupBabel({
    babelHelpers: 'bundled',
    presets: [
      ['@babel/preset-env', {'targets': 'cover 75%'}],
    ],
    plugins: [
      ['@babel/plugin-proposal-decorators', {'decoratorsBeforeExport': true}],
      ['@babel/plugin-proposal-class-properties', {'loose': true}],
      ['@babel/plugin-proposal-private-methods', {'loose': true}],
      ['@babel/plugin-proposal-private-property-in-object', {'loose': true}],
    ],
  }),
  rollupTerser({
    compress: true,
    mangle: true,
  }),
];

export default [
  {
    input: 'src/litViewModel.js',
    output: {
      file: 'dist/litViewModel.js',
      format: 'es',
    },
    external: _resolveExternal((isEntry, isNativeModules, isExternal) => {
      return !isEntry && isExternal;
    }),
    plugins: _plugins,
  },
  {
    input: 'src/litViewModel.js',
    output: [
      {
        file: 'dist/litViewModel.browser.es.js',
        format: 'es',
      },
      {
        file: 'dist/litViewModel.browser.umd.js',
        format: 'umd',
        name: 'litViewModel',
      },
    ],
    plugins: _plugins,
  },
];

