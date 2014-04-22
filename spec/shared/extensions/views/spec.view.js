define([
  'extensions/views/view',
  'extensions/models/model',
  'backbone'
],
function (View, Model, Backbone) {
  describe('View', function () {
    it('inherits from Backbone.View', function () {
      var view = new View();
      expect(view instanceof Backbone.View).toBe(true);
    });

    describe('render', function () {
      var view;
      beforeEach(function () {
        spyOn(View.prototype, 'renderSubviews');
        spyOn(View.prototype, 'removeSubviews').andCallThrough();
        view = new View();
        spyOn(view, 'templateContext').andReturn({
          a: 'b',
          foo: 'bar'
        });
      });

      it('renders subviews', function () {
        var view = new View();
        view.render();
        expect(view.renderSubviews).toHaveBeenCalled();
      });

      it('removes subviews before rendering', function () {
        var view = new View();
        view.render();
        expect(view.removeSubviews).toHaveBeenCalled();
      });

      it('does nothing when no template is defined', function () {
        view.render();
        expect(view.$el.html()).toEqual('');
      });

      it('renders template with default context', function () {
        view.template = function (context) {
          return context.a + ': ' + context.foo;
        };
        view.render();
        expect(view.$el.html()).toEqual('b: bar');
      });

      it('renders template with custom context', function () {
        view.template = function (context) {
          return context.a + ': ' + context.foo;
        };
        view.render({
          context: { foo: 'baz' }
        });
        expect(view.$el.html()).toEqual('b: baz');
      });
    });

    describe('templateContext', function () {
      it('provides model attributes as properties', function () {
        var model = new Model({
          a: 'b',
          foo: 'bar'
        });
        var view = new View({
          model: model
        });
        var context = view.templateContext();
        expect(context.a).toEqual('b');
        expect(context.foo).toEqual('bar');
        expect(context.model).toBe(model);
      });
    });

    describe('renderSubviews / removeSubviews', function () {

      var model, SubViewA, SubViewB, CustomView;
      beforeEach(function () {
        model = new Model({
          foo: 'bar'
        });

        SubViewA = View.extend({
          template: function () {
            return 'foo';
          },
          remove: jasmine.createSpy()
        });
        SubViewB = View.extend({
          template: function () {
            return 'bar';
          },
          remove: jasmine.createSpy()
        });

        CustomView = View.extend({
          views: {
            '.a': { view: SubViewA },
            '#b': { view: SubViewB }
          },

          template: function () {
            return '<div class="a"></div><div id="b"></div>';
          }
        });
      });

      describe('render default options', function () {

        it('renders subviews with default options into their selectors', function () {
          var parent = new CustomView({
            model: model
          });

          parent.render();

          var a = parent.viewInstances['.a'];
          var b = parent.viewInstances['#b'];
          expect(a instanceof SubViewA).toBe(true);
          expect(a.$el.html()).toEqual('foo');
          expect(a.model).toBe(parent.model);
          expect(b instanceof SubViewB).toBe(true);
          expect(b.$el.html()).toEqual('bar');
          expect(b.model).toBe(parent.model);
        });

        it('renders sub views with custom options into their selectors', function () {

          CustomView.prototype.views = {
            '.a': {
              view: SubViewA,
              options: function () {
                return {
                  customOption: true
                };
              }
            }
          };

          var parent = new CustomView({
            model: model
          });

          parent.render();

          var subView = parent.viewInstances['.a'];
          expect(subView instanceof SubViewA).toBe(true);
          expect(subView.$el.html()).toEqual('foo');
          expect(subView.customOption).toEqual(true);
          expect(subView.model).toBe(parent.model);
        });

        it('removes existing subviews', function () {
          var parent = new CustomView({
            model: model
          });

          parent.render();

          var a = parent.viewInstances['.a'];
          var b = parent.viewInstances['#b'];

          expect(a.remove).not.toHaveBeenCalled();
          expect(b.remove).not.toHaveBeenCalled();

          parent.render();
          expect(a.remove).toHaveBeenCalled();
          expect(b.remove).toHaveBeenCalled();
          expect(parent.viewInstances['.a']).not.toBe(a);
          expect(parent.viewInstances['#b']).not.toBe(b);
        });
      });
    });

    describe('formatDuration', function () {
      describe('milliseconds', function () {
        it('should return the number of milliseconds to a given precision followed by ms', function () {
          var view = View.prototype;
          expect(view.formatDuration(0, 'ms', 4)).toBe('0ms');
          expect(view.formatDuration(2594, 'ms', 3)).toBe('2590ms');
          expect(view.formatDuration(2594, 'ms', 4)).toBe('2594ms');
          expect(view.formatDuration(2594, 'ms', 5)).toBe('2594ms');
        });
      });

      describe('seconds', function () {
        it('should return the number of seconds to a given precision followed by s', function () {
          var view = View.prototype;
          expect(view.formatDuration(0, 's', 3)).toBe('0s');
          expect(view.formatDuration(246, 's', 3)).toBe('0.246s');
          expect(view.formatDuration(358, 's', 2)).toBe('0.36s');
          expect(view.formatDuration(4628, 's', 3)).toBe('4.63s');
          expect(view.formatDuration(8849, 's', 2)).toBe('8.8s');
          expect(view.formatDuration(372956, 's', 2)).toBe('370s');
          expect(view.formatDuration(15428, 's', 3)).toBe('15.4s');
          expect(view.formatDuration(15428, 's', 6)).toBe('15.428s');
        });
      });
    });

    describe('numberListFormatter', function () {

      describe('in the special case where the values are 0 and 1', function () {
        it('should not use decimal places', function () {
          var formatter = View.prototype.numberListFormatter([0, 1]);
          expect(formatter(0)).toBe('0');
          expect(formatter(1)).toBe('1');
        });
      });

      describe('when all label are lower than 1000', function () {
        it('should format all labels as units', function () {
          var formatter = View.prototype.numberListFormatter([0, 50, 100, 150]);
          expect(formatter(50)).toBe('50');
        });
      });

      describe('when all label are lower than 1,000,000', function () {
        it('should format all labels as thousands', function () {
          var formatter = View.prototype.numberListFormatter([0, 1000, 2000, 3000]);
          expect(formatter(2000)).toBe('2k');
        });

        it('should format with decimals if any label requires it', function () {
          var formatter = View.prototype.numberListFormatter([0, 500, 1000, 1500]);
          expect(formatter(500)).toBe('0.5k');
          expect(formatter(1000)).toBe('1.0k');
          expect(formatter(1500)).toBe('1.5k');
        });

        it('should format with decimals when the max value matches the magnitude', function () {
          var formatter = View.prototype.numberListFormatter([0, 1000]);
          expect(formatter(200)).toBe('0.2k');
          expect(formatter(400)).toBe('0.4k');
          expect(formatter(800)).toBe('0.8k');
          expect(formatter(1000)).toBe('1.0k');
        });

        it('should format with currency prefix if required', function () {
          var formatter = View.prototype.numberListFormatter([0, 1000], 'gbp');
          expect(formatter(200)).toBe('£0.2k');
        });

      });

      describe('when labels go over 1,000,000', function () {
        it('should format all labels as million', function () {
          var formatter = View.prototype.numberListFormatter([0, 1000000, 2000000, 3000000]);
          expect(formatter(2000000)).toBe('2m');
        });

        it('should format with decimals if any label requires it', function () {
          var formatter = View.prototype.numberListFormatter([0, 500000, 1000000, 1500000]);
          expect(formatter(500000)).toBe('0.5m');
          expect(formatter(1000000)).toBe('1.0m');
          expect(formatter(1500000)).toBe('1.5m');
        });
      });

      describe('when applied to zero', function () {
        it('should always format zero as "0"', function () {
          expect((View.prototype.numberListFormatter([0,      50,     100]))(0)).toEqual('0');
          expect((View.prototype.numberListFormatter([0,     500,    1000]))(0)).toEqual('0');
          expect((View.prototype.numberListFormatter([0,    1000,    2000]))(0)).toEqual('0');
          expect((View.prototype.numberListFormatter([0,  500000, 1000000]))(0)).toEqual('0');
          expect((View.prototype.numberListFormatter([0, 1000000, 2000000]))(0)).toEqual('0');
        });
      });

    });

    describe('formatNumericLabel', function () {

      var view = new View();
      var formatNumericLabel = view.formatNumericLabel.bind(view);

      it('should handle null input, when missing data', function () {
        expect(formatNumericLabel(null)).toBe(null);
      });

      it('should display entire numbers from 0 to 999', function () {
        expect(formatNumericLabel(0)).toBe('0');
        expect(formatNumericLabel(1)).toBe('1');
        expect(formatNumericLabel(9)).toBe('9');
        expect(formatNumericLabel(10)).toBe('10');
        expect(formatNumericLabel(77)).toBe('77');
        expect(formatNumericLabel(100)).toBe('100');
        expect(formatNumericLabel(398)).toBe('398');
        expect(formatNumericLabel(499)).toBe('499');
        expect(formatNumericLabel(500)).toBe('500');
        expect(formatNumericLabel(777)).toBe('777');
        expect(formatNumericLabel(999)).toBe('999');
      });

      it('should display real numbers from 0 to 9.99 with two decimal digits', function () {
        expect(formatNumericLabel(0.00123)).toBe('0');
        expect(formatNumericLabel(0.123)).toBe('0.12');
        expect(formatNumericLabel(1.234)).toBe('1.23');
        expect(formatNumericLabel(9.994)).toBe('9.99');
        expect(formatNumericLabel(9.996)).toBe('10');
      });

      it('should display real numbers from 10 to 99.9 with one decimal digits', function () {
        expect(formatNumericLabel(12.34)).toBe('12.3');
        expect(formatNumericLabel(99.94)).toBe('99.9');
        expect(formatNumericLabel(99.96)).toBe('100');
      });

      it('should display numbers from 1000 to 999499 as fractions of 1k', function () {
        expect(formatNumericLabel(1000)).toBe('1.00k');
        expect(formatNumericLabel(1005)).toBe('1.01k');
        expect(formatNumericLabel(1006)).toBe('1.01k');
        expect(formatNumericLabel(100000)).toBe('100k');
        expect(formatNumericLabel(234568)).toBe('235k');
        expect(formatNumericLabel(500000)).toBe('500k');
        expect(formatNumericLabel(777777)).toBe('778k');
        expect(formatNumericLabel(999499)).toBe('999k');
      });

      it('should display numbers from 999500 and above as fractions of 1m', function () {
        expect(formatNumericLabel(999500)).toBe('1.00m');
        expect(formatNumericLabel(999501)).toBe('1.00m');
        expect(formatNumericLabel(999900)).toBe('1.00m');
        expect(formatNumericLabel(1000000)).toBe('1.00m');
        expect(formatNumericLabel(1005000)).toBe('1.01m');
        expect(formatNumericLabel(1005001)).toBe('1.01m');
        expect(formatNumericLabel(1009900)).toBe('1.01m');
        expect(formatNumericLabel(1010000)).toBe('1.01m');
        expect(formatNumericLabel(1220000)).toBe('1.22m');
        expect(formatNumericLabel(9099000)).toBe('9.10m');
        expect(formatNumericLabel(100000000)).toBe('100m');
        expect(formatNumericLabel(234568234)).toBe('235m');
        expect(formatNumericLabel(999499499)).toBe('999m');
      });

      it('should display numbers from 999500000 and above as fractions of 1b', function () {
        expect(formatNumericLabel(1000000000)).toBe('1.00b');
        expect(formatNumericLabel(25250000000)).toBe('25.3b');
      });

      it('should format negative numbers', function () {
        expect(formatNumericLabel(-0.001)).toBe('0');
        expect(formatNumericLabel(-0.123)).toBe('-0.12');
        expect(formatNumericLabel(-1.234)).toBe('-1.23');
        expect(formatNumericLabel(-12.34)).toBe('-12.3');
        expect(formatNumericLabel(-123.4)).toBe('-123');
        expect(formatNumericLabel(-1234)).toBe('-1.23k');
      });

      it('should display currency symbols, with fewer decimal places', function () {
        expect(formatNumericLabel(null, 'gbp')).toBe(null);
        expect(formatNumericLabel(0.00, 'gbp')).toBe('0');
        expect(formatNumericLabel(100, 'gbp')).toBe('£100');
        expect(formatNumericLabel(12.34, 'gbp')).toBe('£12');
        expect(formatNumericLabel(777, 'gbp')).toBe('£777');
        expect(formatNumericLabel(995001, 'gbp')).toBe('£995k');
        expect(formatNumericLabel(1000000000, 'gbp')).toBe('£1.0b');
      });

      describe('generative tests', function () {
        var createTests = function (start, end, increment, format) {
          it('should correctly format numbers in the range ' + start + '-' + end, function () {
            for (var i = start; i < end; i += increment) {
              createExpectation(i, format(i));
            }
          });
        };

        var createExpectation = function (i, expectation) {
          expect(formatNumericLabel(i)).toBe(expectation);
        };

        createTests(0,   20,   1, function (i) { return i.toString(); });
        createTests(500, 600,  1, function (i) { return i.toString(); });
        createTests(980, 999,  1, function (i) { return i.toString(); });
        createTests(1000,   1100,    1,    function (i) { return (Math.round(i / 10) / 100).toPrecision(3) + 'k'; });
        createTests(9400,   10000,   10,   function (i) { return (Math.round(i / 10) / 100).toPrecision(3) + 'k'; });
        createTests(10000,  11500,   10,   function (i) { return (Math.round(i / 100) / 10).toPrecision(3) + 'k'; });
        createTests(50450,  50500,   10,   function (i) { return (Math.round(i / 100) / 10).toPrecision(3) + 'k'; });
        createTests(100000, 101000,  10,   function (i) { return Math.round(i / 1000).toPrecision(3) + 'k'; });
        createTests(499000, 499500,  100,  function (i) { return Math.round(i / 1000).toPrecision(3) + 'k'; });
        createTests(499500, 500000,  100,  function (i) { return Math.round(i / 1000).toPrecision(3) + 'k'; });
        createTests(504500, 506000,  150,  function (i) { return Math.round(i / 1000).toPrecision(3) + 'k'; });
        createTests(700000, 800000,  150,  function (i) { return Math.round(i / 1000).toPrecision(3) + 'k'; });
        createTests(994499, 999500,  150,  function (i) { return Math.round(i / 1000).toPrecision(3) + 'k'; });
        createTests(999500, 999999,  150,   function (i) { return (Math.round(i / 10000) / 100).toPrecision(3) + 'm'; });
        createTests(999999, 1999999, 10000, function (i) { return (Math.round(i / 10000) / 100).toPrecision(3) + 'm'; });
      });
    });

    describe('formatPercentage', function () {
      var format = View.prototype.formatPercentage;

      it('formats a number as percentage string with no decimals', function () {
        expect(format(0.011)).toEqual('1%');
        expect(format(1)).toEqual('100%');
      });

      it('formats a number as percentage string with set number of decimals', function () {
        expect(format(0.011, 2)).toEqual('1.10%');
        expect(format(1, 2)).toEqual('100.00%');
      });

      it('formats signed input with the correct sign', function () {
        expect(format(0.011, 2, false)).toEqual('1.10%');
        expect(format(1, 2, true)).toEqual('+100.00%');
        expect(format(-1, 0, true)).toEqual('−100%');
        expect(format(0, 3, true)).toEqual('0.000%');
      });

      it('does not try to format invalid inputs', function () {
        expect(format(null)).toBe(null);
        expect(format(undefined)).toBe(undefined);
        expect(isNaN(format(NaN))).toBe(true);
        expect(format('foo')).toBe('foo');
      });
    });

    describe('formatPeriod', function () {
      var view = new View();

      it('formats single days', function () {
        var model = new Model({
          _start_at: View.prototype.getMoment('2013-08-19T00:00:00+00:00'),
          _end_at: View.prototype.getMoment('2013-08-20T00:00:00+00:00')
        });
        expect(view.formatPeriod(model, 'week')).toEqual('19 Aug 2013');
        expect(view.formatPeriod(model, 'day')).toEqual('19 Aug 2013');
      });

      it('formats as single days when there is no end date defined', function () {
        var model = new Model({
          _start_at: View.prototype.getMoment('2013-08-19T00:00:00+00:00')
        });
        expect(view.formatPeriod(model, 'week')).toEqual('19 Aug 2013');
        expect(view.formatPeriod(model, 'day')).toEqual('19 Aug 2013');
      });

      it('formats daily date periods mid-month', function () {
        var model = new Model({
          _start_at: View.prototype.getMoment('2013-08-19T00:00:00+00:00'),
          _end_at: View.prototype.getMoment('2013-08-26T00:00:00+00:00')
        });
        expect(view.formatPeriod(model, 'week')).toEqual('19 to 25 Aug 2013');
        expect(view.formatPeriod(model, 'day')).toEqual('19 to 25 Aug 2013');
      });

      it('formats daily date periods across month boundaries', function () {
        var model = new Model({
          _start_at: View.prototype.getMoment('2013-08-26T00:00:00+00:00'),
          _end_at: View.prototype.getMoment('2013-09-02T00:00:00+00:00')
        });
        expect(view.formatPeriod(model, 'week')).toEqual('26 Aug to 1 Sep 2013');
        expect(view.formatPeriod(model, 'day')).toEqual('26 Aug to 1 Sep 2013');
      });

      it('formats as single month when there is no end date defined', function () {
        var model = new Model({
          _start_at: View.prototype.getMoment('2013-08-01T00:00:00+00:00')
        });
        expect(view.formatPeriod(model, 'month')).toEqual('August 2013');
      });

      it('formats monthly date periods for a single month', function () {
        var model = new Model({
          _start_at: View.prototype.getMoment('2013-08-01T00:00:00+00:00'),
          _end_at: View.prototype.getMoment('2013-09-01T00:00:00+00:00')
        });
        expect(view.formatPeriod(model, 'month')).toEqual('August 2013');
      });

      it('formats monthly date periods across months', function () {
        var model = new Model({
          _start_at: View.prototype.getMoment('2013-08-01T00:00:00+00:00'),
          _end_at: View.prototype.getMoment('2013-10-01T00:00:00+00:00')
        });
        expect(view.formatPeriod(model, 'month')).toEqual('Aug to Sep 2013');
      });

      it('formats monthly date periods across years', function () {
        var model = new Model({
          _start_at: View.prototype.getMoment('2013-08-01T00:00:00+00:00'),
          _end_at: View.prototype.getMoment('2014-02-01T00:00:00+00:00')
        });
        expect(view.formatPeriod(model, 'month')).toEqual('Aug 2013 to Jan 2014');
      });

      it('formats original dates if they are set', function () {
        var model = new Model({
          _original_start_at: '2010-08-01T00:00:00+00:00',
          _original_end_at: '2011-02-01T00:00:00+00:00',

          _start_at: View.prototype.getMoment('2013-08-01T00:00:00+00:00'),
          _end_at: View.prototype.getMoment('2014-02-01T00:00:00+00:00')
        });
        expect(view.formatPeriod(model, 'month')).toEqual('Aug 2010 to Jan 2011');
      });

      it('when passed a date string converts it to a date', function () {
        var model = new Model({
          _start_at: '2013-07-01T00:00:00+00:00',
          _end_at: '2013-10-01T00:00:00+00:00'
        });
        expect(view.formatPeriod(model, 'quarter')).toEqual('July to Sep 2013');
      });

    });

    describe('numberToSignificantFigures', function () {
      it('should round a positive number to a given number of sig figs', function () {
        var view = View.prototype;
        expect(view.numberToSignificantFigures(0, 4)).toBe(0);
        expect(view.numberToSignificantFigures(0.35628, 3)).toBe(0.356);
        expect(view.numberToSignificantFigures(12, 1)).toBe(10);
        expect(view.numberToSignificantFigures(628, 3)).toBe(628);
        expect(view.numberToSignificantFigures(2594, 3)).toBe(2590);
        expect(view.numberToSignificantFigures(2594, 9)).toBe(2594);
      });
      it('should round a negative number to a given number of sig figs', function () {
        var view = View.prototype;
        expect(view.numberToSignificantFigures(-0.35628, 3)).toBe(-0.356);
        expect(view.numberToSignificantFigures(-12, 1)).toBe(-10);
        expect(view.numberToSignificantFigures(-628, 3)).toBe(-628);
        expect(view.numberToSignificantFigures(-2594, 3)).toBe(-2590);
        expect(view.numberToSignificantFigures(-2594, 9)).toBe(-2594);
      });
    });

    describe('pluralise', function () {
      var pluralise = View.prototype.pluralise;

      it('displays a string as singular when there is exactly one thing', function () {
        expect(pluralise('foo', 1)).toEqual('foo');
      });

      it('displays a string as plural when there is no thing', function () {
        expect(pluralise('foo', 0)).toEqual('foos');
        expect(pluralise('foo', null)).toEqual('foos');
        expect(pluralise('foo')).toEqual('foos');
      });

      it('displays a string as plural when there are multiple things', function () {
        expect(pluralise('foo', 2)).toEqual('foos');
        expect(pluralise('foo', 3)).toEqual('foos');
        expect(pluralise('foo', 0.8)).toEqual('foos');
      });

      it('supports irregular pluralisation', function () {
        expect(pluralise('foo', 1, 'fooos')).toEqual('foo');
        expect(pluralise('foo', 2, 'fooos')).toEqual('fooos');
      });
    });

    describe('prop', function () {
      it('retrieves an object property', function () {
        var view = new View();
        view.testProp = { foo: 'bar' };
        expect(view.prop('testProp')).toEqual({ foo: 'bar' });
      });

      it('retrieves an object method result', function () {
        var view = new View();
        view.otherProp = { foo: 'bar' };
        view.testProp = function () {
          return this.otherProp;
        };
        expect(view.prop('testProp')).toEqual({ foo: 'bar' });
      });

      it('retrieves property from another object', function () {
        var view = new View();
        var anotherObject = {
          testProp: { foo: 'bar' }
        };
        expect(view.prop('testProp', anotherObject)).toEqual({ foo: 'bar' });
      });

      it('retrieves method result from another object', function () {
        var view = new View();
        var anotherObject = {
          otherProp: { foo: 'bar' },
          testProp: function () {
            return this.otherProp;
          }
        };
        expect(view.prop('testProp', anotherObject)).toEqual({ foo: 'bar' });
      });
    });
  });
});
