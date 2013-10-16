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
          'public/stylesheets/spotlight.css': 'styles/index.scss'
        },
        options: {
          loadPath: [
            'node_modules/govuk_frontend_toolkit/govuk_frontend_toolkit/stylesheets'
          ],
          style: 'nested'
        }
      },
      production: {
        files: [
          { 'public/stylesheets/spotlight.css': 'styles/index.scss' },
          {
            expand: true,
            cwd: 'node_modules/govuk_template_mustache/assets/stylesheets',
            src: ['*.css'],
            dest: 'public/stylesheets',
            ext: '.css'
          }
        ],
        options: {
          loadPath: [
            'node_modules/govuk_frontend_toolkit/govuk_frontend_toolkit/stylesheets'
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
    cucumber: {
        test: {
            features: 'features/'
        },
        options: {
            prefix: 'bundle exec',
            format: 'progress'
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
          out: "public/javascripts/spotlight.js",
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
        src: 'node_modules/govuk_template_mustache/views/layouts/govuk_template.html',
        dest: 'app/common/templates/',
        expand: true,
        flatten: true,
        filter: 'isFile'
      },
      govuk_assets: {
        files: [
          {
            expand: true,
            src: '**',
            cwd: 'node_modules/govuk_template_mustache/assets',
            dest: 'public/'
          }
        ]
      }
    },
    watch: {
      css: {
        files: [
          'styles/**/*.scss'
        ],
        tasks: ['sass:development'],
        options: { nospawn: true }
      }
    },
    nodemon: {
      dev: {
        options: {
          file: 'app/server.js',
          watchedExtensions: ['js'],
          watchedFolders: ['app', 'support', 'test'],
          delayTime: 1,
          legacyWatch: true
        }
      }
    },
    concurrent: {
      dev: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    }
  });
  
  [
    'grunt-contrib-jasmine',
    'grunt-contrib-jshint',
    'grunt-contrib-clean',
    'grunt-contrib-sass',
    'grunt-contrib-requirejs',
    'grunt-rcukes',
    'grunt-contrib-copy',
    'grunt-contrib-watch',
    'grunt-nodemon',
    'grunt-concurrent'
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
  grunt.registerTask('default', ['build:development', 'concurrent']);

};

