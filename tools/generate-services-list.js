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

function readModule(file) {
  var dashboardData = fs.readFileSync(file, 'utf8');

  dashboardData = JSON.parse(dashboardData);
  if (dashboardData['page-type'] === 'dashboard' && dashboardData['published']) {
    dashboards.push(_.pick(dashboardData, 'slug', 'title', 'department', 'agency', 'dashboard-type', 'on-homepage'));
  }

  return dashboardData;
}

var defer = Q.defer();

glob(stagecraftStubGlob, function (err, files) {
  if (err) {
    defer.reject(err);
    throw err;
  }
  _.each(files, function (file) {
    readModule(file);
  });
  console.log('Writing ' + dashboards.length + ' dashboards into dashboards.json');
  fs.writeFileSync(stagecraftStubDir + '/dashboards.json', JSON.stringify({ items: dashboards }, null, 2) + '\n');
  defer.resolve();
});

module.exports = defer.promise;