var moduleSchema = require('../module');
var _ = require('lodash');

moduleSchema = _.cloneDeep(moduleSchema);

moduleSchema.definitions.axis.properties.key.required = false;

module.exports = {
  allOf: [
    moduleSchema,
    {
      properties: {
        category: {
          type: 'string',
          required: true
        },
        use_stack: {
          type: 'boolean'
        },
        period: {
          $ref: '#/definitions/period'
        },
        'value-attribute': {
          required: true
        },
        'show-line-labels': {
          type: 'boolean'
        },
        'show-total-lines': {
          type: 'boolean'
        },
        'one-hundred-percent': {
          type: 'boolean'
        },
        'group-mapping': {
          type: 'object'
        },
        axes: {
          type: 'object',
          properties: {
            y: {
              required: true
            }
          }
        }
      }
    }
  ],
  definitions: moduleSchema.definitions
};