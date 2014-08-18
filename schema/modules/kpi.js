var moduleSchema = require('../module');
var _ = require('lodash');

moduleSchema = _.cloneDeep(moduleSchema);

_.extend(moduleSchema.properties, {
  format: {
    oneOf: [
      {
        type: 'object',
        required: true,
        additionalProperties: false,
        properties: {
          type: { type: 'string', enum: ['number'] },
          magnitude: { type: 'boolean' },
          sigfigs: { type: 'integer' }
        }
      },
      {
        type: 'object',
        required: true,
        additionalProperties: false,
        properties: {
          type: { type: 'string', enum: ['currency'] },
          magnitude: { type: 'boolean' },
          sigfigs: { type: 'integer' }
        }
      },
      {
        type: 'object',
        required: true,
        additionalProperties: false,
        properties: {
          type: { type: 'string', enum: ['currency'] },
          dps: { type: 'integer' }
        }
      },
      {
        type: 'object',
        required: true,
        additionalProperties: false,
        properties: {
          type: { type: 'string', enum: ['currency'] },
          pence: { type: 'boolean' }
        }
      }
    ],
    required: true
  },
  'value-attribute': {
    type: 'string',
    required: true
  },
  'date-period': {
    type: 'string',
    required: false
  }
});

module.exports = moduleSchema;
