var fs = require('fs'),
    path = require('path'),
    jsonschema = require('jsonschema'),
    _ = require('underscore');

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
        'Public sector purchasing dashboard'
      ]
    },
    'tagline': {
      'type': 'string',
      'required': true
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
      'type': 'string',
      'required': true
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

moduleSchemas.realtime = moduleSchemas.common;

moduleSchemas.grouped_timeseries = _.extend(moduleSchemas.common,
  {});

moduleSchemas.completion_numbers = moduleSchemas.common;

moduleSchemas.completion_rate = moduleSchemas.common;

moduleSchemas.journey = moduleSchemas.common;

moduleSchemas.availability = moduleSchemas.common;

moduleSchemas.multi_stats = moduleSchemas.common;

moduleSchemas.list = moduleSchemas.common;

var validationResult = {},
    stagecraftStubDirectory = path.resolve(__dirname, '..', 'app', 'support', 'stagecraft_stub', 'responses');

// Iterate over every dashboard file
fs.readdir(stagecraftStubDirectory, function (err, files) {
  if (err) {
    throw err;
  }

  _.each(files, function (filename) {
    if (filename === 'services.json' || filename === 'unimplemented-page-type.json') {
      return;
    }

    fs.readFile(path.join(stagecraftStubDirectory, filename), 'utf8', function (err, dashboardData) {
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
        console.log('===== Error while linting', filename, '=====');
        console.log(validationResult.errors);
      } else {
        // The dashboard file is valid
        var dashboardSlug = filename.replace('.json', ''),
            pagePerThingDirectory = path.join(stagecraftStubDirectory, dashboardSlug);

        _.each(dashboardData.modules, function (module) {
          var moduleOnDisk = JSON.parse(fs.readFileSync(path.join(pagePerThingDirectory, module.slug + '.json'), 'utf8')),
              moduleSlug = module.slug;
          delete module.slug;
          delete module['page-type'];
          module = _.extend(module, {
            'page-type': 'module',
            'dashboard-title': dashboardData.title,
            'dashboard-strapline': dashboardData.strapline,
            'dashboard-slug': dashboardSlug
          });
          // Validate it against a schema based on module-type
          var moduleType = module['module-type'];
          validationResult = v.validate(module, moduleSchemas[moduleType]);

          if (validationResult.errors.length > 0) {
            console.log('===== Error linting "' + module.title + '" in', filename, '=====');
            console.log(validationResult.errors);
          } else {
            // Create a page-per-thing JSON file based on the slug:
            if (!_.isEqual(moduleOnDisk, module)) {
              // Write out modules if the calculated module differs from the module on disk
              console.log('->', dashboardSlug, moduleSlug, 'is different on disk, rewriting it.');
              var pathToPagePerThing = path.join(stagecraftStubDirectory, dashboardSlug, moduleSlug + '.json');
              fs.writeFileSync(pathToPagePerThing, JSON.stringify(module, null, 2) + '\n');
            }
          }

        });
      }
    });
  });
});
