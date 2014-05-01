var fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    glob = require('glob');

var stagecraftStubGlob = path.resolve(__dirname, '..', 'app', 'support', 'stagecraft_stub', 'responses', '{experimental/*.json,*.json}'),
    ignoreFileRegexp = /services\.json|unimplemented-page-type\.json/;

function generateModules(file) {
  fs.readFile(file, 'utf8', function (err, dashboardData) {
    if (err) {
      if (err.code === 'EISDIR') {
        return;
      } else {
        throw err;
      }
    }

    dashboardData = JSON.parse(dashboardData);

    // The dashboard file is valid
    var pagePerThingDirectory = file.replace('.json', ''),
        dashboardSlug = path.basename(pagePerThingDirectory);

    _.each(dashboardData.modules, function (module) {
      var moduleOnDisk = {},
          moduleSlug = module.slug,
          moduleJsonPath = path.join(pagePerThingDirectory, module.slug + '.json');

      if (fs.existsSync(moduleJsonPath)) {
        moduleOnDisk = JSON.parse(fs.readFileSync(moduleJsonPath, 'utf8'));
      }

      if (!fs.existsSync(pagePerThingDirectory)) {
        fs.mkdirSync(pagePerThingDirectory);
      }

      delete module['page-type'];
      module = _.extend(module, {
        'page-type': 'module',
        'dashboard-title': dashboardData.title,
        'dashboard-strapline': dashboardData.strapline,
        'dashboard-slug': dashboardSlug
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

      // Create a page-per-thing JSON file for each module based on the slug:
      if (!_.isEqual(moduleOnDisk, module)) {
        var pathToPagePerThing = path.join(pagePerThingDirectory, moduleSlug + '.json');
        fs.writeFileSync(pathToPagePerThing, JSON.stringify(module, null, 2) + '\n');
      }

    });
  });
}

glob(stagecraftStubGlob, function (err, files) {
  if (err) {
    throw err;
  }

  _.each(files, function (file) {
    if (!ignoreFileRegexp.test(file)) generateModules(file);
  });

});
