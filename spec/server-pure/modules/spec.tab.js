var requirejs = require('requirejs');
var _ = require('lodash');

var TabModule = require('../../../app/server/modules/tab');

var Controller = requirejs('extensions/controllers/controller');
var Model = requirejs('extensions/models/model');

describe('TabModule', function () {

  var model, module;

  beforeEach(function () {

    TabModule.map = {
      foo: function foo() {},
      bar: function bar() {}
    };

    model = new Model({
      parent: new Model({}),
      info: ['info content'],
      tabs: [
        { 'module-type': 'foo', slug: 'foo' },
        { 'module-type': 'bar', slug: 'bar' }
      ]
    });

    module = new TabModule({
      model: model
    });

  });

  describe('initialize', function () {

    it('sets "tabs" property', function () {
      expect(_.isArray(module.tabs)).toBe(true);
    });

    it('sets controller property on tabs', function () {
      expect(module.tabs[0].controller).toEqual(TabModule.map.foo);
      expect(module.tabs[1].controller).toEqual(TabModule.map.bar);
    });

    it('copies info data from tab-set to child modules', function () {
      _.each(module.tabs, function (tab) {
        expect(tab.info).toEqual(model.get('info'));
      });
    });

  });

  describe('render', function () {

    beforeEach(function () {
      spyOn(Controller.prototype, 'renderModules');
      module.render();
    });

    it('calls controller renderModules method with tabs', function () {
      expect(Controller.prototype.renderModules).toHaveBeenCalled();
      expect(Controller.prototype.renderModules.mostRecentCall.args[0]).toEqual(module.tabs);
    });

    it('passes parent model as parentModel arg to controller', function () {
      expect(Controller.prototype.renderModules.mostRecentCall.args[1]).toEqual(model.get('parent'));
    });

  });

});