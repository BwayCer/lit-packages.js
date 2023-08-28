
export function setConfig(config, coreUtils) {
  const babelDecorators = [
    '@babel/plugin-proposal-decorators',
    {
      // 'version': '2018-09',
      'decoratorsBeforeExport': true,
    },
  ];
  const babelPlugins = [
    ['@babel/plugin-proposal-class-properties'/* , {'loose': true} */],
    ['@babel/plugin-proposal-private-methods'/* , {'loose': true} */],
    ['@babel/plugin-proposal-private-property-in-object'/* , {'loose': true} */],
  ];
  const configBabelDecorators = config.pluginLink.babelPlugins
    .find(item => item[0] === babelDecorators[0]);
  if (configBabelDecorators === undefined) {
    config.pluginLink.babelPlugins.push(babelDecorators, ...babelPlugins);
  } else {
    configBabelDecorators[1] = babelDecorators[1];
    config.pluginLink.babelPlugins.push(...babelPlugins);
  }
}

