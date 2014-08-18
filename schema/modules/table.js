var moduleSchema = require('../module');
var _ = require('lodash');

moduleSchema = _.cloneDeep(moduleSchema);

_.extend(moduleSchema.properties, {
  'sort-order': {
    type: 'string',
    required: true,
    enum: ['ascending', 'descending']
  },
  'sort-by': {
    type: 'string',
    required: true
  }
});

module.exports = moduleSchema;
