var fs = require('graceful-fs'),
  _ = require('lodash');

function parseParent(content, slug) {
  var dashboardData = JSON.parse(content);
  var module = _.find(dashboardData.modules, function (module) {
    return module.slug === slug;
  });

  if (!module) {
    return false;
  }

  module = _.extend(module, {
    'page-type': 'module',
    'dashboard-title': dashboardData.title,
    'dashboard-strapline': dashboardData.strapline,
    'dashboard-slug': dashboardData.slug
  });

  if (dashboardData.department) {
    module = _.extend(module, {
      'department': dashboardData.department
    });
  }

  if (dashboardData.agency) {
    module = _.extend(module, {
      'agency': dashboardData.agency
    });
  }

  delete module.classes; // We don't care about the classes property on the page-per-thing pages

  return module;

}

function send404(res, filePath) {
  res.status(404);
  res.send({error: "No such stub exists: " + filePath});
}

module.exports =  function(config) {

  function readFile(path, callback) {
    var filePath = require('path').join(config.stagecraftStubPath, path + '.json');
    fs.readFile(filePath, callback);
  }

  return function (req, res) {
    var paramPath = req.params[0];
    var content = readFile(paramPath, function (err, content) {
      if (err) {
        paramPath = paramPath.split('/');
        var slug = paramPath.pop();
        var parentPath = paramPath.join('/');
        readFile(parentPath, function (err, parentContent) {
          if (err) {
            send404(res, paramPath);
          } else {
            var moduleData = parseParent(parentContent, slug);
            if (moduleData) {
              res.send(moduleData);
            } else {
              send404(res, paramPath);
            }
          }
        });
      } else {
        res.send(JSON.parse(content));
      }
    });
  };
};
