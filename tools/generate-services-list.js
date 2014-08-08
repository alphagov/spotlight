var fs = require('graceful-fs'),
    path = require('path'),
    _ = require('lodash'),
    glob = require('glob'),
    Q = require('q');

var stagecraftStubDir = path.resolve(__dirname, '../app/support/stagecraft_stub/responses'),
    stagecraftStubGlob = path.resolve(stagecraftStubDir, '**/*.json');

var dashboards = [
  {
    slug: 'licensing',
    title: 'Licensing',
    'dashboard-type': 'transaction'
  }
];

var departments = [],
    agencies = [];

function readModule(file) {
  var defer = Q.defer();
  fs.readFile(file, 'utf8', function (err, dashboardData) {
    if (err) {
      if (err.code === 'EISDIR') {
        defer.resolve();
        return;
      } else {
        defer.reject(err);
        throw err;
      }
    }

    dashboardData = JSON.parse(dashboardData);
    if (dashboardData['page-type'] === 'dashboard' && dashboardData['published']) {
      dashboards.push(_.pick(dashboardData, 'slug', 'title', 'department', 'agency', 'dashboard-type', 'on-homepage'));

      departments.push(_.pick(dashboardData, 'department').department);
      agencies.push(_.pick(dashboardData, 'agency').agency);
    }
    defer.resolve();

  });

  return defer.promise;
}

glob(stagecraftStubGlob, function (err, files) {
  if (err) {
    throw err;
  }
  Q.all(_.map(files, function (file) {
    return readModule(file);
  })).then(function () {
    console.log('Writing ' + dashboards.length + ' dashboards into dashboards.json');
    fs.writeFileSync(stagecraftStubDir + '/dashboards.json', JSON.stringify({ items: dashboards }, null, 2) + '\n');
  });

});

