define([
  'extensions/views/view',
  'stache!common/templates/missing-data'
],
  function (View, Template) {
    return View.extend({

      template: Template

    });
  });
