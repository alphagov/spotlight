define([
  'extensions/collections/collection'
],
function (Collection) {

  return Collection.extend({

    parse: function () {
      var data = Collection.prototype.parse.apply(this, arguments);
      if (data.length > this.constructor.MAX_LENGTH) {
        data = data.slice(-this.constructor.MAX_LENGTH);
      }
      return data;
    }

  }, { 'MAX_LENGTH': 6});

});
