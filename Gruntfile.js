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
      development: {
        files: {
          'public/spotlight.css': 'styles/index.scss'
        },
        options: {
          loadPath: [
            'lib/govuk_frontend_toolkit/stylesheets'
          ],
          style: 'nested'
        }
      },
      production: {
        files: [
          { 'public/spotlight.css': 'styles/index.scss' },
          {
            expand: true,
            cwd: 'govuk_template/assets/stylesheets',
            src: ['*.css'],
            dest: 'public',
            ext: '.css'
          }
        ],
        options: {
          loadPath: [
            'lib/govuk_frontend_toolkit/stylesheets'
          ],
          style: 'compressed'
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
      production: {
        options: extend(getRequirejsConfig(), {
          baseUrl: 'app',
          out: "public/spotlight.js",
          name: "client",
          include: ["vendor/almond"],
          deps: [
            'client'
          ],
          wrap: false
        })
      }
    },
    copy: {
      govuk_template: {
        src: 'govuk_template/views/layouts/govuk_template.html',
        dest: 'app/common/templates/',
        expand: true,
        flatten: true,
        filter: 'isFile'
      },
      govuk_assets: {
        files: [
          {
            expand: true,
            cwd: 'govuk_template/assets/',
            src: '**',
            dest: 'public/',
            flatten: true,
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
    'grunt-contrib-sass',
    'grunt-contrib-requirejs',
    'grunt-contrib-copy'
  ].forEach(function (task) {
    grunt.loadNpmTasks(task);
  });
  
  // Default task.
  grunt.registerTask('build:development', [
    'copy:govuk_template', 'jshint', 'clean', 'copy:govuk_assets', 'sass:development'
  ]);
  grunt.registerTask('build:production', [
    'copy:govuk_template', 'jshint', 'jasmine', 'clean', 'copy:govuk_assets', 'sass:production', 'requirejs'
  ]);
  grunt.registerTask('default', ['build:development']);

};

