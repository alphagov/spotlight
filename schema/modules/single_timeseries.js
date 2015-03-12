var moduleSchema = require('../module');
var _ = require('lodash');

moduleSchema = _.cloneDeep(moduleSchema);

_.extend(moduleSchema.properties, {
  'value-attribute': {
    type: 'string',
    required: true
  },
  'format-options': {
    oneOf: [
      {
        type: 'object',
        required: false,
        additionalProperties: false,
        properties: {
          'type': {'type': 'string', enum: ['duration']},
          'unit': {'type': 'string', enum: ['m']}
        }
      }
    ]
  },
  'denominator-matcher': {
    type: 'string'
  },
  'numerator-matcher': {
    type: 'string'
  },
  'matching-attribute': {
    type: 'string'
  },
  'default-value': {
    type: 'integer'
  }
});

module.exports = moduleSchema;
