define(function (options) {
  
  var config = {
    paths: {
      css: 'vendor/require-css',
      modernizr: 'shim/modernizr_shim',
      tpl: 'vendor/tpl',
      Mustache: 'vendor/mustache',
      text: 'vendor/text',
      stache: 'vendor/stache'
    }
  };
  
  if (typeof window === 'object' || options && options.isBuild) {
    // additional setup for client
    config.paths.jquery = 'vendor/jquery';
    config.paths.jqueryxdr = 'vendor/jquery.xdr';
    config.paths.jquerydetails = 'vendor/jquery.details';
    config.paths.underscore = 'vendor/lodash';
    config.paths.backbone = 'vendor/backbone';
    config.paths.d3 = 'vendor/d3';
    config.paths.modernizr = 'vendor/modernizr';
    config.paths.moment = 'vendor/moment';
    config.paths['moment-timezone'] = 'vendor/moment-timezone';

    config.shim = {
      backbone: {
        deps: ['underscore', 'jqueryxdr', 'jquerydetails'],
        exports: 'Backbone'
      },
      jqueryxdr: {
        deps: ['jquery'],
        exports: '$'
      },
      jquerydetails: {
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
