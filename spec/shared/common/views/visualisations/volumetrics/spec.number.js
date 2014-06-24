define([
  'common/views/visualisations/volumetrics/number',
  'extensions/views/view',
  'extensions/collections/collection',
  'extensions/models/model'
],
function (VolumetricsNumberView, View, Collection, Model) {
  describe('VolumetricsNumberView', function () {
    var subject, collection, model;
    beforeEach(function () {
      spyOn(VolumetricsNumberView.prototype, 'render');
      collection = new Collection();
      model = new Model();
      subject = new VolumetricsNumberView({
        collection: collection,
        model: model
      });
    });

    describe('formatValue', function () {
      it('should call the view format method with the value', function () {
        spyOn(View.prototype, 'format').andReturn('456');
        var returnValue;
        returnValue = subject.formatValue('123');
        expect(View.prototype.format).toHaveBeenCalledWith('123', { type: 'number', magnitude: true, pad: true });
        expect(returnValue).toEqual('456');
      });
    });

    describe('getValue', function () {
      it('should call the view format method with the appropriate collection model value', function () {
        subject.valueAttr = 'someAttr';
        var fakeModel = {
          get: function (key) {
            return {
              'someAttr': '123'
            }[key];
          }
        };
        spyOn(collection, 'at').andReturn(fakeModel);
        spyOn(VolumetricsNumberView.prototype, 'formatValue').andReturn('456');
        var returnValue;
        returnValue = subject.getValue();
        expect(VolumetricsNumberView.prototype.formatValue).toHaveBeenCalledWith('123');
        expect(returnValue).toEqual('456');
      });

      it('should return null when it doesn\'t have a collection', function () {
        var nullVolumetricsNumberView = new VolumetricsNumberView({
          collection: new Collection(),
          model: new Model()
        });
        expect(nullVolumetricsNumberView.getValue()).toEqual(null);
      });
    });

    describe('getLabel', function () {
      var fakeModel, prefix;
      beforeEach(function () {
        spyOn(collection, 'at');
        collection.at.plan = function () {
          return fakeModel;
        };
        prefix = 'Some prefix';
        subject.labelPrefix = prefix;
      });

      describe('when there are unavailable periods', function () {
        beforeEach(function () {
          fakeModel = {
            get: function (key) {
              return {
                periods: {
                  total: 12,
                  available: 10
                }
              }[key];
            }
          };
        });

        it('should return the appropriately formatted label', function () {
          expect(subject.getLabel()).toEqual(prefix + ' last 12 weeks <span class="unavailable">(2 weeks unavailable)</span>');
        });

        it('should return the appropriately formatted label for arbitrary periods', function () {
          subject.model.set('period', 'month');
          expect(subject.getLabel()).toEqual(prefix + ' last 12 months <span class="unavailable">(2 months unavailable)</span>');
        });

        it('should return (no data) when it can\'t find a collection', function () {
          var nullVolumetricsNumberView = new VolumetricsNumberView({
            collection: new Collection(),
            model: new Model()
          });
          expect(nullVolumetricsNumberView.getLabel()).toEqual('(no data)');
        });
      });

      describe('when there are not unavailable periods', function () {
        beforeEach(function () {
          fakeModel = {
            get: function (key) {
              return {
                periods: {
                  total: 12,
                  available: 12
                }
              }[key];
            }
          };
        });

        it('should return the appropriately formatted label', function () {
          expect(subject.getLabel()).toEqual(prefix + ' last 12 weeks');
        });

        it('should return the appropriately formatted label for arbitrary periods', function () {
          subject.model.set('period', 'month');
          expect(subject.getLabel()).toEqual(prefix + ' last 12 months');
        });

      });

    });

    describe('getValueSelected', function () {
      it('should call the view format method with the appropriate selectedModel attribute', function () {
        subject.selectionValueAttr = 'someAttr';
        var fakeSelection = {
          selectedModel: {
            get: function (key) {
              return {
                'someAttr': '789'
              }[key];
            }
          }
        };
        spyOn(View.prototype, 'format').andReturn('456');
        var returnValue;
        returnValue = subject.getValueSelected(fakeSelection);
        expect(View.prototype.format).toHaveBeenCalledWith('789', { type : 'number', magnitude : true, pad : true });
        expect(returnValue).toEqual('456');
      });
    });

    describe('getLabelSelected', function () {
      it('displays formatted label for selected period', function () {

        var selection = new Model();
        selection.set('_start_at', subject.getMoment('2014-01-01T00:00:00+00:00'));
        selection.set('_end_at', subject.getMoment('2014-04-01T00:00:00+00:00'));

        expect(subject.getLabelSelected({ selectedModel: selection, selectedGroupIndex: 0 })).toEqual('1 Jan to 31 Mar 2014');
      });

      it('displays formatted label for selected period when selectedGroupIndex is null', function () {

        var selection = new Model();
        selection.set('_start_at', subject.getMoment('2014-01-01T00:00:00+00:00'));
        selection.set('_end_at', subject.getMoment('2014-04-01T00:00:00+00:00'));

        expect(subject.getLabelSelected({ selectedModel: selection, selectedGroupIndex: null })).toEqual('1 Jan to 31 Mar 2014');
      });
    });

  });
});
