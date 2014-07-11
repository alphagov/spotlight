define([
  'extensions/collections/collection'
],
function (Collection) {

  var CompletionCollection = Collection.extend({

    initialize: function (models, options) {
      this.options = options || {};
      this.denominatorMatcher = options.denominatorMatcher;
      this.numeratorMatcher = options.numeratorMatcher;
      this.matchingAttribute = options.matchingAttribute;

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
