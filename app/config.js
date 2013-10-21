define(function (options) {
  
  var config = {
    paths: {
      css: 'vendor/require-css',
      modernizr: 'shim/modernizr_shim',
      moment: 'vendor/moment',
      tpl: 'vendor/tpl',
      Mustache: 'vendor/mustache',
      text: 'vendor/text',
      stache: 'vendor/stache'
    }
  };
  
  if (typeof window === 'object' || options && options.isBuild) {
    // additional setup for client
    config.paths.jquery = 'vendor/jquery';
    config.paths.underscore = 'vendor/lodash';
    config.paths.backbone = 'vendor/backbone';
    config.paths.d3 = 'vendor/d3.v3';
    config.paths.modernizr = 'vendor/modernizr';

    config.shim = {
      backbone: {
        deps: ['underscore', 'jquery'],
        exports: 'Backbone'
      },
      jqueryxdr: {
        deps: ['jquery'],
        exports: '$'
      },
      d3: {
        exports: 'd3'
      },
      modernizr: {
        exports: 'Modernizr'
      },
      moment: {
        exports: 'Moment'
      }
    };
  }
  
  return config;
});
