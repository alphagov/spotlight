require(['config'], function (requireConfig) {
  require.config(requireConfig);
  window.isClient = true;
  window.isServer = false;

  require(['stagecraft_api_client'], function (StagecraftApiClient) {
    var model = new StagecraftApiClient(GOVUK.config, { parse: true });

    var ControllerClass = model.get('controller');
    var controller = new ControllerClass({
      model: model
    });
    controller.render({ init: true });
  });
});

