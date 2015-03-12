define(function (options) {

  var config = {
    paths: {
      css: 'vendor/require-css',
      modernizr: 'shim/modernizr_shim',
      tpl: 'vendor/tpl',
      Mustache: 'vendor/mustache',
      text: 'vendor/text',
      stache: 'vendor/stache',
      json: 'vendor/requirejs-plugins/json'
    }
  };

  if (typeof window === 'object' || options && options.isBuild) {
    // additional setup for client
    config.paths.jquery = 'vendor/jquery';
    config.paths.jqueryxdr = 'vendor/jquery.xdr';
    config.paths.jquerydeparam = 'vendor/jquery-deparam';
    config.paths.lodash = 'vendor/lodash';
    config.paths.backbone = 'vendor/backbone';
    config.paths.d3 = 'vendor/d3';
    config.paths.modernizr = 'vendor/modernizr';
    config.paths.moment = 'vendor/moment';
    config.paths['moment-timezone'] = 'vendor/moment-timezone';
    config.paths.text = 'vendor/text';
    config.paths.json = 'vendor/requirejs-plugins/json';

    config.shim = {
      backbone: {
        deps: ['lodash', 'jqueryxdr'],
        exports: 'Backbone'
      },
      jqueryxdr: {
        deps: ['jquery'],
        exports: '$'
      },
      jquerydeparam: {
        deps: ['jquery'],
        exports: '$'
      },
      d3: {
        exports: 'd3'
      },
      modernizr: {
        exports: 'Modernizr'
      }
    };
  }

  return config;
});
