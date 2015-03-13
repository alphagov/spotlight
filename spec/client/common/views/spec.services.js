define([
  'client/views/services',
  'backbone'
], function (ServicesView, Backbone) {

  describe('Services View', function () {

    beforeEach(function () {
      spyOn(window.history, 'replaceState');
      window.GOVUK = {
        analytics: {
          trackEvent: function () {}
        }
      };
      this.$el = $('<div><input id="filter" value="passport"/><select id="department"><option value="">All</option><option value="home-office">Home Office</option></select></div>');
      this.view = new ServicesView({
        el: this.$el,
        model: new Backbone.Model()
      });
    });

    it('uses the history API to update the URL after filtering', function () {
      this.view.filter();
      expect(window.history.replaceState).toHaveBeenCalledWith(null, null, '?filter=passport');
      this.$el.find('#department').val('home-office');
      this.view.filter();
      expect(window.history.replaceState).toHaveBeenCalledWith(null, null, '?filter=passport&department=home-office');
      this.$el.find('#filter').val('');
      this.view.filter();
      expect(window.history.replaceState).toHaveBeenCalledWith(null, null, '?department=home-office');
    });

    it('sends filter events to analytics', function() {

      spyOn(window.GOVUK.analytics, 'trackEvent');
      this.$el.find('#filter').val('carer').trigger('search');
      expect(window.GOVUK.analytics.trackEvent).toHaveBeenCalledWith('ppServices', 'filter', {
        label: 'carer',
        nonInteraction: true
      });

      this.$el.find('#department').val('home-office').trigger('change');
      expect(window.GOVUK.analytics.trackEvent).toHaveBeenCalledWith('ppServices', 'departmentFilter', {
        label: 'home-office',
        nonInteraction: true
      });
    });

  });

});
