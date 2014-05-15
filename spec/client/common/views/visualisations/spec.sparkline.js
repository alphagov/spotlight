define([
  'common/views/visualisations/multi_stat_item/sparkline',
  'extensions/collections/collection',
  'backbone'
], function (SparklineView, Collection, Backbone) {

  describe('Sparkline', function () {

    var view;

    beforeEach(function () {
      view = new SparklineView({
        model: new Backbone.Model(),
        collection: new Collection()
      });
    });

    describe('getPeriod', function () {

      it('returns hour by default', function () {
        expect(view.getPeriod()).toEqual('hour');
      });

      it('returns view\'s period property if set', function () {
        view.period = 'week';
        expect(view.getPeriod()).toEqual('week');
      });

      it('returns model\'s period property if set', function () {
        view.model.set('period', 'day');
        expect(view.getPeriod()).toEqual('day');
      });

    });

  });

});