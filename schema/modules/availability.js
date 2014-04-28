var moduleSchema = require('../module');
var _ = require('lodash');

moduleSchema = _.cloneDeep(moduleSchema);

_.extend(moduleSchema.properties, {
  period: {
    $ref: '#/definitions/period'
  }
});

module.exports = moduleSchema;