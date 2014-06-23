var express = require('express');
var fs = require('fs');
var path = require('path');
var winston = require('winston');
var requirejs = require('requirejs');

// Express middleware modules which have been separated out now
var compression = require('compression');
var errorHandler = require('errorhandler');
var morgan  = require('morgan');

module.exports = {
  getApp: function (environment, rootDir, requireBaseUrl) {
    var app;
    app = express();
    app.disable('x-powered-by');

    (function () {
      app.set('environment', environment);
      app.set('requirePath', requireBaseUrl || '/app/');
      app.set('assetPath', global.config.assetPath);
      app.set('assetDigest', JSON.parse(fs.readFileSync(path.join(rootDir, 'public', 'asset-digest.json'), {encoding: 'utf8'})));
      app.set('backdropUrl', global.config.backdropUrl);
      app.set('govukHost', global.config.govukHost);
      app.set('clientRequiresCors', global.config.clientRequiresCors);
      app.set('port', global.config.port);
      app.use(morgan('dev'));
      app.use(compression());
      app.use('/spotlight', express['static'](path.join(rootDir, 'public')));
    }());

    if (environment === 'development') {
      global.logger.debug('Winston is logging in development');

      // In development, overwrite the asset digest so that each value is equal to the key,
      // because Sass will recompile itself to the non-cachebusted filename with each change.
      var assetDigest = app.get('assetDigest');
      _.each(assetDigest, function (value, key) {
        assetDigest[key] = key;
      });
      app.set('assetDigest', assetDigest);

      app.use(errorHandler());
      app.use('/app', express['static'](path.join(rootDir, 'app')));
      app.get('/backdrop-stub/:service/:api_name', requirejs('./support/backdrop_stub/backdrop_stub_controller'));
      app.use('/.grunt', express['static'](path.join(rootDir, '.grunt')));
      app.use('/spec', express['static'](path.join(rootDir, 'spec')));
      app.use('/tests', function (req, res) {
        res.sendfile(path.join(rootDir, '_SpecRunner.html'));
      });

      // We use Sass sourcemaps in development. When you click a Sass filename from in
      // your browser, it will attempt to GET the file from /styles
      app.use('/styles', function (req, res) {
        res.sendfile(path.join(rootDir, req.originalUrl));
      });
    } else {
      global.logger.add(winston.transports.File, {
        filename: 'log/spotlight.log.json',
        level: 'info',
        colorize: false,
        json: true
      });
      global.logger.remove(winston.transports.Console);
      app.set('etag', 'strong');
    }

    // If environment variables are set for basic authentication, protect
    // everything under /performance. We don't want to protect things like
    // /stagecraft-stub.
    if (process.env.BASIC_AUTH_USER && process.env.BASIC_AUTH_PASS) {
      app.get('/performance*', express.basicAuth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASS));
    }

    app.get('/', function (req, res) {
      res.redirect(301, '/performance');
    });

    app.get('/_status', require('./healthcheck_controller'));

    app.get('*.png', require('./render_png'));

    app.get('/stagecraft-stub/*', require('./support/stagecraft_stub/stagecraft_stub_controller'));

    app.get('/performance', require('./server/controllers/homepage'));

    app.get('/performance/about', require('./server/controllers/about'));

    app.get('/performance/services', require('./server/controllers/services'));

    app.get('/performance/prototypes', require('./server/controllers/prototypes'));

    app.get('/performance/*', require('./process_request'));

    return app;
  }
};
