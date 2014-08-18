var moduleSchema = require('../module');
var _ = require('lodash');

moduleSchema = _.cloneDeep(moduleSchema);

_.extend(moduleSchema.properties, {
  'matching-attribute': {
    type: 'string',
    required: false
  }
});

module.exports = moduleSchema;
