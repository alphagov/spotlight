define([
  'client/views/services',
  'common/collections/services',
  'backbone'
], function (ServicesView, ServicesCollection, Backbone) {

  describe('Services View', function () {

    beforeEach(function () {
      window.history.replaceState({}, '', window.location.href.split('?')[0]);
      spyOn(window.history, 'replaceState');
      window.GOVUK = {
        analytics: {
          trackEvent: function () {}
        }
      };
      this.$el = $('<div><input id="filter" value="passport"/><select id="department"><option value="">All</option><option value="home-office">Home Office</option></select><select id="service-group"><option value="">All</option><option value="service1">Service 1</option></select></div>');
      this.view = new ServicesView({
        el: this.$el,
        model: new Backbone.Model(),
        collection: new ServicesCollection([])
      });
    });

    it('uses the history API to update the URL after filtering', function () {
      this.view.filter('filter');
      expect(window.history.replaceState).toHaveBeenCalledWith(null, null, '?filter=passport');
      this.$el.find('#department').val('home-office');
      this.view.filter('department');
      expect(window.history.replaceState).toHaveBeenCalledWith(null, null, '?filter=passport&department=home-office');
      this.$el.find('#filter').val('');
      this.view.filter('filter');
      expect(window.history.replaceState).toHaveBeenCalledWith(null, null, '?department=home-office');
      this.$el.find('#service-group').val('service1');
      this.view.filter('service-group');
      expect(window.history.replaceState).toHaveBeenCalledWith(null, null, '?department=home-office&servicegroup=service1');
    });

    it('sends filter events to analytics', function() {
      spyOn(window.GOVUK.analytics, 'trackEvent');
      this.$el.find('#filter').val('carer').trigger('search');
      expect(window.GOVUK.analytics.trackEvent).toHaveBeenCalledWith('ppServices', 'filter', {
        label: 'carer',
        nonInteraction: true
      });
      this.$el.find('#department').val('home-office').trigger('change');
      expect(window.GOVUK.analytics.trackEvent).toHaveBeenCalledWith('ppServices', 'department', {
        label: 'home-office',
        nonInteraction: true
      });
    });

  });

});
