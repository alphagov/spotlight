define([
  'common/modules/completion_table',
  './table'
], function (CompletionTable, Table) {
  return Table.extend(CompletionTable);
});