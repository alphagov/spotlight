var requirejs = require('requirejs');

var ListView = require('../../../app/server/views/modules/list');
var ListCollection = requirejs('common/collections/list');

describe('ListView', function () {

  it('should show the correct number of items', function () {

    var collection = new ListCollection({
      'data': [
        { 'pageTitle': 'foo',
          'pagePath': '/foo' },
        { 'pageTitle': 'bar',
          'pagePath': '/bar' }
      ]
    }, {
      'id': 'foo',
      'title': 'foo',
      'parse': 'true',
      'labelAttr': 'pageTitle',
      'linkAttr': 'pagePath'
    });

    var view = new ListView({
      collection: collection
    });

    view.render();

    var listItems = view.$el.find('li');

    expect(listItems.length).toEqual(2);
    expect(listItems.first().text().trim()).toEqual('foo');
    expect(listItems.first().find('a').attr('href')).toEqual('/foo');
    expect(listItems.last().text().trim()).toEqual('bar');
    expect(listItems.last().find('a').attr('href')).toEqual('/bar');

  });

  it('should show a nice "no data" message when there is no data', function () {

    var collection = new ListCollection({
      'data': []
    }, {
      'id': 'foo',
      'title': 'foo',
      'parse': 'true',
      'labelAttr': 'pageTitle',
      'linkAttr': 'pagePath'
    });

    var view = new ListView({
      collection: collection
    });

    view.render();
    var listItems = view.$el.find('li');

    expect(listItems.length).toEqual(0);
    expect(view.$el.html()).toContain('<span class="no-data">(no data)</span>');

  });
  it('should escape labels properly', function () {

    var collection = new ListCollection({
      'data': [
        { 'pageTitle': 'foo&#x27;',
          'pagePath': '/foo' }
      ]
    }, {
      'id': 'foo',
      'title': 'foo',
      'parse': 'true',
      'labelAttr': 'pageTitle',
      'linkAttr': 'pagePath'
    });

    var view = new ListView({
      collection: collection
    });

    view.render();
    var listItems = view.$el.find('li');

    expect(listItems.length).toEqual(1);
    expect(listItems.first().text().trim()).toEqual('foo\'');

  });

  it('should show the urls with a url-root', function () {

    var collection = new ListCollection({
      'data': [
        { 'pageTitle': 'foo',
          'pagePath': '/foo' },
        { 'pageTitle': 'bar',
          'pagePath': '/bar' }
      ]
    }, {
      'id': 'foo',
      'title': 'foo',
      'parse': 'true',
      'labelAttr': 'pageTitle',
      'linkAttr': 'pagePath',
      'urlRoot': 'https://www.gov.uk'
    });

    var view = new ListView({
      collection: collection
    });

    view.render();

    expect(view.$el.find('li a').first().attr('href')).toEqual('https://www.gov.uk/foo');

  });

  it('should not show links if there is no link-attr', function () {

    var collection = new ListCollection({
      'data': [
        { 'pageTitle': 'foo',
          'pagePath': '/foo' },
        { 'pageTitle': 'bar',
          'pagePath': '/bar' }
      ]
    }, {
      'id': 'foo',
      'title': 'foo',
      'parse': 'true',
      'labelAttr': 'pageTitle'
    });

    var view = new ListView({
      collection: collection
    });

    view.render();

    var listItems = view.$el.find('li');

    expect(listItems.length).toEqual(2);
    expect(listItems.find('a').length).toEqual(0);

  });

  it('it should use a labelRegex if provided', function () {

    var collection = new ListCollection({
      'data': [
        { 'pageTitle': 'foo - GOV.UK',
          'pagePath': '/foo' },
        { 'pageTitle': 'bar - GOV.UK',
          'pagePath': '/bar' }
      ]
    }, {
      'id': 'foo',
      'title': 'foo',
      'parse': 'true',
      'labelAttr': 'pageTitle',
      'labelRegex': '^(.*)\\s-[^-]+$',
      'linkAttr': 'pagePath'
    });

    var view = new ListView({
      collection: collection
    });

    view.render();

    var listItems = view.$el.find('li');

    expect(listItems.length).toEqual(2);
    expect(listItems.first().text().trim()).toEqual('foo');
    expect(listItems.last().text().trim()).toEqual('bar');

  });

  it('should not use label if labelRegex match fails', function () {

    var collection = new ListCollection({
      'data': [
        { 'pageTitle': 'foo - GOV.UK',
          'pagePath': '/foo' },
        { 'pageTitle': 'bar',
          'pagePath': '/bar' }
      ]
    }, {
      'id': 'foo',
      'title': 'foo',
      'parse': 'true',
      'labelAttr': 'pageTitle',
      'labelRegex': '^(.*)\\s-[^-]+$',
      'linkAttr': 'pagePath'
    });

    var view = new ListView({
      collection: collection
    });

    view.render();
    var listItems = view.$el.find('li');

    expect(listItems.length).toEqual(2);
    expect(listItems.first().text().trim()).toEqual('foo');
    expect(listItems.last().text().trim()).toEqual('bar');

  });

});