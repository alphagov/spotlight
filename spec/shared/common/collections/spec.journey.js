define([
  'common/collections/journey',
  'extensions/collections/collection',
  'extensions/collections/matrix'
], function (JourneyCollection, Collection, MatrixCollection) {
  describe('JourneyCollection', function () {
    describe('getDataByTableFormat', function () {
      var collection;

      beforeEach(function () {
        spyOn(MatrixCollection.prototype, 'getDataByTableFormat');
        collection = new JourneyCollection([{}], {
          steps: [
            {
              id: 'example:start',
              title: 'Start'
            },
            {
              id: 'example:end',
              title: 'End'
            }
          ],
          axisLabels: {
            x: {
              key: 'title'
            },
            y: {
              key: 'b'
            }
          }
        });
        collection.at(0).set('values', new Collection([
          { title: 'Start', b: 3 },
          { title: 'End', b: 1 }
        ]));
      });

      it('calls the MatrixCollection getDataByTableFormat if no steps are set', function () {
        delete collection.options.steps;
        collection.getDataByTableFormat();
        expect(MatrixCollection.prototype.getDataByTableFormat).toHaveBeenCalled();
      });

      it('will not call the MatrixCollection if steps are set', function () {
        collection.getDataByTableFormat();
        expect(MatrixCollection.prototype.getDataByTableFormat).not.toHaveBeenCalled();
      });

      it('returns an array', function () {
        expect(_.isArray(collection.getDataByTableFormat())).toEqual(true);
      });

      it('sorts the array by tabular format with the correct step heading and cell data', function () {
        var expected = [['Start', 'End'], [3, 1]];

        expect(collection.getDataByTableFormat()).toEqual(expected);
      });
    });
  });
});