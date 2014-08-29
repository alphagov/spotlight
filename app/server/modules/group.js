var requirejs = require('requirejs');

var ModuleController = require('../controllers/module');
var Controller = requirejs('common/modules/tab');
var View = require('../views/modules/group');

var parent = ModuleController.extend(Controller);

var Module = parent.extend({
  visualisationClass: View,

  moduleProperty: 'modules',

  initialize: function () {
    this.models = _.map(this.model.get(this.moduleProperty), function (m) {
      m.controller = this.map[m['module-type']];
      m.slug = this.model.get('slug') + '-' + m.slug;
      if (!m.info) {
        m.info = this.model.get('info');
      }
      return m;
    }, this);

    parent.prototype.initialize.apply(this, arguments);
  },

  render: function () {
    this.modules = this.renderModules(
      this.models,
      this.model.get('parent'),
      function (model) {
        return {
          url: this.url + '/' + model.get('slug')
        };
      }.bind(this),
      {},
      function () {
        this.model.set(this.moduleProperty, _.map(this.modules, function (module) {
          return _.extend(module.model.toJSON(), { html: module.html });
        }));
        parent.prototype.render.apply(this);
      }.bind(this)
    );

  }

});

module.exports = Module;
