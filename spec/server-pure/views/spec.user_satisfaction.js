var requirejs = require('requirejs');

var UserSatisfactionView = require('../../../app/server/views/modules/user_satisfaction');
var Collection = requirejs('extensions/collections/collection');


describe('UserSatisfactionView', function () {

  var collection, view;
  beforeEach(function () {
    collection = new Collection();
    var data = [
      {
        satisfactionTaxDisc: 1.15282352941176,
        _timestamp: collection.getMoment('2004-04-01T00:00:00+00:00')
      },
      {
        satisfactionTaxDisc: 1.1196403807733,
        _timestamp: collection.getMoment('2004-05-01T00:00:00+00:00')
      },
      {
        satisfactionTaxDisc: 1.13464643678161,
        _timestamp: collection.getMoment('2004-06-01T00:00:00+00:00')
      }
    ];
    collection.reset({
      id: 'test',
      title: 'test',
      data: data
    }, { parse: true });

    collection.options = {
      valueAttr: 'satisfactionTaxDisc'
    };

    view = new UserSatisfactionView({
      collection: collection
    });

  });

  afterEach(function () {
    view.remove();
  });

  it('calculates percentages correctly and sets them as an attribute', function () {

    expect(collection.at(0).get('satisfactionTaxDisc_percent')).toBeCloseTo(0.9618, 4);
    expect(collection.at(1).get('satisfactionTaxDisc_percent')).toBeCloseTo(0.9701, 4);
    expect(collection.at(2).get('satisfactionTaxDisc_percent')).toBeCloseTo(0.9663, 4);

  });

});
