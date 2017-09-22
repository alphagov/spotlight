if (typeof global === 'object') {
  global._ = require('lodash');
  global.jQuery = global.$ = require('jquery')(require('jsdom').jsdom().defaultView);
}
