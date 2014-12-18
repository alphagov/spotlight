var _ = require('lodash');
var requirejs = require('requirejs');

var SectionModule = require('../../../app/server/modules/section');

var Controller = requirejs('extensions/controllers/controller');
var Model = requirejs('extensions/models/model');

describe('SectionModule', function () {

  var module, model;

  beforeEach(function () {

    SectionModule.map = {
      foo: function foo() {}
    };

    model = new Model({
      'module-type': 'section',
      title: 'A section',
      slug: 'section-slug',
      modules: [
        {
          'module-type': 'foo',
          slug: 'foo'
        }
      ],
      parent: new Model({})
    });

    module = new SectionModule({ model: model });

  });

  describe('initialize', function () {

    it('sets "modules" property', function () {
      expect(_.isArray(module.modules)).toBe(true);
    });

    it('sets controller property on nested modules', function () {
      expect(module.modules[0].controller).toEqual(SectionModule.map.foo);
    });

  });

  describe('render', function () {

    beforeEach(function () {
      spyOn(Controller.prototype, 'renderModules');
      module.render();
    });

    it('calls controller renderModules method with modules', function () {
      expect(Controller.prototype.renderModules).toHaveBeenCalled();
      expect(Controller.prototype.renderModules.mostRecentCall.args[0]).toEqual(module.modules);
    });

    it('passes parent model as parentModel arg to controller', function () {
      expect(Controller.prototype.renderModules.mostRecentCall.args[1]).toEqual(model.get('parent'));
    });

  });

});
