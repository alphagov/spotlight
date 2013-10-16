define(function (options) {
  
  var config = {
    paths: {
      lodash: 'vendor/lodash',
      backbone: 'vendor/backbone',
      css: 'vendor/require-css',
      modernizr: 'modernizr_shim',
      moment: 'vendor/moment',
      tpl: 'vendor/tpl',
      Mustache: 'vendor/mustache',
      text: 'vendor/text',
      stache: 'vendor/stache'
    },
    
    shim: {
      backbone: {
        deps: ['lodash', 'jquery'],
        exports: 'Backbone'
      },
      modernizr: {
        exports: 'Modernizr'
      },
      moment: {
        exports: 'Moment'
      }
    }
  };
  
  if (typeof window === 'object' || options && options.isBuild) {
    // additional setup for client
    config.paths.jquery = 'vendor/jquery';
    config.paths.jqueryxdr = 'vendor/jquery.xdr';
    config.paths.jquerymousewheel = 'vendor/jquery.mousewheel';
    config.paths.d3 = 'vendor/d3.v3';
    config.paths.modernizr = 'vendor/modernizr';

    config.shim.backbone.deps.concat(['jqueryxdr', 'jquerymousewheel']);
    config.shim.jqueryxdr = {
      deps: ['jquery'],
      exports: '$'
    };
    config.shim.d3 = {
      exports: 'd3'
    };
  }
  
  return config;
});
