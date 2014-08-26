require(['config'], function (requireConfig) {
  require.config(requireConfig);
  window.isClient = true;
  window.isServer = false;

  require(['client/client_bootstrap', 'client/logger'], function (bootstrap) {
    bootstrap(GOVUK.config);
  });
});
