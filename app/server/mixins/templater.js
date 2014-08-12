var fs = require('fs');

module.exports = {
  loadTemplate: function (path, data, type) {

    type = type || 'underscore';

    var template = fs.readFileSync(path);

    if (type === 'mustache') {
      return require('mustache').render(template.toString(), data);
    } else if (type === 'underscore') {
      return _.template(template, data);
    } else {
      throw new Error('Unrecognised template type: ', type);
    }

  }
};
