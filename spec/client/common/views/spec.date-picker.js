define([
  'client/views/date-picker',
  'extensions/models/model',
  'extensions/collections/collection'
], function (DatePicker, Model, Collection) {

  describe('Date Picker', function () {

    var datepicker, model, collection;

    beforeEach(function () {
      collection = new Collection();
      model = new Model({
        'date-picker': {}
      });
      datepicker = new DatePicker({
        model: model,
        collection: collection
      });
    });

    describe('initialize', function () {});

    describe('events', function () {});

    describe('render', function () {});

  });

});