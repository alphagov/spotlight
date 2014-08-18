var moduleSchema = require('../module');
var _ = require('lodash');

moduleSchema = _.cloneDeep(moduleSchema);

_.extend(moduleSchema.properties, {
  'denominator-matcher': {
    type: 'string',
    required: true
  },
  'numerator-matcher': {
    type: 'string',
    required: true
  },
  'matching-attribute': {
    type: 'string',
    required: true
  },
  'value-attribute': {
    type: 'string',
    required: true
  }
});

module.exports = moduleSchema;