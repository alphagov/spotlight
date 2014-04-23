var fs = require('fs'),
    path = require('path'),
    jsonschema = require('jsonschema'),
    _ = require('lodash'),
    glob = require('glob');

var Validator = jsonschema.Validator,
    v = new Validator();

var dashboardSchema = {
  'id': '/Dashboard',
  'type': 'object',
  'properties': {
    'slug': {
      'type': 'string',
      'required': true
    },
    'page-type': {
      'type': 'string',
      'required': true,
      'enum': ['dashboard']
    },
    'title': {
      'type': 'string',
      'required': true
    },
    'strapline': {
      'type': 'string',
      'required': true,
      'enum': [
        'Service dashboard',
        'Performance',
        'Policy dashboard',
        'Public sector purchasing dashboard',
        'Content dashboard'
      ]
    },
    'modules': {
      'type': 'array',
      'minItems': 1,
      'items': {
        'type': 'object'
      },
      'uniqueItems': true
    }
  }
};

var moduleSchemas = {};

moduleSchemas.common = {
  'id': '/ModuleCommon',
  'type': 'object',
  'properties': {
    'page-type': {
      'type': 'string',
      'required': true,
      'enum': ['module']
    },
    'module-type': {
      'type': 'string',
      'required': true
    },
    'title': {
      'type': 'string',
      'required': true
    },
    'description': {
      'type': 'string'
    },
    'info': {
      'type': 'array',
      'items': {
        'type': 'string'
      },
      'minItems': 1
    },
    'data-group': {
      'type': 'string',
      'required': true
    },
    'data-type': {
      'type': 'string',
      'required': true
    }
  }
};

moduleSchemas.tabs = {
  'id': '/ModuleCommon',
  'type': 'object',
  'properties': {
    'page-type': {
      'type': 'string',
      'required': true,
      'enum': ['module']
    },
    'module-type': {
      'type': 'string',
      'required': true
    },
    'title': {
      'type': 'string',
      'required': true
    },
    'description': {
      'type': 'string'
    }
  }
};

moduleSchemas.realtime = moduleSchemas.common;

moduleSchemas.grouped_timeseries = _.extend(moduleSchemas.common,
  {});

moduleSchemas.completion_numbers = moduleSchemas.common;

moduleSchemas.completion_rate = moduleSchemas.common;

moduleSchemas.journey = moduleSchemas.common;

moduleSchemas.availability = moduleSchemas.common;

moduleSchemas.comparison = moduleSchemas.common;

moduleSchemas.multi_stats = moduleSchemas.common;

moduleSchemas.list = moduleSchemas.common;

moduleSchemas.tab = moduleSchemas.tabs;

moduleSchemas.table = moduleSchemas.common;

moduleSchemas.user_satisfaction = moduleSchemas.common;

moduleSchemas.user_satisfaction_graph = moduleSchemas.common;

moduleSchemas.kpi = moduleSchemas.common;

var validationResult = {},
    stagecraftStubGlob = path.resolve(__dirname, '..', 'app', 'support', 'stagecraft_stub', 'responses', '{experimental/*.json,*.json}'),
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
    validationResult = v.validate(dashboardData, dashboardSchema);

    if (validationResult.errors.length > 0) {
      console.log('===== Error while linting', file, '=====');
      console.log(validationResult.errors);
    } else {
      // The dashboard file is valid
      var dashboardSlug = file.replace('.json', ''),
          pagePerThingDirectory = dashboardSlug;

      _.each(dashboardData.modules, function (module) {
        var moduleOnDisk = {},
            moduleSlug = module.slug,
            moduleJsonPath = path.join(pagePerThingDirectory, module.slug + '.json');

        if (fs.existsSync(moduleJsonPath)) {
          moduleOnDisk = JSON.parse(fs.readFileSync(moduleJsonPath, 'utf8'));
        }

        if (!fs.existsSync(pagePerThingDirectory)) {
          console.log('->', 'page-per-thing directory does not exist - creating', pagePerThingDirectory);
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

        // Validate it against a schema based on module-type
        var moduleType = module['module-type'];
        validationResult = v.validate(module, moduleSchemas[moduleType]);

        if (validationResult.errors.length > 0) {
          console.log('===== Error linting "' + module.title + '" in', file, '=====');
          console.log(validationResult.errors);
        } else {
          // Create a page-per-thing JSON file based on the slug:
          if (!_.isEqual(moduleOnDisk, module)) {
            // Write out modules if the calculated module differs from the module on disk
            console.log('->', dashboardSlug, moduleSlug, 'is different on disk, rewriting it.');
            var pathToPagePerThing = path.join(dashboardSlug, moduleSlug + '.json');
            fs.writeFileSync(pathToPagePerThing, JSON.stringify(module, null, 2) + '\n');
          }
        }

      });
    }
  });
}

glob(stagecraftStubGlob, function(err, files) {
  if (err) {
    throw err;
  }

  console.log(files);

  _.each(files, function(file) {
    if (!ignoreFileRegexp.test(file)) generateModules(file);
  });

});

