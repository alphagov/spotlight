
var glob = require('glob'),
    path = require('path'),
    fs = require('fs');

var configGlob = path.resolve(
      __dirname,
      '../app/support/stagecraft_stub/responses/**/*.json'
     );

var queryParamProps = [
  "period", "duration", "sort-by", "group-by", "collect", "filter-by", "start-at", "end-at"
];

function ensureArray(obj, key) {
  if (obj[key] && !Array.isArray(obj[key])) {
    obj[key] = [ obj[key] ];
  }
}

function transformModule (module) {
  var queryParams = module['query-params'] || {};

  delete module['query-params']

  queryParamProps.forEach(function(prop) {
   var value = module[prop];
   if (value) queryParams[prop] = value;
   delete module[prop];
  });

  ensureArray(queryParams, 'collect');
  ensureArray(queryParams, 'filter-by');

  if (Object.keys(queryParams).length === 0) {
    queryParams = undefined;
  }

  if (module['data-group'] || module['data-type'] || queryParams) {
    module['data-source'] = {
     'data-group': module['data-group'],
     'data-type': module['data-type'],
     'query-params': queryParams
    };

    delete module['data-group']
    delete module['data-type']
  }

  if (module.tabs) module.tabs = module.tabs.map(transformModule);

  return module;
}

glob(configGlob, function(err, files) {
  files.map(function(f) {
         return fs.readFileSync(f, 'utf8');
       })
       .map(JSON.parse)
       .map(function(dashboard) {
         if (dashboard.modules) {
           dashboard.modules = dashboard.modules.map(transformModule);
         }
         return dashboard;
       })
       .forEach(function(dashboard, i) {
         fs.writeFileSync(
           files[i], 
           JSON.stringify(dashboard, null, '  ') + '\n'
         )
       });
});
