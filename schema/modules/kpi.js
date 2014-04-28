var moduleSchema = require('./completion_rate');
var _ = require('lodash');

moduleSchema = _.cloneDeep(moduleSchema);

_.extend(moduleSchema.properties, {
  format: {
    oneOf: [
      {
        type: 'object',
        required: true,
        properties: {
          type: {
            type: 'string'
          }
        }
      },
      {
        type: 'string'
      }
    ],
    required: true
  },
  'value-attribute': {
    type: 'string',
    required: true
  }
});

module.exports = moduleSchema;