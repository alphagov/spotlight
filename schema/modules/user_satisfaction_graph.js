var moduleSchema = require('../module');
var _ = require('lodash');

moduleSchema = _.cloneDeep(moduleSchema);

_.extend(moduleSchema.properties, {
  'value-attribute': {
    type: 'string',
    required: true
  }
});

module.exports = moduleSchema;
