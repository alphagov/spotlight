define([
  'express',
  'path',
  'winston'
],
function (express, path, winston) {

  var appBuilder = {
    getApp: function (environment, rootDir, require_base_url) {
      app = express();
      app.disable('x-powered-by');

      app.configure(function () {
        app.set('environment', environment);
        app.set('requirePath', require_base_url || '/app/');
        app.set('assetPath', global.config.assetPath);
        app.set('backdropUrl', global.config.backdropUrl);
        app.set('govukHost', global.config.govukHost);
        app.set('clientRequiresCors', global.config.clientRequiresCors);
        app.set('port', global.config.port);
        app.use(express.logger('dev'));
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.compress());
        app.use('/assets', express['static'](path.join(rootDir, 'public')));
        app.use('/assets/images', express['static'](path.join(rootDir, 'public')));

        if (environment === 'development') {
          global.logger.debug('Winston is logging in development');
          app.use(express.errorHandler());
          app.use('/app', express['static'](path.join(rootDir, 'app')));
          app.get('/backdrop-stub/:service/:api_name', requirejs('./support/backdrop_stub/backdrop_stub_controller'));
          app.use('/.grunt', express['static'](path.join(rootDir, '.grunt')));
          app.use('/spec', express['static'](path.join(rootDir, 'spec')));
          app.use('/tests', function (req, res) {
            res.sendfile(path.join(rootDir, '_SpecRunner.html'));
          });
        } else {
          global.logger.add(winston.transports.File, {
            filename: 'log/spotlight.log.json',
            level: 'info',
            colorize: false,
            json: true
          });
          global.logger.remove(winston.transports.Console);
        }

      });

      app.get('/', function (req, res) {
        res.redirect(301, '/performance');
      });

      app.get('*.png', requirejs('./render_png'));

      app.get('/stagecraft-stub/*', requirejs('./support/stagecraft_stub/stagecraft_stub_controller'));

      app.use('/performance/', requirejs('process_request'));

      app.get('/_status', requirejs('healthcheck_controller'));

      return app;
    }
  };

  return appBuilder;
});
