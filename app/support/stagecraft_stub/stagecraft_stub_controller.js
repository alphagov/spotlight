var fs = require('graceful-fs'),
  _ = require('lodash'),
  glob = require('glob'),
  async = require('async');

function parseParent(dashboardData, slug) {
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

function loadRelated(basePath, callback) {
  async.map([
    basePath + '/departments.json',
    basePath + '/business-models.json',
    basePath + '/customer-types.json',
    basePath + '/agencies.json'
  ], fs.readFile,
  function(err, content) {
    var json = content.map(JSON.parse.bind(JSON)),
        related = { };

    related.departments = json[0];
    related.businessModels = json[1];
    related.customerTypes = json[2];
    related.agencies = json[3];

    callback(null, related);
  });
}

function enrichDashboard(related, dashboard) {
  if (dashboard.department) {
    dashboard.department =
      related.departments[dashboard.department];
  }

  if (dashboard.agency) {
    dashboard.agency = related.agencies[dashboard.agency];
  }

  if (dashboard['customer-type']) {
    dashboard['customer-type'] =
      related.customerTypes[dashboard['customer-type']];
  }

  if (dashboard['business-model']) {
    dashboard['business-model'] =
      related.businessModels[dashboard['business-model']];
  }

  return dashboard;
}

function removeDisabledModules(dashboard) {
  if (dashboard.modules) {
    dashboard.modules = dashboard.modules.filter(function(module) {
      return !module.disabled;
    });
  }
  return dashboard;
}

function loadDashboards(basePath, callback) {
  loadRelated(basePath, function(err, related) {
    if (err) callback(err);
    else {
      var dashboardGlob = require('path').join(basePath, 'dashboards/**/*.json');
      glob(dashboardGlob, function(err, files) {
        if (err) callback(err);
        else {
          async.map(files, fs.readFile, function(err, results) {
            var dashboardMap = results.map(JSON.parse.bind(JSON))
                                      .map(removeDisabledModules)
                                      .map(enrichDashboard.bind(null, related))
                                      .reduce(function(dashboards, dashboard) {
                                        dashboards[dashboard.slug] = dashboard;
                                        return dashboards;
                                      }, { });

            callback(null, dashboardMap);
          });
        }
      });
    }
  });
}

module.exports =  function(config, callback) {

  var dashboardGlob = require('path').join(
          config.stagecraftStubPath, '../');

  loadDashboards(dashboardGlob, function (err, dashboards) {
    callback(function(req, res) {
      var slug = req.params[0],
          dashboard = dashboards[slug],
          slugParts, parentSlug;

      console.log(slug, dashboard);

      if (!dashboard) {
        slugParts = slug.split('/');
        slug = slugParts.pop();
        parentSlug = slugParts.join('/');

        dashboard = dashboards[parentSlug];
        console.log(parentSlug, dashboard);
        if (!dashboard) send404(res, parentSlug + '/' + slug);
        else {
          module = parseParent(dashboard, slug);
          if (module) res.send(module);
          else send404(res, parentSlug + '/' + slug);
        }
      } else {
        res.send(dashboard);
      }
    });
  });
};
