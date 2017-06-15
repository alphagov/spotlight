var fs = require('fs');
var cache = require('memory-cache');

var fetchTemplate = function (path) {
  var template = cache.get(path);
  if (template === null) {
    var templateSource =  fs.readFileSync(path).toString();
    template = cache.put(path, templateSource);
  }
  return template;
};

module.exports = {

  template: function (data) {
    return this.loadTemplate(this.templatePath, data, this.templateType);
  },

  loadTemplate: function (path, data, type) {

    if (arguments.length === 2 && typeof data === 'string') {
      type = data;
      data = {};
    }

    data = data || {};
    type = type || 'underscore';

    var template = fetchTemplate(path);

    if (type === 'mustache') {
      return require('mustache').render(template.toString(), data);
    } else if (type === 'underscore') {
      return _.template(template, data);
    } else {
      throw new Error('Unrecognised template type: ', type);
    }

  }

};
