var extend = require("xtend");

var getRequirejsConfig = function () {
  var requirejsConfig;
  global.define = function (config) {
    requirejsConfig = config({ isBuild: true });
  };
  require('./app/config');
  return requirejsConfig;
};

module.exports = function(grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({
    clean: ["public/"],
    sass: {
      dist: {
        files: {
          'public/css/spotlight.css': 'styles/index.scss'
        },
        options: {
          loadPath: [
            'lib/govuk_frontend_toolkit/stylesheets'
          ],
          style: 'nested'
        }
      }
    },
    jasmine: {
      limelight: {
        src: 'app/**/*.js',
        options: {
          specs: 'test/spec/**/spec.*.js',
          helpers: 'test/spec/helpers/*.js',
          template: 'test/spec/index.html',
          keepRunner: true
        }
      }
    },
    jshint: {
      files: "app/**/*.js",
      options: {
        ignores: ['app/vendor/**'],
        eqnull: true
      }
    },
    requirejs: {
      debug: {
        options: extend(getRequirejsConfig(), {
          baseUrl: 'app',
          out: "dist/limelight.js",
          name: "client",
          include: ["vendor/almond"],
          deps: [
            'bootstrap',
            'routes'
          ],
          wrap: false
        })
      }
    }
  });
  
  [
    'grunt-contrib-jasmine',
    'grunt-contrib-jshint',
    'grunt-contrib-clean',
    'grunt-contrib-sass',
    'grunt-contrib-requirejs'
  ].forEach(function (task) {
    grunt.loadNpmTasks(task);
  });
  
  // Default task.
  grunt.registerTask('build', ['clean', 'jshint', 'jasmine', 'sass']);
  grunt.registerTask('default', ['build']);

};

