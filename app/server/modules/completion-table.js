var requirejs = require('requirejs');

var Table = require('./table');

var CompletionTable = requirejs('common/modules/completion_table');

module.exports = Table.extend(CompletionTable);