define([
  'backbone',
  'moment'
],
function (Backbone, moment) {
  var Model = Backbone.Model.extend({
    
    moment: moment,

    /**
     * Default date format used for parsing and serialisation
     */
    defaultDateFormat: 'YYYY-MM-DDTHH:mm:ssTZ',

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
        
        var date = this.moment(value, this.defaultDateFormat);
        if (date.isValid()) {
          attributes[attr] = date;
        } else {
          console.warn(value, 'is not a valid date');
        }
      })

      return attributes;
    }
  });

  return Model;
});
