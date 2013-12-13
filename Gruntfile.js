var extend = require("xtend");

var getRequirejsConfig = function () {
  var requirejsConfig;
  global.define = function (config) {
    requirejsConfig = config({ isBuild: true });
  };
  require('./app/config');

  return extend(requirejsConfig, {
    baseUrl: 'app',
    name: "client",
    include: ["vendor/almond"],
    deps: [
      'client',
      'client/client_bootstrap'
    ],
    wrap: true,
    optimize: 'uglify'
  });
};

var requirejsConfig = getRequirejsConfig();


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
          helpers: ['spec/helpers/*.js'],
          specs: [
            'spec/shared/**/spec.*.js',
            'spec/client/**/spec.*.js'
          ],
          template: 'spec/index.html',
          keepRunner: true
        }
      }
    },
    jasmine_node: {
      useHelpers: true,
      specFolders: [
        "./spec/shared",
        "./spec/server"
      ],
      projectRoot: "./spec/",
      options: {
        specNameMatcher: "spec\..*", // load only specs containing specNameMatcher
        match: ".*",
        useRequireJs: "spec/requirejs-setup.js",
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
        eqnull: true,
        es3: true,
        es5: false
      }
    },
    requirejs: {
      production: {
        options: extend({}, requirejsConfig, {
          out: "public/javascripts/spotlight.js",
          d3: true
        })
      },
      'production-no-d3': {
        options: extend({}, requirejsConfig, {
          out: "public/javascripts/spotlight-no-d3.js",
          d3: false
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
      spotlight_assets: {
        files: [
          {
            expand: true,
            src: '**',
            cwd: 'assets',
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
          },
          {
            src: 'node_modules/moment-timezone/moment-timezone.js',
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
        files: ['spec/**/spec.*.js'],
        tasks: ['jasmine:spotlight:build']
      }
    },
    shell: {
      supervisor: {
        options: {
          stdout: true,
          stderr: true
        },
        command: 'supervisor -w app -i app/vendor -e "js|html" -n error app/server'
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
        tasks: ['shell:supervisor', 'watch'],
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
    'grunt-shell',
    'grunt-concurrent'
  ].forEach(function (task) {
    grunt.loadNpmTasks(task);
  });

  grunt.registerTask('copy:assets', [
    'copy:govuk_assets', 'copy:spotlight_assets'
  ]);
  grunt.registerTask('build:development', [
    'copy:vendor', 'copy:govuk_template', 'jshint', 'clean', 'copy:assets', 'sass:development'
  ]);
  grunt.registerTask('build:production', [
    'copy:vendor', 'copy:govuk_template', 'jshint', 'clean', 'copy:assets', 'sass:production', 'requirejs:production', 'requirejs:production-no-d3'
  ]);
  grunt.registerTask('test:all', ['copy:vendor', 'jshint', 'cucumber', 'jasmine', 'jasmine_node']);
  // Default task.
  grunt.registerTask('default', ['build:development', 'jasmine:spotlight:build', 'concurrent']);

};

