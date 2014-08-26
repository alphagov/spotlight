define([],
function () {
  window.logger = {
    debug: function() {
      if (console) {
        console.info.apply(console, arguments);
      }
    },
    error: function() {
      if (console) {
        console.error.apply(console, arguments);
      }
    },
    info: function() {
      if (console) {
        console.info.apply(console, arguments);
      }
    },
    log: function() {
      if (console) {
        console.log.apply(console, arguments);
      }
    },
    warn: function() {
      if (console) {
        console.warn.apply(console, arguments);
      }
    }
  };
});
