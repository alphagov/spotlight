define(function () {

  var Pivot = {
    /**
     * "Pivoting" aligns the Callout in relation to an element. Commonly, this
     * is the element that caused the Callout to appear. The "pivot point" is
     * the coordinate to which the callout is aligned to. The
     * "pivot direction" is where this point is on the Callout.
     *
     * @param {Object} basePos Starting position for the Callout
     * @param {Object} pivot Information for the pivoting process
     * @param pivot.el Callout element to apply pivot to
     * @param pivot.horizontal Horizontal position of the pivot point on the callout
     * @param pivot.vertical Vertical position of the pivot point on the callout
     * @param [pivot.xOffset=0] Additional horizontal offset to be applied to the pivot point
     * @param [pivot.yOffset=0] Additional vertical offset to be applied to the pivot point
     * @param {Boolean} [pivot.constrainToBounds=false] Reverse direction if the Callout overflows the "bounds" element
     * @param {Object} [bounds=null] Element whose bounding box the Callout should not overflow
     */
    applyPivot: function (basePos, pivot, bounds) {
      var horizontal = pivot.horizontal;
      var vertical = pivot.vertical;
      pivot.xOffset = pivot.xOffset || 0;
      pivot.yOffset = pivot.yOffset || 0;

      // first, move into direction that was requested
      var pivotCorrection = this.offsetFromTopLeft(
        pivot.width, pivot.height, horizontal, vertical
      );

      var pos = {
        x: basePos.x + pivot.xOffset - pivotCorrection.x,
        y: basePos.y + pivot.yOffset - pivotCorrection.y
      };

      if (pivot.constrainToBounds) {
        // reverse directions if there are overlaps
        var overlap = false;
        if (pos.x < 0 || pos.x + pivot.width > bounds.width) {
          horizontal = this.reversePositionToFraction(horizontal);
          pivot.xOffset *= -1;
          overlap = true;
        }
        if (pos.y < 0 || pos.y + pivot.height > bounds.height) {
          vertical = this.reversePositionToFraction(vertical);
          pivot.yOffset *= -1;
          overlap = true;
        }

        if (overlap) {
          pivotCorrection = this.offsetFromTopLeft(
            pivot.width, pivot.height, horizontal, vertical
          );
          pos = {
            x: basePos.x + pivot.xOffset - pivotCorrection.x,
            y: basePos.y + pivot.yOffset - pivotCorrection.y
          };
        }
      }

      return pos;
    },

    reversePositionToFraction: function (pos) {
      return 1 - this.positionToFraction(pos);
    },

    positionToFraction: function (pos) {
      if (typeof pos === 'number') {
        return Math.min(Math.max(pos, 0), 1);
      }

      if (typeof pos === 'string') {
        // percentage value
        var matches = pos.match(/(-?\d+)\%/);
        var fraction;
        if (matches) {
          fraction = parseFloat(matches[1]) / 100;
          return Math.min(Math.max(fraction, 0), 1);
        }

        // match logical values
        fraction = {
          top: 0,
          left: 0,
          centre: 0.5,
          center: 0.5,
          middle: 0.5,
          bottom: 1,
          right: 1
        }[pos];

        return (typeof fraction === 'undefined') ? null : fraction;
      }

      return null;
    },

    offsetFromTopLeft: function (width, height, horizontal, vertical) {
      return {
        x: width * this.positionToFraction(horizontal),
        y: height * this.positionToFraction(vertical)
      };
    }
  };

  return Pivot;
});
