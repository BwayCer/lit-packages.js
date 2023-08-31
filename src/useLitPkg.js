
export const modulePatterns = [
  'lit',
  'lit/**/*',
  '!lit/decorators.js',
  '!lit/decorators/**/*',
  '!lit/directive-helpers.js',
  '!lit/directives/**/*',
  // '!lit/directives/async-append.js',
  // '!lit/directives/async-replace.js',
  // '!lit/directives/choose.js',
  // '!lit/directives/guard.js',
  // '!lit/directives/if-defined.js',
  // '!lit/directives/join.js',
  // '!lit/directives/keyed.js',
  // '!lit/directives/live.js',
  // '!lit/directives/map.js',
  // '!lit/directives/range.js',
  // '!lit/directives/ref.js',
  // '!lit/directives/template-content.js',
  // '!lit/directives/unsafe-svg.js',
  // '!lit/directives/until.js',
  // '!lit/directives/when.js',
  '!lit/html.js',
  '!lit/polyfill-support.js',
  'lit/directives/cache.js',
  'lit/directives/class-map.js',
  'lit/directives/repeat.js',
  'lit/directives/style-map.js',
  'lit/directives/unsafe-html.js',
];

export default function (config, coreUtils, cmdArgv, options) {
  const {
    replacePath,
    litPkgModuleName = '@bwaycer/lits',
  } = options;

  if (typeof replacePath !== 'string' || replacePath === '') return;

  config.pluginLink.moduleMaps.push([
    replacePath,
    modulePatterns,
    [
      '/**/*',
      `!/**/${litPkgModuleName}/src/mod/**/*`,
    ],
  ]);
}

