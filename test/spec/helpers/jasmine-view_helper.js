$ = require('jquery');
/**
 * Renders a view into a DOM element and runs assertions against it
 * Locale calls simply return the key value
 * @param {Object} view View under test
 * @param {Function} assertions Method containing assertions
 * @param {Object} options Rendering options
 * @param {Function} [options.environment=undefined] Gets passed playground as argument, return value used as wrapper element. Defaults to playground.
 */
jasmine.renderView = function (view, assertions, options) {
  options = options || {};
  
  // set up DOM element to inject view into
  var playground = $('<div id="jasmine-playground"></div>');
  playground.appendTo('body');
  
  var viewContainer = playground;
  if (typeof(options.environment) === 'function') {
    viewContainer = options.environment(playground);
  }
  
  try {
    view.$el.appendTo(viewContainer);
    view.render();
    assertions.call(view);
  } finally {
    // tear down
    playground.remove();
  }
};
