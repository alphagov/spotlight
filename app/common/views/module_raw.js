define([
  'common/views/module_standalone',
  'common/views/module'
],
function (StandaloneView, Module) {

  var ModuleRawView = StandaloneView.extend({

    templateContext: function () {
      var context = StandaloneView.prototype.templateContext.apply(this, arguments);
      context.bodyClasses += ' raw';
      return context;
    }

  });

  return ModuleRawView;
});
