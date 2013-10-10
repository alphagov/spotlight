require(['config'], function (requireConfig) {
  requireConfig.baseUrl = '/limelight';
  require.config(requireConfig);

  // app entry point goes here
  console.log('ready');
});

