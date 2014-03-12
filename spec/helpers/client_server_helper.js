var obj;
if (typeof window === 'object') {
  window.isClient = false;
  window.isServer = false;
  obj = window;
}
if (typeof global === 'object') {
  global.isClient = false;
  global.isServer = false;
  obj = global;
}

jasmine.clientOnly = function (method) {
  obj.isClient = true;
  obj.isServer = false;
  method();
  obj.isClient = false;
};

jasmine.serverOnly = function (method) {
  obj.isServer = true;
  obj.isClient = false;
  method();
  obj.isServer = false;
};
