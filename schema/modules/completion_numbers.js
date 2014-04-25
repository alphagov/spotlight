var moduleSchema = require('../module');
var _ = require('lodash');

moduleSchema = _.cloneDeep(moduleSchema);

moduleSchema.definitions.axis.properties.key.required = false;

module.exports = moduleSchema;