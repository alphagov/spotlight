define([
  'extensions/collections/collection',
  'extensions/models/data_source'
],
function (Collection, DataSource) {

  var CompletionCollection = Collection.extend({

    initialize: function (models, options) {
      this.options = options || {};
      this.denominatorMatcher = options.denominatorMatcher;
      this.numeratorMatcher = options.numeratorMatcher;
      this.matchingAttribute = options.matchingAttribute;
      this.dataSource = new DataSource(options.dataSource);
      this.flat = options.flat || this._isFlat() || false;

      Collection.prototype.initialize.apply(this, arguments);
      if (!this.denominatorMatcher) {
        throw new Error('denominatorMatcher option must be provided');
      }
      if (!this.numeratorMatcher) {
        throw new Error('numeratorMatcher option must be provided');
      }
    }

  });

  return CompletionCollection;
});
