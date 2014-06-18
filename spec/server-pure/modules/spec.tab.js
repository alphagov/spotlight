var requirejs = require('requirejs');

var TabModule = require('../../../app/server/modules/tab');

var Controller = requirejs('extensions/controllers/controller');
var Model = requirejs('extensions/models/model');

describe('TabModule', function () {

  var model, module;

  beforeEach(function () {

    TabModule.map = {
      foo: function () {},
      bar: function () {}
    };

    model = new Model({
      parent: new Model({}),
      tabs: [
        { 'module-type': 'foo', slug: 'foo' },
        { 'module-type': 'bar', slug: 'bar' }
      ]
    });

    module = new TabModule({
      model: model
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