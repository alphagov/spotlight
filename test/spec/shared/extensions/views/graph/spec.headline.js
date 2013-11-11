define([
  'extensions/views/graph/headline',
  'extensions/models/query'],
  function(Headline, Query) {
    describe("Headline", function() {
      describe("initialize", function() {
        it("should initialize with a model", function() {
          var model = new Query();
          spyOn(model, 'on');
          new Headline({
            model: model
          });
          expect(model.on).toHaveBeenCalled();
        });
      });

      describe("rendering", function() {
        var model;

        beforeEach(function () {
          model = new Query({
            period: 'week'
          });
        });

        it("should render headline with default prefix", function() {
          var headline = new Headline({model: model});

          jasmine.renderView(headline, function () {
            expect(headline.$el).toHaveText("Total forms received per week over the last 9 weeks");
          });
        });

        it("should render headline with specified prefix", function() {
          var headline = new Headline({
            model: model,
            prefix: 'Number of things happening'
          });

          jasmine.renderView(headline, function () {
            expect(headline.$el).toHaveText("Number of things happening per week over the last 9 weeks");
          });
        });
      });
    });
  });
