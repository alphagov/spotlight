define([
  'common/collections/grouped_completion'
], function (Collection) {

  describe('Grouped Completion Collection', function () {

    describe('parse', function () {

      var collection, input;

      beforeEach(function () {

        input = {
          data: [
            {
              demographic: '18-35',
              channel: 'digital',
              values: [
                {
                  _start_at: '2014-10-01T00:00:00Z',
                  count: 5
                },
                {
                  _start_at: '2014-10-02T00:00:00Z',
                  count: 10
                },
                {
                  _start_at: '2014-10-03T00:00:00Z',
                  count: 15
                },
                {
                  _start_at: '2014-10-04T00:00:00Z',
                  count: 20
                }
              ]
            },
            {
              demographic: '18-35',
              channel: 'other',
              values: [
                {
                  _start_at: '2014-10-01T00:00:00Z',
                  count: 20
                },
                {
                  _start_at: '2014-10-02T00:00:00Z',
                  count: 15
                },
                {
                  _start_at: '2014-10-03T00:00:00Z',
                  count: 10
                },
                {
                  _start_at: '2014-10-04T00:00:00Z',
                  count: 5
                }
              ]
            },
            {
              demographic: '36-50',
              channel: 'digital',
              values: [
                {
                  _start_at: '2014-10-01T00:00:00Z',
                  count: 20
                },
                {
                  _start_at: '2014-10-02T00:00:00Z',
                  count: 15
                },
                {
                  _start_at: '2014-10-03T00:00:00Z',
                  count: 10
                },
                {
                  _start_at: '2014-10-04T00:00:00Z',
                  count: 5
                }
              ]
            },
            {
              demographic: '36-50',
              channel: 'other',
              values: [
                {
                  _start_at: '2014-10-01T00:00:00Z',
                  count: 5
                },
                {
                  _start_at: '2014-10-02T00:00:00Z',
                  count: 10
                },
                {
                  _start_at: '2014-10-03T00:00:00Z',
                  count: 15
                },
                {
                  _start_at: '2014-10-04T00:00:00Z',
                  count: 20
                }
              ]
            }
          ]
        };

      });

      describe('non-date-indexed data', function () {

        beforeEach(function () {

          collection = new Collection([], {
            valueAttr: 'count',
            category: 'demographic',
            numeratorMatcher: 'digital',
            denominatorMatcher: '(.)*',
            matchingAttribute: 'channel',
            axes: {
              x: {
                key: 'demographic'
              },
              y: [
                {
                  key: 'completion'
                }
              ]
            }
          });
          spyOn(collection.dataSource, 'groupedBy').andReturn(['demographic', 'channel']);

        });

        it('calculates a completion rate from most recent data point for each group', function () {

          var output = collection.parse(input);

          expect(output.length).toEqual(2);

          expect(output[0].demographic).toEqual('18-35');
          expect(output[0].completion).toEqual(0.8);

          expect(output[1].demographic).toEqual('36-50');
          expect(output[1].completion).toEqual(0.2);

        });

        it('filters out empty categories', function () {

          input.data.push({
            demographic: '',
            channel: 'digital',
            values: [
              {
                _start_at: '2014-10-01T00:00:00Z',
                count: 5
              },
              {
                _start_at: '2014-10-02T00:00:00Z',
                count: 10
              },
              {
                _start_at: '2014-10-03T00:00:00Z',
                count: 15
              },
              {
                _start_at: '2014-10-04T00:00:00Z',
                count: 20
              }
            ]
          },
          {
            demographic: '',
            channel: 'other',
            values: [
              {
                _start_at: '2014-10-01T00:00:00Z',
                count: 20
              },
              {
                _start_at: '2014-10-02T00:00:00Z',
                count: 15
              },
              {
                _start_at: '2014-10-03T00:00:00Z',
                count: 10
              },
              {
                _start_at: '2014-10-04T00:00:00Z',
                count: 5
              }
            ]
          });

          var output = collection.parse(input);

          expect(output.length).toEqual(2);

          expect(output[0].demographic).toEqual('18-35');
          expect(output[1].demographic).toEqual('36-50');

        });


      });

    });

  });

});