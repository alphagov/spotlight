var cp = require('child_process'),
    Q = require('q');

var serverProcess,
    exitcode = 1;

function driver() {
  return childProcess('./tests/tools/phantomjs', ['--webdriver', '4444', '--ssl-protocol', 'tlsv1'], 'running on port 4444', true);
}

function nightwatch() {
  return childProcess('nightwatch', []);
}

function grunt() {
  return childProcess('grunt', ['build:development']);
}

function childProcess(bin, args, search, mute) {
  mute = mute || false;
  var promise = Q.defer();
  var child = cp.spawn(bin, args, {
    cwd: './'
  });
  child.stdout.on('data', function (data) {
    if (!mute) {
      process.stdout.write(data);
    }

    if (search) {
      if (data.toString().match(search)) {
        promise.resolve();
      }
    }
  });
  child.stderr.on('data', function (data) {
    if (!mute) {
      process.stdout.write(data);
    }
  });
  child.on('exit', function (err) {
    process.stdout.write('\n');
    if (err) {
      promise.reject(err);
    }
    else {
      promise.resolve();
    }
  });
  return promise.promise;
}

function server() {
  var promise = Q.defer();
  var args = [];
  serverProcess = cp.fork('app/server.js', args, {
    cwd: './',
    silent: true
  });
  serverProcess.listening = false;
  serverProcess.stdout.on('data', function (data) {
    if (!serverProcess.listening) { process.stdout.write(data); }
    var match = data.toString().match(/Express server listening on port ([0-9]+)/);
    if (match) {
      serverProcess.listening = true;
      console.log('\nTest server started at http://localhost:' + match[1]);
      // config.baseUrl = 'http://localhost:' + match[1] + '/performance/';
      promise.resolve();
    }
  });
  serverProcess.stderr.on('data', function (data) {
    process.stderr.write(data);
  });
  setTimeout(function () {
    if (!serverProcess.listening) {
      console.log('Test server timed out. Exiting...');
      promise.reject();
    }
  }, 10000);
  return promise.promise;
}

function kill() {
  if (serverProcess) {
    console.log('Tearing down standalone server');
    serverProcess.kill();
  }
}


grunt()
  .then(driver)
  .then(server)
  .then(nightwatch)
  .then(function () {
    exitcode = 0;
  }, function () {
    exitcode = 1;
  })
  .then(kill)
  .fin(function () {
    process.exit(exitcode);
  });
