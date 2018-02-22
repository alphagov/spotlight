/*jshint maxstatements: false */

var express = require('express');
var fs = require('fs');
var path = require('path');
var winston = require('winston');
var requirejs = require('requirejs');
var basicAuth = require('node-basicauth');
var rateLimit = require('express-rate-limit');

// Express middleware modules which have been separated out now
var compression = require('compression');
var errorHandler = require('errorhandler');
var error = require('./error');

module.exports = {
  getApp: function (environment, rootDir, requireBaseUrl) {
    var app = express(),
        transactionVolumesCSV = fs.readFileSync(
            path.join(rootDir, 'assets', 'data', 'transaction-volumes.csv'));

    app.disable('x-powered-by');


    (function () {
      // The number of milliseconds in one day
      var oneDay = 86400000;
      var scrapers = /^Pcore-HTTP.*|.*360Spider.*/i;

      app.set('environment', environment);
      app.set('requirePath', requireBaseUrl || '/app/');
      app.set('assetPath', global.config.assetPath);
      app.set('assetDigest', JSON.parse(fs.readFileSync(path.join(rootDir, 'republic', 'asset-digest.json'), {encoding: 'utf8'})));
      app.set('backdropUrl', global.config.backdropUrl);
      app.set('externalBackdropUrl', global.config.externalBackdropUrl);
      app.set('clientRequiresCors', global.config.clientRequiresCors);
      app.set('port', global.config.port);
      app.set('stagecraftUrl', global.config.stagecraftUrl);
      app.use(compression());

      var limiter = new rateLimit({
        // Returning false will increment the counter
        skip: function(req, res) {
          // Ignore 'assets' URLs
          if (req.originalUrl.indexOf('assets') !== -1) {
            return true;
          }

          // Rate-limit all requests from clients where the user-agent matches our scraper regex above.
          var source = req.headers['user-agent'] || "";
          return !source.match(scrapers);
        },
        windowMs: 60 * 1000, // 1 minute
        max: 60, // limit each IP to 60 requests per minute if skip: returns false
        delayMs: 0, // disable delaying
        skipFailedRequests: true, //  when true failed requests (response status >= 400) won't be counted
        message: "Too many requests from this IP. Please get in touch if you require the raw data.",
      });

      //  apply limiter to all /performance requests
      app.use('/performance', limiter);

      // Serve static files from the configured assetPath.
      app.use(global.config.assetPath, express.static(path.join(rootDir, 'republic'), { maxAge: oneDay }));
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
