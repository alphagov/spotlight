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
        spyOn(View.prototype, 'format').and.returnValue('456');
        var returnValue;
        returnValue = subject.formatValue('123');
        expect(View.prototype.format).toHaveBeenCalledWith('123', { type: 'number', magnitude: true, pad: true });
        expect(returnValue).toEqual('456');
      });
    });

    describe('getValue', function () {
      it('should call the view format method with the last defined model (valueAttr) on the collection', function () {
        spyOn(VolumetricsNumberView.prototype, 'formatValue');

        subject.getValue();

        expect(VolumetricsNumberView.prototype.formatValue).toHaveBeenCalledWith(4);
      });

      it('should call the view format method with null if there is no last defined models in the collection', function () {
        spyOn(VolumetricsNumberView.prototype, 'formatValue');
        spyOn(Collection.prototype, 'lastDefined').and.returnValue(undefined);

        subject.getValue();

        expect(VolumetricsNumberView.prototype.formatValue).toHaveBeenCalledWith(null);
      });
    });

    describe('getLabel', function () {

      var prefix;

      beforeEach(function () {
        prefix = 'week';
        subject.labelPrefix = prefix;
      });

      describe('should show the last available date in the collection', function () {
        beforeEach(function () {
          collection.reset({
            data: [
              { count: 1, '_timestamp': '2014-07-14T00:00:00+00:00' },
              { count: 2, '_timestamp': '2014-07-14T00:00:00+00:00' },
              { count: 3, '_timestamp': '2014-07-14T00:00:00+00:00' },
              { count: 4, '_timestamp': '2014-07-14T00:00:00+00:00' },
              { count: 5, '_timestamp': '2014-07-14T00:00:00+00:00' },
              { count: 6, '_timestamp': '2014-07-14T00:00:00+00:00' }
            ]
          }, { parse: true });
        });

        it('should return the appropriately formatted label', function () {
          expect(subject.getLabel()).toEqual('14 July 2014');
        });

        it('should return the appropriately formatted label for arbitrary periods', function () {
          spyOn(collection.dataSource, 'get').and.returnValue({period: 'month'});
          expect(subject.getLabel()).toEqual('July 2014');
        });

      });

    });

    describe('getValueSelected', function () {
      it('should call the view format method with the appropriate selectedModel attribute', function () {
        var fakeSelection = {
          selectedModel: collection.at(0)
        };
        spyOn(View.prototype, 'format').and.returnValue('456');
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
        spyOn(View.prototype, 'formatPeriod').and.returnValue('456');
        var returnValue;
        returnValue = subject.getLabelSelected(fakeSelection);
        expect(View.prototype.formatPeriod).toHaveBeenCalledWith(collection.at(0), 'week');
        expect(returnValue).toEqual('456');
      });
    });

  });
});
