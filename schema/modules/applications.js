var moduleSchema = require('../module');
var _ = require('lodash');

moduleSchema = _.cloneDeep(moduleSchema);

_.extend(moduleSchema.properties, {
  definitions: {
    axis: {
      type: 'object',
      properties: {
        format: {
          oneOf: [
          {
            type: 'string'
          },
          {
            type: 'object',
            properties: {
              type: {
                type: 'string'
              }
            }
          }
          ]
        },
        key: {
          'oneOf': [
          {
            'type': 'string'
          },
          {
            'type': 'array'
          }
          ]
        },
        'label': {
          'required': true,
          'type': 'string'
        }
      }
    }
  }
});

module.exports = moduleSchema;
