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
        'value-attribute': {
          required: true
        },
        'show-line-labels': {
          type: 'boolean'
        },
        'line-label-links': {
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
        'currency': {
          type: 'string',
          required: false,
          // This enum is wrapped inside a oneOf to get around the fact
          // that a straight enum with required false does not work with
          // our jsonschema library.
          oneOf: [
            { enum: ['gbp'] }
          ]
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
