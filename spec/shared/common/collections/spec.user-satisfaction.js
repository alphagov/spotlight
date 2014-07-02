define([
  'common/collections/user-satisfaction'
],
function (UserSatisfactionCollection) {
  describe('UserSatisfactionCollection', function () {

    var collection;

    describe('parse', function () {

      beforeEach(function () {
        collection = new UserSatisfactionCollection([], {
          valueAttr: 'rating',
          min: 1,
          max: 5
        });
      });

      it('calculates average scores as a percentage for each entry', function () {

        var output = collection.parse({
          data: [
            {
              'rating_1:sum': 1,
              'rating_2:sum': 1,
              'rating_3:sum': 1,
              'rating_4:sum': 1,
              'rating_5:sum': 1,
              'total:sum': 5
            },
            {
              'rating_1:sum': 1,
              'rating_2:sum': 1,
              'rating_3:sum': 1,
              'rating_4:sum': 1,
              'rating_5:sum': 6,
              'total:sum': 10
            },
            {
              'rating_1:sum': 6,
              'rating_2:sum': 1,
              'rating_3:sum': 1,
              'rating_4:sum': 1,
              'rating_5:sum': 1,
              'total:sum': 10
            }
          ]
        });

        expect(output[0].rating).toEqual(0.5);
        expect(output[1].rating).toEqual(0.75);
        expect(output[2].rating).toEqual(0.25);

      });

      it('sets a value of null to unrated periods', function () {

        var output = collection.parse({
          data: [
            {
              'rating_1:sum': 0,
              'rating_2:sum': 0,
              'rating_3:sum': 0,
              'rating_4:sum': 0,
              'rating_5:sum': 0,
              'total:sum': 0
            }
          ]
        });

        expect(output[0].rating).toEqual(null);

      });

      it('if trim option is set, removes null elements from start of collection', function () {

        collection.options.trim = true;

        var output = collection.parse({
          data: [
            {
              'rating_1:sum': 0,
              'rating_2:sum': 0,
              'rating_3:sum': 0,
              'rating_4:sum': 0,
              'rating_5:sum': 0,
              'total:sum': 0
            },
            {
              'rating_1:sum': 0,
              'rating_2:sum': 0,
              'rating_3:sum': 0,
              'rating_4:sum': 0,
              'rating_5:sum': 0,
              'total:sum': 0
            },
            {
              'rating_1:sum': 0,
              'rating_2:sum': 0,
              'rating_3:sum': 0,
              'rating_4:sum': 0,
              'rating_5:sum': 0,
              'total:sum': 0
            },
            {
              'rating_1:sum': 6,
              'rating_2:sum': 1,
              'rating_3:sum': 1,
              'rating_4:sum': 1,
              'rating_5:sum': 1,
              'total:sum': 10
            }
          ]
        });

        expect(output.length).toEqual(1);
        expect(output[0].rating).toEqual(0.25);

      });

      it('if trim option is set to a minimum length, removes null elements from start of collection to that length', function () {

        collection.options.trim = 2;

        var output = collection.parse({
          data: [
            {
              'rating_1:sum': 0,
              'rating_2:sum': 0,
              'rating_3:sum': 0,
              'rating_4:sum': 0,
              'rating_5:sum': 0,
              'total:sum': 0
            },
            {
              'rating_1:sum': 0,
              'rating_2:sum': 0,
              'rating_3:sum': 0,
              'rating_4:sum': 0,
              'rating_5:sum': 0,
              'total:sum': 0
            },
            {
              'rating_1:sum': 0,
              'rating_2:sum': 0,
              'rating_3:sum': 0,
              'rating_4:sum': 0,
              'rating_5:sum': 0,
              'total:sum': 0
            },
            {
              'rating_1:sum': 6,
              'rating_2:sum': 1,
              'rating_3:sum': 1,
              'rating_4:sum': 1,
              'rating_5:sum': 1,
              'total:sum': 10
            }
          ]
        });

        expect(output.length).toEqual(2);
        expect(output[0].rating).toEqual(null);
        expect(output[1].rating).toEqual(0.25);

      });

    });

    describe('mean', function () {

      it('calculates a long term average score score for the data set', function () {

        collection.reset({
          data: [
            {
              'rating_1:sum': 1,
              'rating_2:sum': 1,
              'rating_3:sum': 1,
              'rating_4:sum': 1,
              'rating_5:sum': 1,
              'total:sum': 5
            },
            {
              'rating_1:sum': 1,
              'rating_2:sum': 1,
              'rating_3:sum': 1,
              'rating_4:sum': 1,
              'rating_5:sum': 6,
              'total:sum': 10
            },
            {
              'rating_1:sum': 6,
              'rating_2:sum': 1,
              'rating_3:sum': 1,
              'rating_4:sum': 1,
              'rating_5:sum': 1,
              'total:sum': 10
            }
          ]
        }, { parse: true });

        expect(collection.mean('rating')).toEqual(0.5);

      });

    });

  });
});