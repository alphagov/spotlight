define([
  'extensions/views/view',
  'stache!extensions/templates/missing-data'
],
  function (View, Template) {
    return View.extend({

      template: Template

    });
  });
