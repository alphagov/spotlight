var fs = require('graceful-fs'),
    path = require('path'),
    jsonschema = require('jsonschema'),
    _ = require('lodash'),
    Q = require('q'),
    argh = require('argh').argv,
    glob = require('glob');

require('colors');

var blacklistRegexp = /(dashboards|unimplemented-page-type|no-realistic-dashboard).json$/;

var Validator = jsonschema.Validator,
    v = new Validator();

var dashboardSchema = require('../schema/dashboard');

var stagecraftStubGlob = path.resolve(__dirname, '../app/support/stagecraft_stub/responses/**/*.json');

var testDirectory = function (fileGlob) {

  var defer = Q.defer();

  // Iterate over every dashboard file
  glob(fileGlob, function (err, files) {
    if (err) {
      throw err;
    }

    Q.allSettled(_.map(files, function (file) {

      var dashboardDefer = Q.defer();

      // If the file doesn't end in .json, don't process it
      if (file.indexOf('.json') === -1) {
        return Q.resolve({ ignored: true });
      }

      if (blacklistRegexp.test(file)) {
        return Q.resolve({ ignored: true });
      }

      fs.readFile(file, 'utf8', function (err, dashboardData) {
        if (err) {
          if (err.code === 'EISDIR') {
            return;
          } else {
            throw err;
          }
        }

        var validateModule = function (module) {
          var moduleDefer = Q.defer();
          var schema;
          schema = require('../schema/module');
          var file_path = path.resolve(__dirname, '../schema/modules_json/module_schema.json')
          schema = stripDownSchema(schema);
          fs.writeFileSync(file_path, JSON.stringify(schema, null, 2));
          schema = require('../schema/modules/comparison');
          var file_path = path.resolve(__dirname, '../schema/modules_json/comparison_schema.json')
          schema = stripDownSchema(schema);
          checkSchemaStrippedDown(schema); 
          fs.writeFileSync(file_path, JSON.stringify(schema, null, 2));
          schema = require('../schema/modules/completion_numbers');
          schema = stripDownSchema(schema);
          var file_path = path.resolve(__dirname, '../schema/modules_json/completion_numbers.json')
          fs.writeFileSync(file_path, JSON.stringify(schema, null, 2));
          try {
            schema = require('../schema/modules/' + module['module-type']);
            stripped_down_schema = stripDownSchema(schema);
//console.log(schema);
 //           console.log(stripped_down_schema);
            file_path = path.resolve(__dirname, '../schema/modules_json/' + module['module-type'] + '_schema.json')
            fs.writeFileSync(file_path, JSON.stringify(stripped_down_schema, null, 2));
            console.log('HERE');
          } catch (e) {
            schema = require('../schema/module');
          }

          if (_.keys(schema).length === 0) {
            throw 'Schema for ' + module['module-type'] + ' module contains no keys. Aborting.';
          }

          var result = v.validate(module, schema);

          if (result.errors.length > 0) {
            result.errors.forEach(function (err) {
              err.filename = file;
              err.module = module.slug + ' - ' + module['module-type'];
            });
            moduleDefer.reject(result.errors);
          } else {
            if (module['module-type'] === 'tab') {
              return Q.all(_.map(module.tabs, validateModule));
            } else {
              moduleDefer.resolve();
            }
          }
          return moduleDefer.promise;
        };

        dashboardData = JSON.parse(dashboardData);

        if (dashboardData['page-type'] !== 'dashboard') {
          return dashboardDefer.resolve({ ignored: true });
        } else if (!dashboardData['published'] && !argh.unpublished) {
          return dashboardDefer.resolve({ ignored: true });
        }

        var result = v.validate(dashboardData, dashboardSchema);
        if (result.errors.length > 0) {
          result.errors.forEach(function (err) {
            err.filename = file;
          });
          dashboardDefer.reject(result.errors);
        } else {
          return Q.all(_.map(dashboardData.modules, validateModule))
            .then(dashboardDefer.resolve, dashboardDefer.reject);
        }
      });

      return dashboardDefer.promise.then(function (a) {
        if (a.ignored === undefined) console.log(('✔ ' + file).green);
        return a;
      }, function (e) {
        console.log(('✘ ' + file).red);
        throw e;
      });

    })).then(defer.resolve);

  });

  return defer.promise;

};

var failed = [],
    succeeded = 0;

var parseResults = function (results) {
  results.forEach(function (result) {
    if (result.state === 'rejected') {
      failed.push(result.reason);
    } else if (!result.value || result.value.ignored !== true) {
      succeeded++;
    }
  });
  failed.forEach(function (err) {
    console.log(err);
  });
};

var stripDownSchema = function (schema) {
  var stripped_down_schema = JSON.parse(JSON.stringify(schema));
  /*console.log('yar');*/
  /*console.log(stripped_down_schema);*/
  /*console.log(stripped_down_schema['properties']);*/
  /*console.log('^yar');*/
  _.each(['slug', 'module-type', 'title', 'description', 'info', 'data-source'], function (attribute){
    if(stripped_down_schema['properties']){
      if(stripped_down_schema['properties'][attribute]){
        delete stripped_down_schema['properties'][attribute]
      }
    } else {
      if(stripped_down_schema['allOf'][0]['properties'][attribute]){
        delete stripped_down_schema['allOf'][0]['properties'][attribute]
      }
      if(stripped_down_schema['allOf'][1]['properties'][attribute]){
        delete stripped_down_schema['allOf'][1]['properties'][attribute]
      }
    }
  });
  if(stripped_down_schema['definitions']){
    delete stripped_down_schema['definitions']['query-params']
  }
  stripped_down_schema['$schema'] = 'http://json-schema.org/draft-03/schema#'
  return stripped_down_schema;
};

var checkSchemaStrippedDown = function (stripped_down_schema) {
  var file_path = path.resolve(__dirname, '../stripped_down_comparison_schema.json');
  correct_schema = JSON.parse(fs.readFileSync(file_path, encoding='utf8'));
  if(JSON.stringify(stripped_down_schema) !== JSON.stringify(correct_schema)){
    console.log('---------------------------');
    console.log(correct_schema);
    console.log(stripped_down_schema);
    console.log('---------------------------');
  }
};

testDirectory(stagecraftStubGlob)
  .then(parseResults)
  .then(function () {
    var allLength = succeeded + failed.length;
    console.log('\n' + allLength + ' stub' + ((allLength !== 1) ? 's' : '') + ' tested');
    console.log(('✔ ' + succeeded + ' stub' + ((succeeded !== 1) ? 's' : '') + ' passed').green);
    console.log(('✘ ' + failed.length + ' stub' + ((failed.length !== 1) ? 's' : '') + ' failed').red + '\n');
    process.exit(failed.length > 0);
  });
