define([
  'backbone',
  'extensions/mixins/date-functions',
  'underscore'
],
function (Backbone, DateFunctions, _) {
  var Model = Backbone.Model.extend({
    
    /**
     * Default date format used for parsing and serialisation
     */
    defaultDateFormat: 'YYYY-MM-DDTHH:mm:ssZ',

    /**
     * Converts date attributes into moment date objects
     */
    parse: function (attributes) {

      var dateAttrs = ['_timestamp', '_start_at', '_end_at'];

      attributes = Backbone.Model.prototype.parse(attributes);
      _.each(dateAttrs, function (attr) {
        var value = attributes[attr];
        if (!value) {
          return;
        }
        
        var date = this.getMoment(value, this.defaultDateFormat);
        if (date.isValid()) {
          attributes[attr] = date;
        } else {
          console.warn(value, 'is not a valid date');
        }
      }, this);

      return attributes;
    }
  });

  _.extend(Model.prototype, DateFunctions);

  return Model;
});
