var fs = require('fs'),
    path = require('path'),
    jsonschema = require('jsonschema'),
    _ = require('lodash'),
    Q = require('q');

require('colors');

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

    if (filename === 'services.json' || filename === 'unimplemented-page-type.json') {
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
    console.log('\n' + (succeeded + failed.length) + ' schema validated');
    console.log((succeeded + ' schema passed').green);
    console.log((failed.length + ' schema failed').red + '\n');
    process.exit(failed.length > 0);
  });
});