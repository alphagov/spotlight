var moduleSchema = require('../module');
var _ = require('lodash');

moduleSchema = _.cloneDeep(moduleSchema);

_.extend(moduleSchema.properties, {
  'label-attr': {
    type: 'string',
    required: true
  },
  'label-regex': {
    type: 'string',
    required: true
  },
  'link-attr': {
    type: 'string',
    required: true
  }
});

module.exports = moduleSchema;
