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
          return context.a + ': ' + context.bar;
        };
        view.render({
          context: { bar: 'baz' }
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

      describe('when all label are lower than 10000', function () {
        it('should format with decimals if any label requires it', function () {
          var formatter = View.prototype.numberListFormatter([0, 500, 1000, 1500]);
          expect(formatter(500)).toBe('500');
          expect(formatter(1000)).toBe('1,000');
          expect(formatter(1500)).toBe('1,500');
        });
      });

      describe('when all label are lower than 1,000,000 and greater than 10,000', function () {
        it('should format all labels as thousands', function () {
          var formatter = View.prototype.numberListFormatter([0, 10000, 20000, 30000]);
          expect(formatter(0)).toBe('0');
          expect(formatter(10000)).toBe('10k');
          expect(formatter(20000)).toBe('20k');
          expect(formatter(30000)).toBe('30k');
        });

        it('should format with currency prefix if required', function () {
          var formatter = View.prototype.numberListFormatter([0, 1000], 'gbp');
          expect(formatter(200)).toBe('£200');

          formatter = View.prototype.numberListFormatter([0, 100000], 'gbp');
          expect(formatter(20000)).toBe('£20k');
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

      it('does not overwrite options (bugfix)', function () {
        var fn = View.prototype.numberListFormatter([0, 5000000, 10000000, 15000000], 'gbp');
        expect(fn(0)).toEqual('£0');
        expect(fn(5000000)).toEqual('£5m');
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
