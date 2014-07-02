define([
  'common/collections/realtime'
],
function (Collection) {
  describe('Realtime Collection', function () {

    describe('parse', function () {

      it('discards data that is more than 24 hours old', function () {

        var testCollection;
        testCollection = new Collection([], { title: 'foo', id: 'bar', period: 'hours', duration: 24 });
        var testData = [
          {
            '_timestamp': testCollection.getMoment('2002-03-02T01:06:00+00:00'),
            'unique_visitors': 1
          },
          {
            '_timestamp': testCollection.getMoment('2002-03-02T00:12:00+00:00'),
            'unique_visitors': 1
          },
          {
            '_timestamp': testCollection.getMoment('2002-03-01T01:07:00+00:00'),
            'unique_visitors': 1
          },
          {
            '_timestamp': testCollection.getMoment('2002-03-01T00:00:00+00:00'),
            'unique_visitors': 3
          }
        ];
        testCollection.reset({ data: testData }, { parse: true });

        expect(testCollection.length).toEqual(3);
        // The collection should not include the oldest timestamp
        expect(testCollection.some(function (model) {
          return model.get('_timestamp').format() === testData[3]._timestamp.format();
        })).toEqual(false);

      });
    });

    describe('isEmpty', function () {

      it('is considered "empty" if it contains only one data point', function () {

        var testCollection;
        testCollection = new Collection([], { title: 'foo', id: 'bar', period: 'hours', duration: 24 });
        var testData = [
          {
            '_timestamp': testCollection.getMoment('2002-03-02T01:06:00+00:00'),
            'unique_visitors': 1
          }
        ];
        testCollection.reset({ data: testData }, { parse: true });

        expect(testCollection.isEmpty()).toBe(true);

      });

    });

  });
});
