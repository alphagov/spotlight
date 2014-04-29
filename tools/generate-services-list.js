var fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    glob = require('glob'),
    Q = require('q');

var stagecraftStubDir = path.resolve(__dirname, '..', 'app', 'support', 'stagecraft_stub', 'responses'),
    stagecraftStubGlob = path.resolve(stagecraftStubDir, '*.json'),
    ignoreFileRegexp = /services\.json|unimplemented-page-type\.json/;

var services = [];

function readModule(file) {
  var defer = Q.defer();
  fs.readFile(file, 'utf8', function (err, dashboardData) {
    if (err) {
      if (err.code === 'EISDIR') {
        return;
      } else {
        defer.reject(err);
        throw err;
      }
    }

    dashboardData = JSON.parse(dashboardData);
    services.push(_.pick(dashboardData, 'slug', 'title', 'department', 'agency', 'dashboard-type'));
    defer.resolve();

  });

  return defer.promise;
}

glob(stagecraftStubGlob, function (err, files) {
  if (err) {
    throw err;
  }
  Q.all(_.map(files, function (file) {
    if (!ignoreFileRegexp.test(file)) {
      return readModule(file);
    }
  })).then(function () {
    console.log('Writing ' + services.length + ' services into services.json');
    fs.writeFileSync(stagecraftStubDir + '/services.json', JSON.stringify({ items: services }, null, 2) + '\n');
  });

});

