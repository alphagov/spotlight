var fs = require('fs'),
    path = require('path'),
    jsonschema = require('jsonschema'),
    _ = require('lodash'),
    Q = require('q'),
    argh = require('argh').argv;

require('colors');

var blacklist = [
  'services.json',
  'unimplemented-page-type.json',
  'no-realistic-dashboard.json'
];

var Validator = jsonschema.Validator,
    v = new Validator();

var dashboardSchema = require('../schema/dashboard');

var stagecraftStubDirectory = path.resolve(__dirname, '../app/support/stagecraft_stub/responses');

var testDirectory = function (dir, subdir) {

  subdir = subdir || '';

  var defer = Q.defer();

  // Iterate over every dashboard file
  fs.readdir(path.join(dir, subdir), function (err, files) {
    if (err) {
      throw err;
    }

    Q.allSettled(_.map(files, function (filename) {

      var dashboardDefer = Q.defer();

      // If the file doesn't end in .json, don't process it
      if (filename.indexOf('.json') === -1) {
        return Q.resolve({ ignored: true });
      }

      if (blacklist.indexOf(filename) !== -1) {
        return Q.resolve({ ignored: true });
      }

      filename = path.join(subdir, filename);

      fs.readFile(path.join(dir, filename), 'utf8', function (err, dashboardData) {
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

          var result = v.validate(module, schema);

          if (result.errors.length > 0) {
            result.errors.forEach(function (err) {
              err.filename = filename;
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
        var result = v.validate(dashboardData, dashboardSchema);
        if (result.errors.length > 0) {
          result.errors.forEach(function (err) {
            err.filename = filename;
          });
          dashboardDefer.reject(result.errors);
        } else {
          return Q.all(_.map(dashboardData.modules, validateModule))
            .then(dashboardDefer.resolve, dashboardDefer.reject);
        }
      });

      return dashboardDefer.promise.then(function (a) {
        console.log(('✔ ' + filename).green);
        return a;
      }, function (e) {
        console.log(('✘ ' + filename).red);
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

testDirectory(stagecraftStubDirectory)
  .then(parseResults)
  .then(function () {
    if (argh.experimental) {
      return testDirectory(stagecraftStubDirectory, 'experimental')
        .then(parseResults);
    }
  })
  .then(function () {
    var allLength = succeeded + failed.length;
    console.log('\n' + allLength + ' stub' + ((allLength !== 1) ? 's' : '') + ' tested');
    console.log(('✔ ' + succeeded + ' stub' + ((succeeded !== 1) ? 's' : '') + ' passed').green);
    console.log(('✘ ' + failed.length + ' stub' + ((failed.length !== 1) ? 's' : '') + ' failed').red + '\n');
    process.exit(failed.length > 0);
  });