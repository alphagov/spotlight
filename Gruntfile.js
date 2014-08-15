var _ = require('lodash');

var getRequirejsConfig = function () {
  var requirejsConfig;
  global.define = function (config) {
    requirejsConfig = config({ isBuild: true });
  };
  require('./app/config');

  return _.extend(requirejsConfig, {
    baseUrl: 'app',
    name: 'client',
    waitSeconds: 60,
    include: ['vendor/almond'],
    deps: [
      'client',
      'client/client_bootstrap'
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
            'node_modules/govuk_frontend_toolkit/govuk_frontend_toolkit/stylesheets'
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
            'node_modules/govuk_frontend_toolkit/govuk_frontend_toolkit/stylesheets'
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
            'spec/shared/**/spec.*.js',
            'spec/client/**/spec.*.js'
          ],
          template: 'spec/index.html',
          keepRunner: true
        }
      }
    },
    // Sets up server-side Jasmine node tests
    jasmine_node: {
      legacy: {
        verbose: false,
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
        verbose: false,
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
      },
    },
    // Sets up server-side Jasmine node tests
    // Lints our JavaScript
    jshint: {
      files: ['app/**/*.js', 'app/**/*.json', 'spec/**/*.js', 'tools/**/*.js'],
      options: {
        reporter: require('jshint-stylish'),
        jshintrc: true
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
    // Copies templates and assets from external modules and dirs
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
      // Runs cheapseats tests
      cheapseats: {
        options: {
          failOnError: true,
          stderr: true,
          stdout: true
        },
        command: addArgs('node ./node_modules/cheapseats/index.js --reporter dot-retry --standalone --path ./')
      },
      // Generates the page-per-thing module JSON stubs
      generate_services_list: {
        options: {
          failOnError: true,
          stderr: true,
          stdout: true
        },
        command: 'node tools/generate-services-list.js'
      },
      // Generates the page-per-thing module JSON stubs
      validate_module_stubs: {
        options: {
          failOnError: true,
          stderr: true,
          stdout: true
        },
        command: addArgs('node tools/validate-stubs.js')
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
    'copy:assets',
    'shell:validate_module_stubs',
    'shell:generate_services_list'
  ]);

  grunt.registerTask('build:development', [
    'build:common',
    'sass:development',
    'digest'
  ]);

  grunt.registerTask('build:production', [
    'build:common',
    'sass:production',
    'requirejs:production',
    'requirejs:production-no-d3',
    'digest'
  ]);

  grunt.registerTask('test:stubs', [
    'shell:validate_module_stubs'
  ]);

  grunt.registerTask('test:stubs:unpublished', [
    'shell:validate_module_stubs:--unpublished'
  ]);

  grunt.registerTask('test:unit', [
    'copy:vendor',
    'copy:govuk_template',
    'clean',
    'copy:assets',
    'shell:validate_module_stubs',
    'shell:generate_services_list',
    'sass:development',
    'digest',
    'jasmine',
    'jasmine_node',
    'jshint'
  ]);

  grunt.registerTask('test:all', [
    'test:unit',
    'shell:cheapseats'
  ]);

  grunt.registerTask('cheapseats', [
    'shell:cheapseats'
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
