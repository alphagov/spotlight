/*jshint maxstatements: false */

var express = require('express');
var fs = require('fs');
var path = require('path');
var winston = require('winston');
var requirejs = require('requirejs');
var basicAuth = require('node-basicauth');

// Express middleware modules which have been separated out now
var compression = require('compression');
var errorHandler = require('errorhandler');
var error = require('./error');
var morgan  = require('morgan');

module.exports = {
  getApp: function (environment, rootDir, requireBaseUrl) {
    var app = express(),
        transactionVolumesCSV = fs.readFileSync(
            path.join(rootDir, 'assets', 'data', 'transaction-volumes.csv'));

    app.disable('x-powered-by');

    (function () {
      // The number of milliseconds in one day
      var oneDay = 86400000;

      app.use(require('./stats'));
      app.set('environment', environment);
      app.set('requirePath', requireBaseUrl || '/app/');
      app.set('assetPath', global.config.assetPath);
      app.set('assetDigest', JSON.parse(fs.readFileSync(path.join(rootDir, 'public', 'asset-digest.json'), {encoding: 'utf8'})));
      app.set('backdropUrl', global.config.backdropUrl);
      app.set('externalBackdropUrl', global.config.externalBackdropUrl);
      app.set('clientRequiresCors', global.config.clientRequiresCors);
      app.set('port', global.config.port);
      app.set('stagecraftUrl', global.config.stagecraftUrl);
      app.set('bigScreenBaseURL', global.config.bigScreenBaseURL);
      app.use(morgan('dev'));
      app.use(compression());
      app.use('/spotlight', express.static(path.join(rootDir, 'public'), { maxAge: oneDay }));
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
      app.use('/app', express.static(path.join(rootDir, 'app')));
      app.use('/.grunt', express.static(path.join(rootDir, '.grunt')));
      app.use('/spec', express.static(path.join(rootDir, 'spec')));
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
        filename: 'log/production.json.log',
        level: 'info',
        colorize: false,
        json: true,
        logstash: true
      });
      global.logger.remove(winston.transports.Console);
      app.set('etag', 'strong');
    }

    // If environment variables are set for basic authentication, protect
    // everything under /performance. We don't want to protect things like
    // /stagecraft-stub.
    if (process.env.BASIC_AUTH_USER && process.env.BASIC_AUTH_PASS) {
      var auth = {};
      auth[process.env.BASIC_AUTH_USER] = process.env.BASIC_AUTH_PASS;
      app.get('/performance*', basicAuth(auth));
    }

    app.get('/', function (req, res) {
      res.redirect(301, '/performance');
    });

    app.get('/robots.txt', function (req, res) {
      res.set('Content-Type', 'text/plain');
      res.send('User-agent: *\nDisallow: /');
    });

    app.get('/_status', require('./healthcheck_controller'));

    app.get('*.png', function (req, res) {
      error.render(410, req, res);
    });

    app.get('/performance', _.bind(require('./server/controllers/services'), this, 'home'));

    app.get('/performance/about', require('./server/controllers/about'));

    app.get('/performance/services', _.bind(require('./server/controllers/services'), this, 'services'));

    app.get('/performance/web-traffic', _.bind(require('./server/controllers/simple-dashboard-list'), this, 'web-traffic'));

    app.get('/performance/other', _.bind(require('./server/controllers/simple-dashboard-list'), this, 'other'));

    app.get('/performance/prototypes', require('./server/controllers/prototypes'));

    app.get('/performance/data/transaction-volumes.csv', function (req, res) {
      res.set('Content-Type', 'text/csv; charset=utf-8');
      res.set('Content-Disposition', 'attachment;filename=transaction-volumes.csv');
      res.send(transactionVolumesCSV);
      res.end();
    });

    app.get('/performance/*', require('./process_request'));

    return app;
  }
};
