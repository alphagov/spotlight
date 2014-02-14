define([
  'common/views/visualisations/visitors-realtime',
  'extensions/collections/collection'
],
function (VisitorsRealtimeView, Collection) {
  describe("VisitorsRealtimeView", function () {

    var collection, view, model;
    beforeEach(function() {
      collection = new Collection();
      var data = [
        {
          "_timestamp": collection.getMoment("2002-03-01T00:00:00+00:00"),
          "unique_visitors": 120
        },
        {
          "_timestamp": collection.getMoment("2002-03-01T00:03:00+00:00"),
          "unique_visitors": 100
        }
      ];
      collection.reset([ {
        id: 'test',
        title: 'test',
        values: new Collection(data)
      } ]);

      view = new VisitorsRealtimeView({
        collection: collection
      });

      jasmine.serverOnly(function () {
        view.sparkline = false;
      });
    });

    it("renders number of users at most recent timestamp", function () {
      jasmine.renderView(view, function () {
        expect(view.$el.find('.impact-number strong').text()).toEqual('100');
      });
    });

    it("renders correct labels", function () {
      jasmine.renderView(view, function () {
        expect(view.$el.find('.stat-description').text()).toEqual("users online at 12am 1 March 2002");
        expect(view.$el.find('.sparkline-title').text()).toEqual("users in the 3 minutes to 12am 1 March 2002");
      });
    });

    it("renders correct labels for data near now", function () {

      var testView, testCollection;
      testCollection = new Collection();

      var testData = [
        {
          "_timestamp": testCollection.moment().subtract('minutes', 3),
          "unique_visitors": 3
        },
        {
          "_timestamp": testCollection.moment(),
          "unique_visitors": 5
        }
      ];
      testCollection.reset([ {
        id: 'test',
        title: 'test',
        values: new Collection(testData)
      } ]);
      testView = new VisitorsRealtimeView({
        collection: testCollection
      });
      jasmine.serverOnly(function () {
        testView.sparkline = false;
      });

      jasmine.renderView(testView, function () {
        expect(testView.$el.find('.stat-description').text()).toEqual("users online now");
        expect(testView.$el.find('.sparkline-title').text()).toEqual("Users over past 3 minutes");
      });
    });

    it("renders singular labels if there is just one user", function () {

      var testView, testCollection;
      testCollection = new Collection();
      var testData = [
        {
          "_timestamp": collection.getMoment("2002-03-01T00:00:00+00:00"),
          "unique_visitors": 3
        },
        {
          "_timestamp": collection.getMoment("2002-03-01T00:03:00+00:00"),
          "unique_visitors": 1
        }
      ];
      testCollection.reset([ {
        id: 'test',
        title: 'test',
        values: new Collection(testData)
      } ]);
      testView = new VisitorsRealtimeView({
        collection: testCollection
      });
      jasmine.serverOnly(function () {
        testView.sparkline = false;
      });

      jasmine.renderView(testView, function () {
        expect(testView.$el.find('.stat-description').text()).toEqual('user online at 12am 1 March 2002');
      });
    });

    it("does not render a sparkline if there is only one data item", function () {

      var testView, testCollection;
      testCollection = new Collection();
      var testData = [
        {
          "_timestamp": collection.getMoment("2002-03-01T00:00:00+00:00"),
          "unique_visitors": 3
        }
      ];
      testCollection.reset([ {
        id: 'test',
        title: 'test',
        values: new Collection(testData)
      } ]);
      testView = new VisitorsRealtimeView({
        collection: testCollection
      });
      jasmine.serverOnly(function () {
        testView.sparkline = false;
      });

      jasmine.renderView(testView, function () {
        expect(testView.$el.find('figure').length).toEqual(0);
      });

    });

    it("renders nothing when there's no data", function () {
      var testView, testCollection;
      testCollection = new Collection();
      testCollection.reset([ {
        id: 'test',
        title: 'test',
        values: new Collection([])
      } ]);
      testView = new VisitorsRealtimeView({
        collection: testCollection
      });
      jasmine.serverOnly(function () {
        testView.sparkline = false;
      });

      jasmine.renderView(testView, function () {
        expect(testView.$el.find('div').length).toEqual(0);
      });
    });

    describe("getValue", function () {
      it("should return the right value", function (){
        var return_value = view.getValue();
        expect(return_value).toEqual(100);
      });
    });

    describe("getLabel", function () {
      it("should return the right value", function (){
        var return_value = view.getLabel();
        expect(return_value.headline).toEqual("users online at<br/> 12am 1 March 2002");
        expect(return_value.graph).toEqual("users in the 3 minutes to<br/> 12am 1 March 2002");
      });
    });

    describe("getValueSelected", function () {
      it("should return the right value", function (){
        var fakeSelection = {
          selectedModel: {
            get: function (key){
              return {
                'unique_visitors': 140
              }[key];
            }
          }
        };
        var return_value = view.getValueSelected(fakeSelection);
        expect(return_value).toEqual(140);
      });
    });

    describe("getLabelSelected", function () {
      it("should call the view formatPeriod method with the appropriate selectedModel attribute", function (){
        var fakeSelection = {
          selectedModel: {
            get: function (key){
              return {
                '_timestamp': collection.getMoment("2002-03-01T00:06:00+00:00"),
                'unique_visitors': 140
              }[key];
            }
          }
        };
        var return_value = view.getLabelSelected(fakeSelection);
        expect(return_value.headline).toEqual('users 1 Mar 2002, 12 years ago');
        expect(return_value.graph).toEqual('12 years ago');
      });
    });

  });
});
