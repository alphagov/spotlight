var DashboardView = require('../dashboard');

module.exports = DashboardView.extend({

  getContext: function () {
    return _.extend(DashboardView.prototype.getContext.apply(this, arguments), {
      hasFooter: true
    });
  },

  getMetaDescription: function () {
    var description = ['View performance statistics for the \'',
        this.model.get('title'),
        '\' service from the Performance Platform on GOV.UK'];
    return description.join('');
  },

  getTagline: function () {
    return this.model.get('tagline') || 'This dashboard shows information about how ' +
            'the <strong>' + this.model.get('title') +
            '</strong> service is currently performing.';
  },

});
