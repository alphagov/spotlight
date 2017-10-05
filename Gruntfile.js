var _ = require('lodash');

var getRequirejsConfig = function () {
  var requirejsConfig;
  // Define a temporary function so that we can 'read' in the application settings.
  // The settings file assumes the existence of a function called 'define'.
  global.define = function (config) {
    requirejsConfig = config({ isBuild: true });
  };
  // Read the settings
  require('./app/config');
  // Remove the function
  delete global.define;

  return _.extend(requirejsConfig, {
    baseUrl: 'app',
    name: 'client',
    waitSeconds: 60,
    include: ['vendor/almond'],
    deps: [
      'client',
      'client/client_bootstrap',
      'client/logger'
    ],
    wrap: true,
    optimize: 'uglify'
  });
};

var addArgs = function (cmd) {
  return function () {
    return [cmd].concat([].slice.apply(arguments)).join(' ');
  };
};

var requirejsConfig = getRequirejsConfig();


module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    // Removes the contents of the public directory
    clean: ['public/'],
    // Builds Sass in development and production
    sass: {
      development: {
        files: {
          'public/stylesheets/spotlight.css': 'styles/index.scss'
        },
        options: {
          includePaths: [
            'node_modules/govuk_frontend_toolkit/stylesheets'
          ],
          style: 'nested',
          sourceComments: 'map'
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
          includePaths: [
            'node_modules/govuk_frontend_toolkit/stylesheets'
          ],
          outputStyle: 'compressed'
        }
      }
    },
    // Sets up Jasmine tests
    jasmine: {
      spotlight: {
        src: ['app/**/*.js'],
        options: {
          helpers: ['spec/helpers/*.js'],
          specs: [
            'spec/client/spec.accessibility.js',
            'spec/client/spec.client_bootstrap.js',
            'spec/client/common/modules/*.js',
            'spec/client/common/views/spec.date-picker.js',
            // 'spec/client/common/views/spec.services.js', js-deparam
            'spec/client/common/views/visualisations/**/*.js',
            'spec/client/controllers/*.js',
            'spec/client/extensions/**/*.js',
            '!spec/client/preprocessors/spec.visualisation_fallback.js', // fallback images (expect async)
            'spec/client/views/*.js',
            '!spec/client/views/spec.services.js', // js-deparam
            '!spec/client/views/spec.table.js' // js-deparam
          ],
          template: 'spec/index.html',
          keepRunner: true,
          vendor: [
            'app/vendor/jquery.js',
            // 'app/vendor/jquery-deparam.js',
            'app/vendor/require.js'
          ]
        }
      }
    },
    // Sets up server-side Jasmine node tests
    jasmine_node: {
      legacy: {
        src: './spec/helpers',
        options: {
          specFolders: [
            './spec/shared',
            './spec/server'
          ],
          useHelpers: true,
          specNameMatcher: 'spec.*', // load only specs containing specNameMatcher
          match: '.*',
          useRequireJs: 'spec/requirejs-setup.js',
          verbose: false,
          jUnit: {
            report: false,
            savePath : './build/reports/jasmine/',
            useDotNotation: true,
            consolidate: true
          }
        }
      },
      server: {
        src: './spec/server-pure',
        options: {
          specFolders: [
            './spec/server-pure'
          ],
          useHelpers: true,
          specNameMatcher: 'spec.*', // load only specs containing specNameMatcher
          match: '.*',
          verbose: false,
          jUnit: {
            report: false,
            savePath : './build/reports/jasmine/',
            useDotNotation: true,
            consolidate: true
          }
        }
      }
    },
    // Sets up server-side Jasmine node tests
    // Lints our JavaScript
    jshint: {
      browser: {
        src: ['app/client/**/*.js', 'spec/client/**/*.js'],
        options: {
          reporter: require('jshint-stylish'),
          reporterOutput: "",
          jshintrc: true,
          config: './node_modules/performanceplatform-js-style-configs/.jshintrc-browser.json'
        }
      },
      node: {
        src: ['app/**/*.js', 'app/**/*.json', 'spec/**/*.js',
          '!app/client/**/*.js', '!spec/client/**/*.js'],
        options: {
          reporter: require('jshint-stylish'),
          reporterOutput: "",
          jshintrc: true,
          config: './node_modules/performanceplatform-js-style-configs/.jshintrc-node.json'
        }
      }
    },
    // Creates a single big JS file
    requirejs: {
      production: {
        options: _.extend({}, requirejsConfig, {
          out: 'public/javascripts/spotlight.js',
          d3: true
        })
      },
      'production-no-d3': {
        options: _.extend({}, requirejsConfig, {
          out: 'public/javascripts/spotlight-no-d3.js',
          d3: false
        })
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [
          'node_modules/govuk_frontend_toolkit/javascripts/govuk/analytics/google-analytics-universal-tracker.js',
          'node_modules/govuk_frontend_toolkit/javascripts/govuk/analytics/analytics.js',
          'node_modules/govuk_frontend_toolkit/javascripts/govuk/analytics/download-link-tracker.js',
          'app/client/analytics.js'
        ],
        dest: 'public/javascripts/analytics.js'
      }
    },
    // Copies templates and assets from external modules and dirs
    copy: {
      govuk_template: {
        src: 'node_modules/govuk_template_mustache/views/layouts/govuk_template.html',
        dest: 'app/server/templates/page-components/',
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
          },
          {
            src: 'node_modules/lodash/dist/lodash.js',
            dest: 'app/vendor/',
            flatten: true,
            expand: true
          }
        ]
      }
    },
    // Watches styles and specs for changes
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
      // Runs subset of cheapseats tests
      cheapseats: {
        options: {
          failOnError: true,
          stderr: true,
          stdout: true
        },
        command: addArgs('node ./node_modules/cheapseats/index.js --reporter spec-retry --standalone --path --quickrun ./')
      },
      // Runs all cheapseats tests
      cheapseats_full_run: {
        options: {
          failOnError: true,
          stderr: true,
          stdout: true
        },
        command: addArgs('node ./node_modules/cheapseats/index.js --reporter spec-retry --standalone --path ./')
      },
      nightwatch: {
        command: addArgs('./node_modules/nightwatch/bin/nightwatch')
      },
      // Supervises the node process in development
      supervisor: {
        options: {
          stdout: true,
          stderr: true,
          execOptions: {
            maxBuffer: Infinity
          }
        },
        command: './node_modules/supervisor/lib/cli-wrapper.js -w app -i app/vendor -e "js|html" -n error app/server'
      },
      functional_spotlight: {
        command: 'node ./tests/tools/server_and_test.js'
      }
    },
    // Runs development tasks concurrently
    concurrent: {
      dev: {
        tasks: ['shell:supervisor', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    // Creates an asset digest for cachebusting URLs
    digest: {
      options: {
        out: 'public/asset-digest.json',
        separator: '-',
        algorithm: 'md5'
      },
      files: {
        src: ['public/**/*.*']
      }
    }
  });

  // Load external module tasks
  [
    'grunt-contrib-jasmine',
    'grunt-jasmine-node-new',
    'grunt-contrib-jshint',
    'grunt-contrib-clean',
    'grunt-contrib-requirejs',
    'grunt-contrib-concat',
    'grunt-digest',
    'grunt-sass',
    'grunt-contrib-copy',
    'grunt-contrib-watch',
    'grunt-shell',
    'grunt-concurrent'
  ].forEach(function (task) {
    grunt.loadNpmTasks(task);
  });

  grunt.registerTask('copy:assets', [
    'copy:govuk_assets',
    'copy:spotlight_assets'
  ]);

  grunt.registerTask('build:common', [
    'copy:vendor',
    'copy:govuk_template',
    'clean',
    'copy:assets'
  ]);

  grunt.registerTask('build:development', [
    'build:common',
    'concat',
    'sass:development',
    'digest'
  ]);

  grunt.registerTask('build:production', [
    'build:common',
    'sass:production',
    'requirejs:production',
    'requirejs:production-no-d3',
    'concat',
    'digest'
  ]);

  grunt.registerTask('test:unit', [
    'copy:vendor',
    'copy:govuk_template',
    'clean',
    'copy:assets',
    'sass:development',
    'digest',
    'jasmine_node',
    'jshint'
  ]);

  grunt.registerTask('test:all', [
    'test:unit',
    'shell:cheapseats',
    'test:functional'
  ]);

  grunt.registerTask('cheapseats', [
    'shell:cheapseats'
  ]);

  grunt.registerTask('nightwatch', [
    'shell:nightwatch'
  ]);

  grunt.registerTask('test:functional:ci', [
    'shell:functional_spotlight'
  ]);

  grunt.registerTask('test:functional', [
    'shell:nightwatch:-e phantomjs'
  ]);

  grunt.registerTask('test:functional:ff', [
    'shell:nightwatch'
  ]);

  grunt.registerTask('test:functional:chrome', [
    'shell:nightwatch:-e chrome'
  ]);

  grunt.registerTask('test:functional:all', [
    'shell:nightwatch:-e default,chrome,phantomjs'
  ]);

  grunt.registerTask('cheapseats:unpublished', [
    'shell:cheapseats:--unpublished'
  ]);

  // Default task
  grunt.registerTask('default', [
    'build:development',
    'jasmine:spotlight:build',
    'concurrent'
  ]);

  grunt.registerTask('heroku:development', [
    'build:development'
  ]);

};
