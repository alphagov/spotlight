define([
  'extensions/mixins/pivot'
],
function (Pivot) {
  describe('Pivot', function () {

    describe('applyPivot', function () {

      var params, basePos, calloutEl;
      beforeEach(function () {
        basePos = {
          x: 400,
          y: 400
        };

        params = {
          content: 'test',
          callback: jasmine.createSpy()
        };

        calloutEl = {
          width: jasmine.createSpy().andReturn(30),
          height: jasmine.createSpy().andReturn(20)
        };
      });

      it('aligns the callout to the bottom left corner', function () {
        var pivot = {
          horizontal: 'left',
          vertical: 'bottom',
          width: 30,
          height: 20
        };
        var pos = Pivot.applyPivot(basePos, pivot);
        expect(pos.x).toEqual(400);
        expect(pos.y).toEqual(380);
      });

      it('aligns the callout to the top right corner', function () {
        var pivot = {
          horizontal: 'right',
          vertical: 'top',
          width: 30,
          height: 20
        };
        var pos = Pivot.applyPivot(basePos, pivot);
        expect(pos.x).toEqual(370);
        expect(pos.y).toEqual(400);
      });

      it('aligns the callout to the bottom left corner with offset', function () {
        var pivot = {
          horizontal: 'left',
          vertical: 'bottom',
          xOffset: 13,
          yOffset: 12,
          width: 30,
          height: 20
        };
        var pos = Pivot.applyPivot(basePos, pivot);
        expect(pos.x).toEqual(413);
        expect(pos.y).toEqual(392);
      });

      it('aligns the callout to the top right corner with offset', function () {
        var pivot = {
          horizontal: 'right',
          vertical: 'top',
          xOffset: 13,
          yOffset: 12,
          width: 30,
          height: 20
        };
        var pos = Pivot.applyPivot(basePos, pivot);
        expect(pos.x).toEqual(383);
        expect(pos.y).toEqual(412);
      });

      describe('contrain to bounds', function () {
        var pivot;
        beforeEach(function () {
          pivot = {
            horizontal: 'left',
            vertical: 'bottom',
            xOffset: 13,
            yOffset: 12,
            constrainToBounds: true,
            width: 30,
            height: 20
          };
        });

        it('reverses horizontal direction if it overflows the bounds element', function () {
          var bounds = {
            width: 442,
            height: 500
          };
          var pos = Pivot.applyPivot(basePos, pivot, bounds);
          expect(pos.x).toEqual(357);
          expect(pos.y).toEqual(392);
        });

        it('does not reverse horizontal direction if it does not overflow the bounds element', function () {
          var bounds = {
            width: 443,
            height: 500
          };
          var pos = Pivot.applyPivot(basePos, pivot, bounds);
          expect(pos.x).toEqual(413);
          expect(pos.y).toEqual(392);
        });

        it('reverses vertical direction if it overflows the bounds element', function () {
          var bounds = {
            width: 443,
            height: 403
          };
          var pos = Pivot.applyPivot(basePos, pivot, bounds);
          expect(pos.x).toEqual(413);
          expect(pos.y).toEqual(388);
        });

        it('does not reverse vertical direction if it does overflow the bounds element', function () {
          var bounds = {
            width: 443,
            height: 448
          };
          var pos = Pivot.applyPivot(basePos, pivot, bounds);
          expect(pos.x).toEqual(413);
          expect(pos.y).toEqual(392);
        });
      });

    });

    describe('positionToFraction', function () {

      var positionToFraction = Pivot.positionToFraction;

      it('converts logical CSS positions to fractions', function () {
        expect(positionToFraction('top')).toEqual(0);
        expect(positionToFraction('left')).toEqual(0);
        expect(positionToFraction('centre')).toEqual(0.5);
        expect(positionToFraction('center')).toEqual(0.5);
        expect(positionToFraction('middle')).toEqual(0.5);
        expect(positionToFraction('bottom')).toEqual(1);
        expect(positionToFraction('right')).toEqual(1);
        expect(positionToFraction('foo')).toBe(null);
      });

      it('converts percentage values to fractions', function () {
        expect(positionToFraction('0%')).toEqual(0);
        expect(positionToFraction('50%')).toEqual(0.5);
        expect(positionToFraction('100%')).toEqual(1);
        expect(positionToFraction('11%')).toEqual(0.11);
      });

      it('limits the range of percentages to fractions', function () {
        expect(positionToFraction('-30%')).toEqual(0);
        expect(positionToFraction('101%')).toEqual(1);
      });

      it('limits the range of numbers to fractions', function () {
        expect(positionToFraction(-1)).toEqual(0);
        expect(positionToFraction(1.3)).toEqual(1);
      });

      it('leaves fractions untouched', function () {
        expect(positionToFraction(0)).toEqual(0);
        expect(positionToFraction(0.4)).toEqual(0.4);
        expect(positionToFraction(0.8)).toEqual(0.8);
        expect(positionToFraction(1)).toEqual(1);
      });
    });


    describe('offsetFromTopLeft', function () {
      beforeEach(function () {
        spyOn(Pivot, 'positionToFraction').andCallThrough();
      });

      it('returns the offset from the top left corner', function () {
        var point = Pivot.offsetFromTopLeft(400, 300, 'left', 'top');
        expect(point.x).toEqual(0);
        expect(point.y).toEqual(0);

        expect(Pivot.positionToFraction).toHaveBeenCalledWith('left');
        expect(Pivot.positionToFraction).toHaveBeenCalledWith('top');

        point = Pivot.offsetFromTopLeft(400, 300, 'centre', 'centre');
        expect(point.x).toEqual(200);
        expect(point.y).toEqual(150);

        point = Pivot.offsetFromTopLeft(400, 300, 'right', 'bottom');
        expect(point.x).toEqual(400);
        expect(point.y).toEqual(300);

      });
    });

  });
});
