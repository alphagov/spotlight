define([
  'extensions/views/graph/table',
  'extensions/models/model',
  'extensions/collections/collection'
],
function (GraphTable, Model, Collection) {

  describe('GraphTable', function () {

    var table;

    beforeEach(function () {
      table = new GraphTable({
        model: new Model({
          title: 'Some title'
        }),
        collection: new Collection()
      });
    });

    describe('prepareTable', function () {
      it('hides the table visually when on the dashboard', function () {
        var dashboardTable = new GraphTable({
          model: new Model({
            'page-type': 'dashboard'
          }),
          collection: new Collection()
        });
        dashboardTable.prepareTable();

        expect(dashboardTable.$table.hasClass('visuallyhidden')).toBeTruthy();
      });
    });

  });
});
