define([
  'extensions/mixins/formatters',
  'moment-timezone'

], function (Formatters, moment) {

  describe('Formatters', function () {

    it('exposes `format` as a function', function () {
      expect(typeof Formatters.format).toEqual('function');
    });

    describe('format', function () {

      it('returns unformatted value if formatter does not exist', function () {
        expect(Formatters.format(10, 'notaformatter')).toEqual(10);
      });
      it('returns undefined if passed value of undefined', function () {
        expect(Formatters.format(undefined, 'number')).toBeUndefined();
      });
      it('returns null if passed value of null', function () {
        expect(Formatters.format(null, 'number')).toBeNull();
      });

    });

    describe('time', function () {

      var dateStr;

      beforeEach(function () {
        dateStr = '2014-03-11T16:26:31.802Z';
      });

      it('outputs time formatted date object', function () {
        var input = new Date(dateStr);
        expect(Formatters.format(input, 'time')).toEqual('4:26pm');
      });

      it('outputs time formatted date string', function () {
        expect(Formatters.format(dateStr, 'time')).toEqual('4:26pm');
      });

      it('outputs time formatted moment object', function () {
        var input = moment(dateStr);
        expect(Formatters.format(input, 'time')).toEqual('4:26pm');
      });

      it('uses format option if provided', function () {
        expect(Formatters.format(dateStr, { type: 'time', format: 'HH:mm' })).toEqual('16:26');
      });

    });

    describe('date', function () {

      var dateStr;

      beforeEach(function () {
        dateStr = '2014-03-11T16:26:31.802Z';
      });

      it('outputs date formatted date object', function () {
        var input = new Date(dateStr);
        expect(Formatters.format(input, 'date')).toEqual('11 March 2014');
      });

      it('outputs date formatted date string', function () {
        expect(Formatters.format(dateStr, 'date')).toEqual('11 March 2014');
      });

      it('outputs date formatted moment object', function () {
        var input = moment(dateStr);
        expect(Formatters.format(input, 'date')).toEqual('11 March 2014');
      });

      it('uses format option if provided', function () {
        expect(Formatters.format(dateStr, { type: 'date', format: 'DD/MM/YY' })).toEqual('11/03/14');
      });

      it('uses calendar option if provided', function () {
        expect(Formatters.format(dateStr, { type: 'date', calendar: true })).toEqual('11 Mar 2014');
      });

    });

    describe('dateRange', function () {

      it('outputs a range with the default date formatting', function () {
        var range = [new Date('2014-03-11T00:00:00.000Z'),
                     new Date('2014-03-18T00:00:00.000Z')];
        expect(Formatters.format(range, 'dateRange'))
          .toEqual('11 Mar 2014 to 17 Mar 2014');
      });

      it('outputs a range with the custom date formatting', function () {
        var range = [new Date('2014-03-11T00:00:00.000Z'),
                     new Date('2014-03-18T00:00:00.000Z')];
        expect(Formatters.format(range, { type: 'dateRange', format: 'DD/MM/YY' }))
          .toEqual('11/03/14 to 17/03/14');
      });

    });

    describe('duration', function () {

      it('returns value in milliseconds by default', function () {
        expect(Formatters.format(567, 'duration')).toEqual('567ms');
        expect(Formatters.format(1234, 'duration')).toEqual('1,234ms');
      });

      it('returns values to 3 sigfigs by default', function () {
        expect(Formatters.format(567, { type: 'duration', unit: 's' })).toEqual('0.57s');
        expect(Formatters.format(1234, { type: 'duration', unit: 's' })).toEqual('1.23s');
        expect(Formatters.format(12345, { type: 'duration', unit: 's' })).toEqual('12.3s');
      });

      it('returns values rounded to correct number of decimal places', function () {
        expect(Formatters.format(567, { type: 'duration', unit: 's', dps: 2 })).toEqual('0.57s');
        expect(Formatters.format(1234, { type: 'duration', unit: 's', dps: 2 })).toEqual('1.23s');
        expect(Formatters.format(12345, { type: 'duration', unit: 's', dps: 2 })).toEqual('12.35s');
      });

    });

    describe('currency', function () {

      it('always returns £0 for zero input', function () {
        expect(Formatters.format(0, 'currency')).toEqual('£0');
        expect(Formatters.format(0, { type: 'currency', pence: true })).toEqual('£0');
      });

      it('formats values less than 10 with pence', function () {
        expect(Formatters.format(0.567, 'currency')).toEqual('£0.57');
        expect(Formatters.format(5.67, 'currency')).toEqual('£5.67');
        expect(Formatters.format(15.67, 'currency')).toEqual('£16');
      });

      it('returns formatted number with pound symbol', function () {
        expect(Formatters.format(567, 'currency')).toEqual('£567');
        expect(Formatters.format(1234, 'currency')).toEqual('£1,234');
        expect(Formatters.format(12345, 'currency')).toEqual('£12,345');
      });

      it('returns formatted number with symbol option if provided', function () {
        expect(Formatters.format(0.567, { type: 'currency', symbol: '$' })).toEqual('$0.57');
        expect(Formatters.format(5.67, { type: 'currency', symbol: '$' })).toEqual('$5.67');
        expect(Formatters.format(567, { type: 'currency', symbol: '$' })).toEqual('$567');
        expect(Formatters.format(1234, { type: 'currency', symbol: '$' })).toEqual('$1,234');
        expect(Formatters.format(12345, { type: 'currency', symbol: '$' })).toEqual('$12,345');
      });

      it('returns formatted number with pound symbol and pence', function () {
        expect(Formatters.format(0.567, { type: 'currency', pence: true })).toEqual('£0.57');
        expect(Formatters.format(5.67, { type: 'currency', pence: true })).toEqual('£5.67');
        expect(Formatters.format(567, { type: 'currency', pence: true })).toEqual('£567.00');
        expect(Formatters.format(12345.67, { type: 'currency', pence: true })).toEqual('£12,345.67');
      });

    });

    describe('percent', function () {

      it('returns formatted number to 1d.p with percent symbol', function () {
        expect(Formatters.format(0.5678, 'percent')).toEqual('56.8%');
      });

      it('returns 0% and 100% to 0dps', function () {
        expect(Formatters.format(0, 'percent')).toEqual('0%');
        expect(Formatters.format(1, 'percent')).toEqual('100%');
      });

      it('returns formatted number with percent symbol to dps specified', function () {
        expect(Formatters.format(0.5678, { type: 'percent', dps: 2 })).toEqual('56.78%');
        expect(Formatters.format(1, { type: 'percent', dps: 2 })).toEqual('100%');
      });

      it('returns formatted number normalised to the given value', function () {
        expect(Formatters.format(50, { type: 'percent', normalisation: 100 })).toEqual('50%');
        expect(Formatters.format(100, { type: 'percent', normalisation: 100 })).toEqual('100%');
      });

    });

    describe('integer', function () {

      it('returns number rounded to 0dps', function () {
        expect(Formatters.format(0.1, 'integer')).toEqual('0');
        expect(Formatters.format(0.5, 'integer')).toEqual('1');
        expect(Formatters.format(13.7, 'integer')).toEqual('14');
        expect(Formatters.format(12345.67, 'integer')).toEqual('12,346');
      });

      it('keeps decimal places on magnituded values', function () {
        expect(Formatters.format(1234567, { type: 'integer', magnitude: true })).toEqual('1.23m');
      });

    });

    describe('number', function () {

      it('always returns "0" for zero', function () {
        expect(Formatters.format(0, 'number')).toEqual('0');
        expect(Formatters.format(0, { type: 'number', pad: true })).toEqual('0');
        expect(Formatters.format(0, { type: 'number', dps: 5, fixed: 5, pad: true })).toEqual('0');

      });
      it('returns "0" for numbers which round to zero', function () {
        expect(Formatters.format(0.00001, { type: 'number', dps: 2 })).toEqual('0');
      });

      it('rounds numbers < 10 to 2 dp by default', function () {
        expect(Formatters.format(0.1234, 'number')).toEqual('0.12');
        expect(Formatters.format(1.1234, 'number')).toEqual('1.12');
        expect(Formatters.format(10.1234, 'number')).toEqual('10.1');
      });

      it('rounds numbers > 10 && < 100 to 1 dp by default', function () {
        expect(Formatters.format(12.34, 'number')).toEqual('12.3');
        expect(Formatters.format(23.45, 'number')).toEqual('23.5');
        expect(Formatters.format(34.56, 'number')).toEqual('34.6');
      });

      it('rounds > 100 to nearest integer by default', function () {
        expect(Formatters.format(123.34, 'number')).toEqual('123');
        expect(Formatters.format(234.45, 'number')).toEqual('234');
        expect(Formatters.format(345.56, 'number')).toEqual('346');
      });

      it('returns number rounded to decimal places specified', function () {
        expect(Formatters.format(0.1234, { type: 'number', dps: 1 })).toEqual('0.1');
        expect(Formatters.format(0.1234, { type: 'number', dps: 2 })).toEqual('0.12');
        expect(Formatters.format(0.1234, { type: 'number', dps: 3 })).toEqual('0.123');
        expect(Formatters.format(0.1234, { type: 'number', dps: 4 })).toEqual('0.1234');
        expect(Formatters.format(0.1234, { type: 'number', dps: 5 })).toEqual('0.1234');

        expect(Formatters.format(1234, { type: 'number', dps: -1 })).toEqual('1,230');
        expect(Formatters.format(1234, { type: 'number', dps: -2 })).toEqual('1,200');
      });

      it('inserts commas as a thousands separator', function () {
        expect(Formatters.format(1234567.1234, 'number')).toEqual('1,234,567');
        expect(Formatters.format(123456.1234, { type: 'number', dps: 4 })).toEqual('123,456.1234');
        expect(Formatters.format(12345.1234, { type: 'number', dps: 4 })).toEqual('12,345.1234');
        expect(Formatters.format(1234.1234, { type: 'number', dps: 4 })).toEqual('1,234.1234');
        expect(Formatters.format(123.1234, { type: 'number', dps: 4 })).toEqual('123.1234');
      });

      it('does not inset commas if set to false', function () {
        expect(Formatters.format(1234567.1234, { type: 'number', commas: false })).toEqual('1234567');
        expect(Formatters.format(123456.1234, { type: 'number', dps: 1, commas: false })).toEqual('123456.1');
        expect(Formatters.format(12345.1234, { type: 'number', dps: 2, commas: false })).toEqual('12345.12');
        expect(Formatters.format(1234.1234, { type: 'number', dps: 3, commas: false })).toEqual('1234.123');
        expect(Formatters.format(123.1234, { type: 'number', dps: 4, commas: false })).toEqual('123.1234');
      });

      it('pads with zeroes if fixed options is passed', function () {
        expect(Formatters.format(0.1, { type: 'number', fixed: 4, dps: 4 })).toEqual('0.1000');
        expect(Formatters.format(0.12, { type: 'number', fixed: 4, dps: 4 })).toEqual('0.1200');
        expect(Formatters.format(0.123, { type: 'number', fixed: 4, dps: 4 })).toEqual('0.1230');
        expect(Formatters.format(0.1234, { type: 'number', fixed: 4, dps: 4 })).toEqual('0.1234');
        expect(Formatters.format(0.12345, { type: 'number', fixed: 4, dps: 4 })).toEqual('0.1235');
      });

      it('rounds decimal values to specified number of significant figures', function () {
        expect(Formatters.format(1.234, { type: 'number', sigfigs: 4 })).toEqual('1.234');
        expect(Formatters.format(1.234, { type: 'number', sigfigs: 3 })).toEqual('1.23');
        expect(Formatters.format(1.234, { type: 'number', sigfigs: 2 })).toEqual('1.2');
        expect(Formatters.format(1.234, { type: 'number', sigfigs: 1 })).toEqual('1');
      });

      it('does not round integer values to significant figures', function () {
        expect(Formatters.format(1234, { type: 'number', sigfigs: 2 })).toEqual('1,234');
      });

      it('ignores significant figures  if decimal places are also defined', function () {
        expect(Formatters.format(1.234, { type: 'number', dps: 3, sigfigs: 4 })).toEqual('1.234');
        expect(Formatters.format(1.234, { type: 'number', dps: 3, sigfigs: 3 })).toEqual('1.234');
        expect(Formatters.format(1.234, { type: 'number', dps: 3, sigfigs: 2 })).toEqual('1.234');
        expect(Formatters.format(1.234, { type: 'number', dps: 3, sigfigs: 1 })).toEqual('1.234');
      });

      describe('pad', function () {

        it('adds extra zeros', function () {

          expect(Formatters.format(1, { type: 'number', pad: true })).toEqual('1.00');
          expect(Formatters.format(1.2, { type: 'number', pad: true })).toEqual('1.20');
          expect(Formatters.format(1.2, { type: 'number', pad: true, sigfigs: 4 })).toEqual('1.200');

        });

      });

      describe('magnitude', function () {

        describe('numbers < 1000', function () {

          it('does not pad with additional zeros', function () {
            expect(Formatters.format(11, { type: 'number', magnitude: true, pad: true  })).toEqual('11');
          });

        });

        describe('thousands', function () {

          it('does not add add "k" to numbers of a thousand that are less than to 10,000', function () {
            expect(Formatters.format(1000, { type: 'number', magnitude: true  })).toEqual('1,000');
            expect(Formatters.format(1001, { type: 'number', magnitude: true  })).toEqual('1,001');
            expect(Formatters.format(1123.11, { type: 'number', magnitude: true  })).toEqual('1,123');
            expect(Formatters.format(1123, { type: 'number', magnitude: true  })).toEqual('1,123');
          });

          it('adds "k" to numbers of a thousand that are greater than or equal to 10,000', function () {
            expect(Formatters.format(10000, { type: 'number', magnitude: true  })).toEqual('10k');
            expect(Formatters.format(10001, { type: 'number', magnitude: true  })).toEqual('10k');
            expect(Formatters.format(11200, { type: 'number', magnitude: true, sigfigs: 2  })).toEqual('11k');
            expect(Formatters.format(11200, { type: 'number', magnitude: true, sigfigs: 3  })).toEqual('11.2k');
          });

          it('rounds to 3 significant figures by default', function () {
            expect(Formatters.format(11110, { type: 'number', magnitude: true  })).toEqual('11.1k');
            expect(Formatters.format(111100, { type: 'number', magnitude: true  })).toEqual('111k');
          });

          it('pads out decimals with zeros if required', function () {
            expect(Formatters.format(11000, { type: 'number', magnitude: true, pad: true  })).toEqual('11.0k');
          });

        });

        describe('millions', function () {

          it('adds "m" to numbers of a million that are greater than or equal to 1000000', function () {
            expect(Formatters.format(1000000, { type: 'number', magnitude: true })).toEqual('1m');
            expect(Formatters.format(1000001, { type: 'number', magnitude: true })).toEqual('1m');
            expect(Formatters.format(1100000, { type: 'number', magnitude: true, sigfigs: 1  })).toEqual('1m');
            expect(Formatters.format(1100000, { type: 'number', magnitude: true, sigfigs: 2  })).toEqual('1.1m');
            expect(Formatters.format(1100000, { type: 'number', magnitude: true, sigfigs: 3  })).toEqual('1.1m');
            expect(Formatters.format(1120000, { type: 'number', magnitude: true, sigfigs: 3  })).toEqual('1.12m');
          });

          it('rounds to 3 significant figures by default', function () {
            expect(Formatters.format(1111000, { type: 'number', magnitude: true  })).toEqual('1.11m');
            expect(Formatters.format(11110000, { type: 'number', magnitude: true  })).toEqual('11.1m');
            expect(Formatters.format(111100000, { type: 'number', magnitude: true  })).toEqual('111m');
          });

          it('pads out decimals with zeros if required', function () {
            expect(Formatters.format(1000000, { type: 'number', magnitude: true, pad: true  })).toEqual('1.00m');
            expect(Formatters.format(10000000, { type: 'number', magnitude: true, pad: true  })).toEqual('10.0m');
            expect(Formatters.format(100000000, { type: 'number', magnitude: true, pad: true  })).toEqual('100m');
          });

        });

        describe('billions', function () {

          it('adds "bn" to numbers of a billion that are greater than 1000000000', function () {
            expect(Formatters.format(1000000000, { type: 'number', magnitude: true })).toEqual('1bn');
            expect(Formatters.format(1000000001, { type: 'number', magnitude: true  })).toEqual('1bn');
            expect(Formatters.format(1100000000, { type: 'number', magnitude: true, sigfigs: 1  })).toEqual('1bn');
            expect(Formatters.format(1100000000, { type: 'number', magnitude: true, sigfigs: 2  })).toEqual('1.1bn');
            expect(Formatters.format(1100000000, { type: 'number', magnitude: true, sigfigs: 3  })).toEqual('1.1bn');
            expect(Formatters.format(1120000000, { type: 'number', magnitude: true, sigfigs: 3  })).toEqual('1.12bn');
          });

          it('rounds to 3 significant figures by default', function () {
            expect(Formatters.format(1111000000, { type: 'number', magnitude: true  })).toEqual('1.11bn');
            expect(Formatters.format(11110000000, { type: 'number', magnitude: true  })).toEqual('11.1bn');
            expect(Formatters.format(111100000000, { type: 'number', magnitude: true  })).toEqual('111bn');
          });

          it('pads out decimals with zeros if required', function () {
            expect(Formatters.format(1000000000, { type: 'number', magnitude: true, pad: true  })).toEqual('1.00bn');
            expect(Formatters.format(10000000000, { type: 'number', magnitude: true, pad: true  })).toEqual('10.0bn');
            expect(Formatters.format(100000000000, { type: 'number', magnitude: true, pad: true  })).toEqual('100bn');
          });

        });

        describe('with magnitude object provided', function () {

          it('uses option object to format', function () {
            expect(Formatters.format(5000, { type: 'number', magnitude: { value: 1000, suffix: 'k' } })).toEqual('5k');
            expect(Formatters.format(5000, { type: 'number', magnitude: { value: 1000, suffix: 'k' }, pad: true })).toEqual('5.00k');
            expect(Formatters.format(100, { type: 'number', magnitude: { value: 1000, suffix: 'k' } })).toEqual('0.1k');
            expect(Formatters.format(100, { type: 'number', magnitude: { value: 1000, suffix: 'k' }, pad: true })).toEqual('0.10k');
          });

        });

        describe('abbreviated figures', function () {

          it('wraps abbreviated values in an abbr tag', function () {
            expect(Formatters.format(12345678, { type: 'number', magnitude: true, pad: true, abbr: true })).toEqual('<abbr title="12,345,678">12.3m</abbr>');
          });

          it('includes currency symbols where appropriate', function () {
            expect(Formatters.format(12345678, { type: 'currency', magnitude: true, pad: true, abbr: true })).toEqual('<abbr title="£12,345,678">£12.3m</abbr>');
          });

          it('does not wrap unabbreviated values', function () {
            expect(Formatters.format(1234, { type: 'number', magnitude: true, pad: true, abbr: true })).toEqual('1,234');
          });

        });

      });

    });

    describe('sentence', function () {

      it('breaks hyphen separated string into words and capitalises first word', function () {
        expect(Formatters.format('one-two-three', 'sentence')).toEqual('One two three');
      });

      it('converts `i` to uppercase', function () {
        expect(Formatters.format('one-two-i-three-fish', 'sentence')).toEqual('One two I three fish');
        expect(Formatters.format('one-two-three-fish-i', 'sentence')).toEqual('One two three fish I');
      });

      it('converts words in `uppercase` option array to uppercase', function () {
        expect(Formatters.format('one-two-i-three-fish', { type: 'sentence', uppercase: ['two'] })).toEqual('One TWO I three fish');
        expect(Formatters.format('one-two-three-fish-i', { type: 'sentence', uppercase: ['fish'] })).toEqual('One two three FISH I');
      });

      it('adds question marks to question-like sentences', function () {
        expect(Formatters.format('how-do-i-know', 'sentence')).toEqual('How do I know?');
        //don't match words not at start of sentence
        expect(Formatters.format('i-know-how', 'sentence')).toEqual('I know how');
        //don't match incomplete words
        expect(Formatters.format('howl-like-a-wolf', 'sentence')).toEqual('Howl like a wolf');

        expect(Formatters.format('who-am-i', 'sentence')).toEqual('Who am I?');
        expect(Formatters.format('doctor-who', 'sentence')).toEqual('Doctor who');

        expect(Formatters.format('what-is-this', 'sentence')).toEqual('What is this?');
        expect(Formatters.format('why-is-it', 'sentence')).toEqual('Why is it?');
        expect(Formatters.format('when-is-it', 'sentence')).toEqual('When is it?');
        expect(Formatters.format('why-is-it', 'sentence')).toEqual('Why is it?');
        expect(Formatters.format('where-is-it', 'sentence')).toEqual('Where is it?');
        expect(Formatters.format('is-it', 'sentence')).toEqual('Is it?');
        expect(Formatters.format('can-i-come', 'sentence')).toEqual('Can I come?');
      });

    });

    describe('plural', function () {

      it('throws if no singular option provided', function () {
        var fn = function () {
          return Formatters.format(1, 'plural');
        };
        expect(fn).toThrow();
      });

      it('returns the singular term if the value is 1', function () {
        expect(Formatters.format(1, { type: 'plural', singular: 'cat' })).toEqual('cat');
      });

      it('returns the singular term with an "s" if the value is > 1', function () {
        expect(Formatters.format(2, { type: 'plural', singular: 'cat' })).toEqual('cats');
      });

      it('returns the plural term if defined and the value is > 1', function () {
        expect(Formatters.format(2, { type: 'plural', singular: 'formula', plural: 'formulae' })).toEqual('formulae');
      });

    });

    describe('url', function() {
      it('formats a URL as a link', function () {
        expect(Formatters.format('http://example.com/', 'url')).toEqual('<a href="http://example.com/">http://example.com/</a>');
      });
    });

  });

});
