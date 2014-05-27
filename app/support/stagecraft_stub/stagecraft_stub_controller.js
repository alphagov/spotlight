var fs = require('fs'),
  _ = require('lodash');

function readFile(path) {
  var filePath = 'app/support/stagecraft_stub/responses/' + path + '.json';
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath);
  } else {
    return false;
  }
}

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

module.exports =  function (req, res) {
  var paramPath = req.params[0];
  var content = readFile(paramPath);
  if (content) {
    res.send(JSON.parse(content));
  } else {
    paramPath = paramPath.split('/');
    var slug = paramPath.pop();
    var parentPath = paramPath.join('/');
    var parentContent = readFile(parentPath);
    if (parentContent) {
      var moduleData = parseParent(parentContent, slug);
      if (moduleData) {
        res.send(moduleData);
      } else {
        send404(res, paramPath);
      }
    } else {
      send404(res, paramPath);
    }
  }
};
