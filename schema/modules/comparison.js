var moduleSchema = require('../module');
var _ = require('lodash');

moduleSchema = _.cloneDeep(moduleSchema);

_.extend(moduleSchema.properties, {
  category: {
    type: 'string',
    required: true
  },
  comparison: {
    type: 'array',
    required: true
  },
  'value-attribute': {
    type: 'string'
  },
  'show-line-labels': {
    type: 'boolean'
  },
  'use_stack': {
    type: 'boolean'
  }
});

module.exports = moduleSchema;
