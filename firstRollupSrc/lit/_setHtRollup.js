
export function setConfig(config, coreUtils) {
  const webNodeResolveOptions = config.plugins.webNodeResolve.options;
  webNodeResolveOptions.browser = false;
  webNodeResolveOptions.exportConditions = ['development'];
}

