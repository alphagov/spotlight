require(['config'], function (requireConfig) {
  require.config(requireConfig);
  window.isClient = true;
  window.isServer = false;

  require(['client_bootstrap'], function (bootstrap) {
    bootstrap(GOVUK.config);
  });
});
