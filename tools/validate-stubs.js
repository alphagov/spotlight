var fs = require('fs'),
    path = require('path'),
    jsonschema = require('jsonschema'),
    _ = require('lodash'),
    Q = require('q');

require('colors');

var blacklist = [
  'services.json',
  'unimplemented-page-type.json',
  'no-realistic-dashboard.json'
]

var Validator = jsonschema.Validator,
    v = new Validator();

var dashboardSchema = require('../schema/dashboard');

var stagecraftStubDirectory = path.resolve(__dirname, '../app/support/stagecraft_stub/responses');

// Iterate over every dashboard file
fs.readdir(stagecraftStubDirectory, function (err, files) {
  if (err) {
    throw err;
  }

  Q.allSettled(_.map(files, function (filename) {

    var defer = Q.defer();

    // If the file doesn't end in .json, don't process it
    if (filename.indexOf('.json') === -1) {
      return Q.resolve({ ignored: true });
    }

    if (blacklist.indexOf(filename) !== -1) {
      return Q.resolve({ ignored: true });
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
      var result = v.validate(dashboardData, dashboardSchema);
      if (result.errors.length > 0) {
        result.errors.forEach(function (err) {
          err.filename = filename;
        });
        defer.reject(result.errors);
      } else {

        return Q.all(_.map(dashboardData.modules, function (module) {
          var moduleDefer = Q.defer();
          var schema;
          try {
            schema = require('../schema/modules/' + module['module-type']);
          } catch (e) {
            schema = require('../schema/module');
          }

          var result = v.validate(module, schema);

          if (result.errors.length > 0) {
            result.errors.forEach(function (err) {
              err.filename = filename;
              err.module = module.slug + ' - ' + module['module-type'];
            });
            moduleDefer.reject(result.errors);
          } else {
            moduleDefer.resolve();
          }
          return moduleDefer.promise;
        })).then(defer.resolve, defer.reject);

      }
    });

    return defer.promise;
  })).then(function (results) {
    var failed = [],
        succeeded = 0;
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
    var allLength = succeeded + failed.length;
    console.log('\n' + allLength + ' stub' + ((allLength !== 1) ? 's' : '') + ' tested');
    console.log((succeeded + ' stub' + ((succeeded !== 1) ? 's' : '') + ' passed').green);
    console.log((failed.length + ' stub' + ((failed.length !== 1) ? 's' : '') + ' failed').red + '\n');
    process.exit(failed.length > 0);
  });
});