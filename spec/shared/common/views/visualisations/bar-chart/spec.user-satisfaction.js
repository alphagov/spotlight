define([
  'common/views/visualisations/bar-chart/user-satisfaction',
  'common/views/visualisations/bar-chart/bar-chart',
  'common/collections/journey',
  'extensions/collections/collection',
  'backbone'
],
function (UserSatisfaction, BarChart, JourneyCollection, Collection, Backbone) {

  describe('UserSatisfaction Bar Chart', function () {
    var graph;

    beforeEach(function () {
      spyOn(UserSatisfaction.prototype, 'render');

      graph = new UserSatisfaction({
        collection: new Collection([ { values: new Collection([]) } ], { format: 'integer' })
      });
    });

    describe('initialize()', function () {
      it('calls render() on a reset of the collection data', function () {
        expect(UserSatisfaction.prototype.render).not.toHaveBeenCalled();

        graph.collection.at(0).get('values').reset();
        expect(UserSatisfaction.prototype.render).toHaveBeenCalled();
      });
    });

    describe('components()', function () {
      beforeEach(function () {
        spyOn(BarChart.prototype, 'components').andReturn({
          hover: {
            view: {}
          },
          xaxis: {
            view: Backbone.View
          }
        });
      });

      it('removes the hover component from the BarChart', function () {
        expect(graph.components().hover).toBeUndefined();
      });

      it('sets the xasis to not useEllipses', function () {
        expect(graph.components().xaxis.view.prototype.useEllipses).toEqual(false);
      });
    });

  });

});
