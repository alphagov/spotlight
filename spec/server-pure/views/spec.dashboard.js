var requirejs = require('requirejs');

var DashboardView = require('../../../app/server/views/dashboard');
var ContentDashboardView = require('../../../app/server/views/dashboards/content');
var TransactionDashboardView = require('../../../app/server/views/dashboards/transaction');
var OtherDashboardView = require('../../../app/server/views/dashboards/other');
var DeptDashboardView = require('../../../app/server/views/dashboards/department');

var Model = requirejs('extensions/models/model');

describe('DashboardView', function () {

  var view, model;
  beforeEach(function () {
    model = new Model({
      foo: 'bar',
      'dashboard-type': 'service',
      service: {
        title: 'Carer\'s Allowance'
      }
    });
    view = new DashboardView({
      model: model
    });
    view.moduleInstances = [
      { html: '<div>module 1</div>' },
      { html: '<div>module 2</div>' }
    ];
    spyOn(view, 'loadTemplate').andReturn('rendered');
  });

  describe('getContent', function () {

    it('renders a content template with model data and module content', function () {
      var result = view.getContent();
      expect(result).toEqual('rendered');
      var context = view.loadTemplate.argsForCall[0][1];
      expect(context.foo).toEqual('bar');
      expect(context.modules).toEqual('<div>module 1</div>\n<div>module 2</div>');
    });

    it('does not display a footer by default', function () {
      view.getContent();
      var context = view.loadTemplate.argsForCall[0][1];
      expect(context.hasFooter).toEqual(false);
    });

  });

  describe('getPageHeader', function () {

    it('calculates correct page header for transactions', function () {
      model.set({
        title: 'Carer\'s Allowance'
      });
      view.dashboardType = 'transaction';
      expect(view.getPageHeader()).toEqual('Carer\'s Allowance');
    });

  });

  describe('getMetaDescription', function () {

    it('calculates correct meta description for transactions', function () {
      model.set({
        title: 'Carer\'s Allowance'
      });
      expect(view.getMetaDescription()).toEqual(null);
    });

  });


  describe('getTagline', function () {

    it('returns the tagline property from the model', function () {
      model.set('tagline', 'Tagline set on model');
      expect(view.getTagline()).toEqual('Tagline set on model');
      model.set('tagline', 'Different tagline set on model');
      expect(view.getTagline()).toEqual('Different tagline set on model');
    });

  });

  describe('getPageTitle', function () {

    it('calculates page title from title and strapline', function () {
      model.set({
        title: 'Title',
        strapline: 'Service dashboard'
      });
      view.dashboardType = 'service';
      expect(view.getPageTitle()).toEqual('Service dashboard - Title - GOV.UK');
    });

    it('calculates page title from title alone', function () {
      model.set({
        title: 'Title'
      });
      view.dashboardType = 'service';
      expect(view.getPageTitle()).toEqual('Title - Performance - GOV.UK');
    });
  });

  describe('getSchemaOrgItemType', function () {
    it('has a schema.org itemtype of GovernmentService', function () {
      expect(view.getSchemaOrgItemType()).toEqual('http://schema.org/GovernmentService');
    });
  });

});

describe('ContentDashboardView', function () {

  var view, model;
  beforeEach(function () {
    model = new Model({
      foo: 'bar',
      'dashboard-type': 'content',
      title: 'Content Dashboard'
    });
    view = new ContentDashboardView({
      model: model,
      contentTemplate: jasmine.createSpy().andReturn('rendered')
    });
  });

});

describe('hasBigScreenFlag', function () {

  var model;

  beforeEach(function () {
    model = new Model({
      foo: 'bar',
      title: 'Carer\'s Allowance'
    });
  });

  function getContext(model) {
    var view = new TransactionDashboardView({
      model: model
    });
    spyOn(view, 'loadTemplate').andReturn('rendered');
    view.getContent();
    return view.loadTemplate.argsForCall[0][1];
  }

  it('shows a big screen link on detailed (transaction) dashboards', function () {
    model.set('modules', [{ 'module-type': 'kpi' }]);
    expect(getContext(model).hasBigScreenView).toEqual(true);
  });

  it('should\'t show the link if there are no supported modules', function() {
    model.set('modules', [
      { 'module-type': 'tab' },
      { 'module-type': 'availablity' },
    ]);
    expect(getContext(model).hasBigScreenView).toEqual(false);
  });

  it('should show the link if there is a kpi module', function() {
    model.set('modules', [
      { 'module-type': 'kpi' },
    ]);
    expect(getContext(model).hasBigScreenView).toEqual(true);
  });

  it('should show the link if there is a realtime module', function() {
    model.set('modules', [
      { 'module-type': 'realtime' },
    ]);
    expect(getContext(model).hasBigScreenView).toEqual(true);
  });

  it('should show the link if there is a table module', function() {
    model.set('modules', [
      { 'module-type': 'table' },
    ]);
    expect(getContext(model).hasBigScreenView).toEqual(true);
  });

  it('should show the link if there is a single_timeseries module', function() {
    model.set('modules', [
      { 'module-type': 'single_timeseries' },
    ]);
    expect(getContext(model).hasBigScreenView).toEqual(true);
  });

  it('should show the link if there is a grouped_timeseries module', function() {
    model.set('modules', [
      { 'module-type': 'grouped_timeseries' },
    ]);
    expect(getContext(model).hasBigScreenView).toEqual(true);
  });

  it('should show the link if there is a section module that contains a kpi module', function() {
    model.set('modules', [
      {
        'module-type': 'section',
        'modules': [
          {
            'module-type': 'kpi'
          }
        ]
       },
    ]);
    expect(getContext(model).hasBigScreenView).toEqual(true);
  });

  it('should\'t show the link if there are no supported modules in the section module', function() {
    model.set('modules', [
      {
        'module-type': 'section',
        'modules': [
          {
            'module-type': 'availablity'
          }
        ]
       },
    ]);
    expect(getContext(model).hasBigScreenView).toEqual(false);
  });

  it('should show the link if there is a user_satisfaction_graph module and its using user-satisfaction-score dataset', function() {
    model.set('modules', [
      { 'module-type': 'user_satisfaction_graph',
        'data-source': { 'data-type': 'user-satisfaction-score' } },
    ]);
    expect(getContext(model).hasBigScreenView).toEqual(true);
  });

  it('should\'t show the link if there is a user_satisfaction_graph module and its using not a user-satisfaction-score dataset', function() {
    model.set('modules', [
      { 'module-type': 'user_satisfaction_graph',
        'data-source': { 'data-type': 'customer-satisfaction' } },
    ]);
    expect(getContext(model).hasBigScreenView).toEqual(false);
  });

});

describe('TransactionDashboardView', function () {

  var view, model;
  beforeEach(function () {
    model = new Model({
      foo: 'bar',
      'dashboard-type': 'transaction',
      title: 'Carer\'s Allowance'
    });
    view = new TransactionDashboardView({
      model: model
    });
    spyOn(view, 'loadTemplate').andReturn('rendered');
  });


  describe('getContent', function () {

    it('displays a footer on detailed dashboards', function () {
      view.getContent();
      var context = view.loadTemplate.argsForCall[0][1];
      expect(context.hasFooter).toEqual(true);
    });

  });

  describe('getMetaDescription', function () {

    it('calculates correct meta description', function () {
      model.set({
        title: 'Carer\'s Allowance'
      });
      view.dashboardType = 'transaction';
      expect(view.getMetaDescription()).toEqual('View performance statistics for the \'Carer\'s Allowance\' service from the Performance Platform on GOV.UK');
    });

  });

  describe('getTagline', function () {

    it('returns the correct tagline', function () {
      expect(view.getTagline()).toEqual('This dashboard shows information about how the <strong>Carer\'s Allowance</strong> service is currently performing.');
    });

    it('returns the tagline from the model if set', function () {
      view.model.set('tagline', 'Test tagline');
      expect(view.getTagline()).toEqual('Test tagline');
    });

  });

});

describe('DeptDashboardView', function () {

  var view, model;
  beforeEach(function () {
    model = new Model({
      foo: 'bar',
      'dashboard-type': 'department',
      title: 'Department for Work and Pensions',
      department: {
        title: 'Department for Work and Pensions'
      }
    });
    view = new DeptDashboardView({
      model: model,
      contentTemplate: jasmine.createSpy().andReturn('rendered')
    });
  });

  describe('getTagline', function () {

    it('returns the correct tagline', function () {
      expect(view.getTagline()).toEqual('This dashboard shows information about how selected services run by the <strong>Department for Work and Pensions</strong> are currently performing.');
    });

  });

});


describe('OtherDashboardView', function () {

  var view, model;
  beforeEach(function () {
    model = new Model({
      foo: 'bar',
      'dashboard-type': 'other',
      title: 'Cabinet Office IT',
      description: 'Test description',
      department: {
        title: 'Cabinet Office'
      }
    });
    view = new OtherDashboardView({
      model: model,
      contentTemplate: jasmine.createSpy().andReturn('rendered')
    });
    spyOn(view, 'loadTemplate').andReturn('rendered');
  });

  describe('getTagline', function () {

    it('returns the description', function () {
      expect(view.getTagline()).toEqual('Test description');
    });

  });

  it('displays a footer on detailed dashboards', function () {
    view.getContent();
    var context = view.loadTemplate.argsForCall[0][1];
    expect(context.hasFooter).toEqual(true);
  });


});
