require(['config'], function (requireConfig) {
  requireConfig.baseUrl = '/limelight';
  require.config(requireConfig);
  window.isClient = true;
  window.isServer = false;

  // app entry point goes here
  console.log('ready');
});

