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

      it('returns seconds to 1d.p. if passed unit option of `s`', function () {
        expect(Formatters.format(567, { type: 'duration', unit: 's' })).toEqual('1s');
        expect(Formatters.format(1234, { type: 'duration', unit: 's' })).toEqual('1s');
        expect(Formatters.format(12345, { type: 'duration', unit: 's' })).toEqual('12s');
      });

      it('returns values rounded to correct number of decimal places', function () {
        expect(Formatters.format(567, { type: 'duration', unit: 's', dps: 2 })).toEqual('0.57s');
        expect(Formatters.format(1234, { type: 'duration', unit: 's', dps: 2 })).toEqual('1.23s');
        expect(Formatters.format(12345, { type: 'duration', unit: 's', dps: 2 })).toEqual('12.35s');
      });

    });

    describe('currency', function () {

      it('returns formatted number with pound symbol', function () {
        expect(Formatters.format(0.567, 'currency')).toEqual('£1');
        expect(Formatters.format(5.67, 'currency')).toEqual('£6');
        expect(Formatters.format(567, 'currency')).toEqual('£567');
        expect(Formatters.format(1234, 'currency')).toEqual('£1,234');
        expect(Formatters.format(12345, 'currency')).toEqual('£12,345');
      });

      it('returns formatted number with symbol option if provided', function () {
        expect(Formatters.format(0.567, { type: 'currency', symbol: '$' })).toEqual('$1');
        expect(Formatters.format(5.67, { type: 'currency', symbol: '$' })).toEqual('$6');
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

      it('returns formatted number to 0d.ps with percent symbol', function () {
        expect(Formatters.format(0.567, 'percent')).toEqual('57%');
        expect(Formatters.format(1, 'percent')).toEqual('100%');
      });

      it('returns formatted number with percent symbol to dps specified', function () {
        expect(Formatters.format(0.567, { type: 'percent', dps: 1 })).toEqual('56.7%');
        expect(Formatters.format(1, { type: 'percent', dps: 1 })).toEqual('100%');
      });

    });

    describe('integer', function () {

      it('returns number rounded to 0dps', function () {
        expect(Formatters.format(0.1, 'integer')).toEqual('0');
        expect(Formatters.format(0.5, 'integer')).toEqual('1');
        expect(Formatters.format(13.7, 'integer')).toEqual('14');
        expect(Formatters.format(12345.67, 'integer')).toEqual('12,346');
      });

    });

    describe('number', function () {

      it('returns number rounded to decimal places specified', function () {
        expect(Formatters.format(0.1234, 'number')).toEqual('0');
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
        expect(Formatters.format(0, { type: 'number', fixed: 4, dps: 4 })).toEqual('0.0000');
        expect(Formatters.format(0.1, { type: 'number', fixed: 4, dps: 4 })).toEqual('0.1000');
        expect(Formatters.format(0.12, { type: 'number', fixed: 4, dps: 4 })).toEqual('0.1200');
        expect(Formatters.format(0.123, { type: 'number', fixed: 4, dps: 4 })).toEqual('0.1230');
        expect(Formatters.format(0.1234, { type: 'number', fixed: 4, dps: 4 })).toEqual('0.1234');
        expect(Formatters.format(0.12345, { type: 'number', fixed: 4, dps: 4 })).toEqual('0.1235');
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

  });

});
