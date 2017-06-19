var fs        = require('fs');
var cache     = require('memory-cache');
var path      = require('path');
var templater = require('../../../app/server/mixins/templater');

describe('Templater', function () {

  describe('loadTemplate', function () {

    var templatePath;

    describe('mustache', function () {

      beforeEach(function () {
        templatePath = path.resolve(__dirname, './templates/test.mustache.html');
      });

      it('renders the template with data passed', function () {
        expect(templater.loadTemplate(templatePath, { title: 'foo' }, 'mustache')).toEqual('<p>foo</p>');
      });

    });

    describe('underscore', function () {

      beforeEach(function () {
        templatePath = path.resolve(__dirname, './templates/test.underscore.html');
      });

      it('renders the template with data passed', function () {
        expect(templater.loadTemplate(templatePath, { title: 'foo' }, 'underscore')).toEqual('<p>foo</p>');
      });

      it('uses underscore as a template type by default', function () {
        expect(templater.loadTemplate(templatePath, { title: 'foo' })).toEqual('<p>foo</p>');
      });

    });

    describe('template caching', function () {
      beforeEach(function() {
        templatePath = path.resolve(__dirname, './templates/test.underscore.html');
        templater.loadTemplate(templatePath, { title: 'foo' });
        spyOn(fs, 'readFileSync');
        templater.loadTemplate(templatePath, { title: 'foo' });
      });

      it('does not open the template file', function () {
        expect(fs.readFileSync.callCount).toEqual(0);
      });

      it('caches the template', function () {
        expect(cache.get(templatePath)).toEqual('<p><%= title %></p>');
      });
    });

  });

});
