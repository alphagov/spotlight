define([
  'common/views/module_standalone'
],
function (StandaloneView) {

  var ModuleRawView = StandaloneView.extend({

    templateContext: function () {
      var context = StandaloneView.prototype.templateContext.apply(this, arguments);
      context.bodyClasses += ' raw';
      return context;
    }

  });

  return ModuleRawView;
});
