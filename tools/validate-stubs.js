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
          try {
            schema = require('../schema/modules/' + module['module-type']);
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

testDirectory(stagecraftStubGlob)
  .then(parseResults)
  .then(function () {
    var allLength = succeeded + failed.length;
    console.log('\n' + allLength + ' stub' + ((allLength !== 1) ? 's' : '') + ' tested');
    console.log(('✔ ' + succeeded + ' stub' + ((succeeded !== 1) ? 's' : '') + ' passed').green);
    console.log(('✘ ' + failed.length + ' stub' + ((failed.length !== 1) ? 's' : '') + ' failed').red + '\n');
    process.exit(failed.length > 0);
  });
