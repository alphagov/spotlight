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
      spotlight: {
        src: ['app/**/*.js'],
        options: {
          helpers: ['test/spec/helpers/*.js'],
          specs: [
            'test/spec/shared/**/spec.*.js',
            'test/spec/client/**/spec.*.js'
          ],
          template: 'test/spec/index.html',
          keepRunner: true
        }
      }
    },
    jasmine_node: {
      useHelpers: true,
      specFolders: [
        "./test/spec/shared",
        "./test/spec/server"
      ],
      projectRoot: "./test/spec/",
      options: {
        specNameMatcher: "spec\..*", // load only specs containing specNameMatcher
        match: ".*",
        useRequireJs: "test/spec/requirejs-setup.js",
        forceExit: true,
        jUnit: {
          report: false,
          savePath : "./build/reports/jasmine/",
          useDotNotation: true,
          consolidate: true
        }
      }
    },
    cucumber: {
        test: {
            features: 'features/'
        },
        options: {
            prefix: 'bundle exec',
            format: 'progress',
            tags: ['~@wip']
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
            'client',
            'client/client_bootstrap'
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
      },
      vendor: {
        files: [
          {
            src: 'node_modules/backbone/backbone.js',
            dest: 'app/vendor/',
            flatten: true,
            expand: true
          },
          {
            src: 'node_modules/d3/d3.js',
            dest: 'app/vendor/',
            flatten: true,
            expand: true
          }
        ]
      }
    },
    watch: {
      css: {
        files: ['styles/**/*.scss'],
        tasks: ['sass:development'],
        options: { nospawn: true }
      },
      spec: {
        files: ['test/spec/**/spec.*.js'],
        tasks: ['jasmine:spotlight:build']
      }
    },
    nodemon: {
      dev: {
        options: {
          file: 'app/server.js',
          watchedExtensions: ['js'],
          watchedFolders: ['app', 'support'],
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
    'grunt-jasmine-node-coverage',
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
    'copy:vendor', 'copy:govuk_template', 'jshint', 'clean', 'copy:govuk_assets', 'sass:development'
  ]);
  grunt.registerTask('build:production', [
    'copy:vendor', 'copy:govuk_template', 'jshint', 'clean', 'copy:govuk_assets', 'sass:production', 'requirejs'
  ]);
  grunt.registerTask('test:all', ['copy:vendor', 'jasmine_node', 'jasmine', 'cucumber']);
  grunt.registerTask('default', ['build:development', 'jasmine:spotlight:build', 'concurrent']);

};

