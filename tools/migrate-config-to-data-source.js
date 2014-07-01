
var glob = require('glob'),
    path = require('path'),
    fs = require('fs'),
    _ = require('lodash'),
    moment = require('moment-timezone');

var configGlob = path.resolve(
      __dirname,
      '../app/support/stagecraft_stub/responses/**/*.json'
     );

var ISO8601_FORMAT = 'YYYY-MM-DD[T]HH:mm:ss[Z]';

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
   var value = module[prop],
       underscoredProp = prop.replace(/-/g, '_');

   if (value && queryParams[underscoredProp]) {
     console.log('clash!');
   }

   if (value) queryParams[underscoredProp] = value;
   delete module[prop];
  });

  ensureArray(queryParams, 'collect');
  ensureArray(queryParams, 'filter_by');

  switch (module['module-type']) {
    case 'availability':
      if (!queryParams['period']) queryParams['period'] = 'day';
      break;
    case 'bar_chart_with_number':
      if (!module['axis-period']) {
        module['axis-period'] = queryParams.period || 'week';
      }
      break;
    case 'single_timeseries':
    case 'completion_rate':
      if (!queryParams.period) queryParams.period = 'week';
      if (!module['axis-period']) module['axis-period'] = queryParams.period;
      if (!module['value-attribute']) module['value-attribute'] = 'uniqueEvents:sum';
      if (!queryParams.collect) queryParams.collect = [module['value-attribute']];
      if (!module['matching-attribute']) module['matching-attribute'] = 'eventCategory';
      queryParams.group_by = module['matching-attribute'];
      break;
    case 'user_satisfaction_graph':
      if (!queryParams.period) queryParams.period = 'day'
      if (!queryParams.duration) queryParams.duration = 30
      break;
    case 'realtime':
      if (!queryParams.sort_by) queryParams.sort_by = '_timestamp:descending';
      if (!queryParams.limit) queryParams.limit = (((60 / 2) * 24) + 2);
      break;
    case 'table':
      module['sort-by'] = queryParams.sort_by;
      delete queryParams.sort_by;
      break;
    case 'grouped_timeseries':
    case 'comparison':
      queryParams.group_by = module['category'];
      queryParams.collect = [module['value-attribute']];
/*      var timeshifts = module['axes'] && module['axes'].y.map(function(axis) {
        return axis.timeshift;
      }), timeshift = timeshifts && _.max(timeshifts);

      if (timeshift) queryParams['duration'] += timeshift;
      if (timeshift && queryParams['start-at']) {
        queryParams['start-at'] = moment(queryParams['start-at']).subtract(queryParams['period'], timeshift).format('');
      }*/
      break;
  }

  if (Object.keys(queryParams).length === 0) {
    queryParams = undefined;
  } else {
    if (queryParams['start_at']) queryParams['start_at'] = moment(queryParams['start_at']).format(ISO8601_FORMAT);
    if (queryParams['end_at']) queryParams['end_at'] = moment(queryParams['end_at']).format(ISO8601_FORMAT);
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
