define([
  'extensions/models/model'
],
function (Model) {
  var StagecraftApiClient = Model.extend({

    setPath: function (path) {
      this.path = path;
      this.fetch();
    },

    urlRoot: 'http://localhost:3057/stagecraft-stub',

    url: function () {
      return this.urlRoot + this.path;
    }
  });

  return StagecraftApiClient;
});
