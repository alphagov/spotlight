var requirejs = require('requirejs');
var path = require('path');

var View = requirejs('common/views/module');
var templatePath = path.resolve(__dirname, '../templates/module.html');

var Table = requirejs('extensions/views/table');

var templater = require('../mixins/templater');

module.exports = View.extend(templater).extend({

  templatePath: templatePath,

  tagName: 'section',

  initialize: function (options) {
    View.prototype.initialize.apply(this, arguments);

    // apply default attributes to elements
    if (options.el) {
      var attrs = _.extend({}, _.result(this, 'attributes'));
      if (this.id) {
        attrs.id = _.result(this, 'id');
      }
      this.$el.attr(attrs);
      if (this.className) {
        this.$el.addClass(_.result(this, 'className'));
      }
    }
  },

  ariaId: function () {
    function safeId(s) {
      if (s.indexOf(' ') === -1) {
        return s;
      }
      return s.replace(/ /g, '-');
    }
    return safeId(this.model.get('slug') + '-heading');
  },

  attributes: function () {
    return {
      'aria-labelledby': this.ariaId(),
      'role': 'region'
    };
  },

  render: function () {
    View.prototype.render.apply(this, arguments);

    if (this.model.get('restricted_data') === true) {
      this.$el.addClass('module-banner restricted-data-banner');
    }
  },

  templateContext: function () {
    if (this.collection) {
      console.log(this.collection.externalUrl());
      /*var hashParams = this.getHashParams();*/
      // no window
      // so don't work.
      /*console.log(hashParams);*/
      /*console.log("HASHPARAMS!!!??!!")*/
      this.jsonUrl = this.collection.externalUrl();
    }
    return _.extend(
      View.prototype.templateContext.call(this),
      {
        url: this.url,
        fallbackUrl: this.requiresSvg && this.url ? (this.url + '.png') : null,
        jsonUrl: this.jsonUrl,
        hasTable: this.hasTable,
        pageType: this.model.get('parent').get('page-type')
      }
    );
  },

  views: function () {
    var views = this.visualisationClass ? {
      '.visualisation-inner': {
        view: this.visualisationClass,
        options: this.visualisationOptions
      }
    }: {};
    if (this.hasTable && this.collection && this.collection.options && this.collection.options.axes) {
      views['.visualisation-table'] = {
        view: Table,
        options: this.visualisationOptions
      };
    }
    return views;
  }

});
