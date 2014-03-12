var grunt = require('grunt');

// hack to avoid loading a Gruntfile
// You can skip this and just use a Gruntfile instead
grunt.task.init = function () {};

// Init config
grunt.initConfig({
  jasmine: {
    all: ['index.js']
  }
});

// Register your own tasks
grunt.registerTask('mytask', function () {
  grunt.log.write('Ran my task.');
});

// Load tasks from npm
grunt.loadNpmTasks('grunt-contrib-jasmine');

// Finally run the tasks, with options and a callback when we're done
grunt.tasks(['mytask', 'jshint'], {}, function () {
  grunt.log.ok('Done running tasks.');
});
