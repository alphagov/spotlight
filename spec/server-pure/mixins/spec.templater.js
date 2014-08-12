var templater = require('../../../app/server/mixins/templater');
var path = require('path');

describe('Templater', function () {

  describe('loadTemplate', function () {

    describe('mustache', function () {

      var template;

      beforeEach(function () {
        template = path.resolve(__dirname, './templates/test.mustache.html');
      });

      it('renders the template with data passed', function () {
        expect(templater.loadTemplate(template, { title: 'foo' }, 'mustache')).toEqual('<p>foo</p>');
      });

    });
    describe('underscore', function () {

      var template;

      beforeEach(function () {
        template = path.resolve(__dirname, './templates/test.underscore.html');
      });

      it('renders the template with data passed', function () {
        expect(templater.loadTemplate(template, { title: 'foo' }, 'underscore')).toEqual('<p>foo</p>');
      });

      it('uses underscore as a template type by default', function () {
        expect(templater.loadTemplate(template, { title: 'foo' })).toEqual('<p>foo</p>');
      });

    });

  });

});