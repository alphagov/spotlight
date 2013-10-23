require(['config'], function (requireConfig) {
  require.config(requireConfig);
  window.isClient = true;
  window.isServer = false;

  // app entry point goes here
  console.log('ready');
});

