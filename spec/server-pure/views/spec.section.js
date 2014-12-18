var requirejs = require('requirejs');

var Collection = requirejs('extensions/collections/collection');
var Model = requirejs('extensions/models/model');
var SectionModule = require('../../../app/server/modules/section');
var KPIModule = require('../../../app/server/modules/kpi');

describe('SectionView', function () {

  var sectionModel, module, fetch;

  beforeEach(function () {
    fetch = Collection.prototype.fetch;

    Collection.prototype.fetch = function () {
      this.reset([
        {
          value: 1100,
          _timestamp: '2014-01-01T00:00:00+00:00',
          end_at: '2015-01-01T00:00:00+00:00'
        },
        { value: 1000 }]
      );
    };

    SectionModule.map = {
      kpi: KPIModule
    };
    var dashboard = new Model({
        'page-type': 'dashboard'
    });

    sectionModel = new Model({
      'module-type': 'section',
      title: 'A section',
      slug: 'section-slug',
      modules: [
        {
          slug: 'module-slug',
          'module-type': 'kpi',
          'title': 'Cost per transaction',
          'classes': 'cols3',
          'value-attribute': 'value',
          'format': {
            'type': 'currency',
            'pence': true
          },
          info: [],
          'data-source': {
            'data-group': 'transactional-services',
            'data-type': 'summaries',
            'query-params': {
              'filter_by': [
                'service_id:dwp-carers-allowance-new-claims',
                'type:seasonally-adjusted'
              ],
              'sort_by': '_timestamp:descending'
            }
          }
        }
      ],
      parent: dashboard
    });

    module = new SectionModule({ model: sectionModel});
    module.render();
    module.sectionModules[0].trigger('ready');

  });

  afterEach(function () {
    Collection.prototype.fetch = fetch;
  });

  it('renders a section with a nested module', function () {
    expect(module.view.$el.find('#section-slug-heading').text()).toEqual('A section');
    expect(module.view.$el.find('section#module-slug a').text()).toEqual('Cost per transaction');
  });

  it('renders a non-linkable section heading', function () {
    expect(module.view.$el.find('#section-slug-heading a').length).toEqual(0);
  });

});
