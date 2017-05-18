// gulp examples
// https://github.com/alphagov/location-picker-prototype
// https://github.com/alphagov/digitalmarketplace-frontend-toolkit
// https://github.com/alphagov/check-eligibility-cost-time


var del = require('del');
var gulp = require('gulp');
var batch = require('gulp-batch');
var concat = require('gulp-concat');
var flatten = require('gulp-flatten');
var jasmine = require('gulp-jasmine');
var jasmine_node = require('gulp-jasmine-node');
var jshint = require('gulp-jshint');
var nodemon = require('gulp-nodemon');
var rename = require('gulp-rename');
var requirejs = require('gulp-requirejs');
var rev = require('gulp-rev');
var runsequence = require('run-sequence');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');

var config = {
  paths: {
    root: __dirname,
    public: __dirname + '/public',
    styles: __dirname + '/styles',
    scripts: __dirname + '/app',
    assets: __dirname + '/assets',
    vendors: __dirname + '/app/vendor'
  },
  sources: {
    vendors: [
      'node_modules/backbone/backbone.js',
      'node_modules/d3/d3.js',
      'node_modules/moment-timezone/moment-timezone.js',
      'node_modules/lodash/dist/lodash.js',
    ],
    templates: [
      'node_modules/govuk_template_mustache/views/layouts/govuk_template.html'
    ],
    assets: [
      'assets/**',
      'node_modules/govuk_template_mustache/assets/**'
    ],
    analytics: [
      'node_modules/govuk_frontend_toolkit/javascripts/govuk/analytics/google-analytics-universal-tracker.js',
      'node_modules/govuk_frontend_toolkit/javascripts/govuk/analytics/analytics.js',
      'node_modules/govuk_frontend_toolkit/javascripts/govuk/analytics/download-link-tracker.js',
      'app/client/analytics.js'
    ]
  }
};


// Clean directories

gulp.task('clean', function () {
  return del([config.paths.public + '/*']);
});

gulp.task('copy:vendors', function () {
  return gulp.src(config.sources.vendors).pipe(flatten()).pipe(gulp.dest(config.paths.vendors))
});
gulp.task('copy:templates', function () {
  return gulp.src(config.sources.templates).pipe(flatten()).pipe(gulp.dest('app/server/templates/page-components/'));
});
gulp.task('copy:assets', function () {
  return gulp.src(config.sources.assets).pipe(gulp.dest(config.paths.public));
});
gulp.task('copy:concat', function () {
  return gulp.src(config.sources.analytics).pipe(concat('analytics.js')).pipe(gulp.dest(config.paths.public + '/javascripts/'));
});
gulp.task('copy', function (done) {
  runsequence('copy:vendors', 'copy:templates', 'copy:assets', 'copy:concat', done)
});

gulp.task('sass:development', function () {
  return gulp.src(config.paths.styles + '/index.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded',
      includePaths: [
        'node_modules/govuk_frontend_toolkit/stylesheets',
      ]
    }).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(rename('spotlight.css'))
    .pipe(gulp.dest(config.paths.public + '/stylesheets/'))
});
gulp.task('sass:production', function () {
  return gulp.src(config.paths.styles + '/index.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: [
        'node_modules/govuk_frontend_toolkit/stylesheets',
      ]
    }).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(rename('spotlight.css'))
    .pipe(gulp.dest(config.paths.public + '/stylesheets/'))
});

gulp.task('require:production', function () {
  return gulp.src(config.paths.public).pipe(
    requirejs({
      baseUrl: 'app',
      name: 'client',
      out: 'spotlight.js',
      d3: true,
      waitSeconds: 60,
      paths: {
        css: 'vendor/require-css',
        modernizr: 'vendor/modernizr',
        tpl: 'vendor/tpl',
        Mustache: 'vendor/mustache',
        text: 'vendor/text',
        stache: 'vendor/stache',
        json: 'vendor/requirejs-plugins/json',
        jquery: 'vendor/jquery',
        jqueryxdr: 'vendor/jquery.xdr',
        jquerydeparam: 'vendor/jquery-deparam',
        lodash: 'vendor/lodash',
        backbone: 'vendor/backbone',
        d3: 'vendor/d3',
        moment: 'vendor/moment',
        'moment-timezone': 'vendor/moment-timezone'
      },
      include: [
        'vendor/almond'
      ],
      deps: [
        'client',
        'client/client_bootstrap',
        'client/logger',
      ],
      wrap: true,
      optimize: 'uglify',
      shim: {
        backbone: {
          deps: ['lodash', 'jqueryxdr'],
          exports: 'Backbone'
        },
        jqueryxdr: {
          deps: ['jquery'],
          exports: '$'
        },
        jquerydeparam: {
          deps: ['jquery'],
          exports: '$'
        },
        d3: {
          exports: 'd3'
        },
        modernizr: {
          exports: 'Modernizr'
        }
      }
    })).pipe(gulp.dest(config.paths.public + '/javascripts/'));
});

gulp.task('digest', function () {
  return gulp.src(config.paths.public + '/**/*.*')
    .pipe(rev())
    .pipe(gulp.dest(config.paths.public))
    .pipe(flatten())
    .pipe(rev.manifest({path: 'asset-digest.json'}))
    .pipe(gulp.dest(config.paths.public));
});

gulp.task('watch:scss', function () {
  watch(config.paths.styles + '/**/*.scss',
    batch(function (events, done) {
      gulp.start('sass:development', done);
    }));
});
gulp.task('watch:js', function () {
  watch('spec/**/spec.*.js',
    batch(function (events, done) {
      gulp.start('require:production', done);
    }));
});
gulp.task('watch', function (done) {
  runsequence('watch:scss', 'watch:js', done)
});

gulp.task('build:common', function (done) {
  runsequence(
    'copy:vendors',
    'copy:templates',
    'clean',
    'copy:assets',
    'copy:concat',
    done
  )
});
gulp.task('build:production', function (done) {
  runsequence(
    'build:common',
    'sass:production',
    'require:production',
    'digest',
    done
  )
});
gulp.task('build:development', function (done) {
  runsequence(
    'build:common',
    'sass:development',
    'digest',
    done
  )
});

gulp.task('start:development', function () {
  nodemon({
    script: 'app/server.js',
    ext: 'js html',
    watch: [config.paths.public],
    env: {'NODE_ENV': 'development'}
  })
});
gulp.task('start:production', function () {
  nodemon({
    script: 'app/server.js',
    ignore: '*',
    env: {'NODE_ENV': 'production'}
  }).on('quit', function () {
    console.log('Quiting');
    process.exit(0);
  })
});

gulp.task('tests:jasmine', function () {
  return gulp.src('app/**/*.js').pipe(jasmine(
    {
      helpers: ['spec/helpers/*.js'],
      specs: [
        'spec/shared/**/spec.*.js',
        'spec/client/**/spec.*.js'
      ],
      template: 'spec/index.html',
      keepRunner: true
    }
  ))
});
gulp.task('tests:jasmine_node', function () {
  return gulp.src('spec/helpers').pipe(jasmine_node({
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
      savePath: './build/reports/jasmine/',
      useDotNotation: true,
      consolidate: true
    }
  }))
});
gulp.task('tests', function () {
  runsequence('tests:jasmine', 'tests:jasmine_node')
});

gulp.task('jshint:browser', function () {
  return gulp.src(['app/client/**/*.js', 'spec/client/**/*.js'])
    .pipe(jshint('./node_modules/performanceplatform-js-style-configs/.jshintrc-browser.json'))
    .pipe(jshint.reporter('jshint-stylish'));
});
gulp.task('jshint:node', function () {
  return gulp.src(['app/**/*.js', 'app/**/*.json', 'spec/**/*.js', '!app/client/**/*.js', '!spec/client/**/*.js'])
    .pipe(jshint('./node_modules/performanceplatform-js-style-configs/.jshintrc-node.json'))
    .pipe(jshint.reporter('jshint-stylish'));
});
gulp.task('jshint', function () {
  runsequence('jshint:browser', 'jshint:node')
});

gulp.task('run:development', function () {
  runsequence(
    'build:development',
    'watch',
    'start:development'
  )
});

gulp.task('run:production', function () {
  runsequence('build:production', 'start:production')
});


gulp.task('default', function () {
  runsequence('run:development')
});
