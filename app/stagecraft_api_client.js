define([
  'extensions/models/model'
],
function (Model) {
  var StagecraftApiClient = Model.extend({

    setPath: function (path) {
      this.path = path;
      this.fetch();
    },

    url: function () {
      return this.urlRoot + this.path;
    }
  });

  return StagecraftApiClient;
});
