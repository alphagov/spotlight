define([
  'common/views/visualisations/volumetrics/number',
  'extensions/views/view',
  'extensions/collections/collection'
],
function (VolumetricsNumberView, View, Collection) {
  describe('VolumetricsNumberView', function () {
    var subject, collection;
    beforeEach(function () {
      spyOn(VolumetricsNumberView.prototype, 'render');
      collection = new Collection();
      collection.reset({
        data: [
          { count: 1 },
          { count: 2 },
          { count: 3 },
          { count: 4 },
          { count: null },
          { count: null }
        ]
      }, { parse: true });
      subject = new VolumetricsNumberView({
        collection: collection,
        valueAttr: 'count'
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
      it('should call the view format method with the collection mean', function () {
        spyOn(VolumetricsNumberView.prototype, 'formatValue').andReturn('456');
        spyOn(subject.collection, 'mean').andReturn(10);
        var returnValue;
        returnValue = subject.getValue();
        expect(subject.collection.mean).toHaveBeenCalledWith('count');
        expect(VolumetricsNumberView.prototype.formatValue).toHaveBeenCalledWith(10);
        expect(returnValue).toEqual('456');
      });
    });

    describe('getLabel', function () {

      var prefix;

      beforeEach(function () {
        prefix = 'Some prefix';
        subject.labelPrefix = prefix;
      });

      describe('when there are unavailable periods', function () {

        it('should return the appropriately formatted label', function () {
          expect(subject.getLabel()).toEqual(prefix + ' last 6 weeks <span class="unavailable">(2 weeks unavailable)</span>');
        });

        it('should return the appropriately formatted label for arbitrary periods', function () {
          collection.dataSource.setQueryParam('period', 'month');
          expect(subject.getLabel()).toEqual(prefix + ' last 6 months <span class="unavailable">(2 months unavailable)</span>');
        });

        it('should return (no data) when it can\'t find a collection', function () {
          var nullVolumetricsNumberView = new VolumetricsNumberView({
            collection: new Collection()
          });
          expect(nullVolumetricsNumberView.getLabel()).toEqual('(no data)');
        });
      });

      describe('when there are not unavailable periods', function () {
        beforeEach(function () {
          collection.reset({
            data: [
              { count: 1 },
              { count: 2 },
              { count: 3 },
              { count: 4 },
              { count: 5 },
              { count: 6 }
            ]
          }, { parse: true });
        });

        it('should return the appropriately formatted label', function () {
          expect(subject.getLabel()).toEqual(prefix + ' last 6 weeks');
        });

        it('should return the appropriately formatted label for arbitrary periods', function () {
          collection.dataSource.setQueryParam('period', 'month');
          expect(subject.getLabel()).toEqual(prefix + ' last 6 months');
        });

      });

    });

    describe('getValueSelected', function () {
      it('should call the view format method with the appropriate selectedModel attribute', function () {
        var fakeSelection = {
          selectedModel: collection.at(0)
        };
        spyOn(View.prototype, 'format').andReturn('456');
        var returnValue;
        returnValue = subject.getValueSelected(fakeSelection);
        expect(View.prototype.format).toHaveBeenCalledWith(1, { type : 'number', magnitude : true, pad : true });
        expect(returnValue).toEqual('456');
      });
    });

    describe('getLabelSelected', function () {
      it('should call the view formatPeriod method with the appropriate selectedModel attribute', function () {
        var fakeSelection = {
          selectedModel: collection.at(0)
        };
        spyOn(View.prototype, 'formatPeriod').andReturn('456');
        var returnValue;
        returnValue = subject.getLabelSelected(fakeSelection);
        expect(View.prototype.formatPeriod).toHaveBeenCalledWith(collection.at(0), 'week');
        expect(returnValue).toEqual('456');
      });
    });

  });
});
