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
          'public/css/limelight.css': 'styles/index.scss'
        },
        options: {
          loadPath: [
            'govuk/toolkit/stylesheets',
            'govuk/static/vendor/assets/stylesheets',
            'govuk/static/app/assets/stylesheets'
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
    },
    copy: {
      debug: {
        files: [
          {
            expand: true,
            flatten: true,
            src: [
              'govuk/static/app/assets/images/search-button.png',
              'govuk/static/app/assets/images/gov.uk_logotype-2x.png'
            ],
            dest: 'public/css/',
            filter: 'isFile'
          },
          {
            expand: true,
            flatten: true,
            src: [
              'govuk/static/app/assets/images/favicon.ico'
            ],
            dest: 'public/',
            filter: 'isFile'
          }
        ]
      }
    }
  });
  
  [
    'grunt-contrib-jasmine',
    'grunt-contrib-jshint',
    'grunt-contrib-clean',
    'grunt-contrib-copy',
    'grunt-contrib-sass',
    'grunt-contrib-requirejs'
  ].forEach(function (task) {
    grunt.loadNpmTasks(task);
  });
  
  // Default task.
  grunt.registerTask('build', ['clean', 'jshint', 'jasmine', 'sass', 'copy:debug']);
  grunt.registerTask('default', ['build']);

};

