define(['common/collections/multi_stats', 'extensions/models/model', 'extensions/collections/collection'], 
  function(MultiStatsCollection, Model, Collection) {
  describe("MultiStatsCollection", function() {
    
    it("parses data into the correct format", function() {

      var stats = [{
          "title": "Row A",
          "attr": "a"
        }, {
          "title": "Row B",
          "attr": "b",
          "format": "£{{ value }}"
        }, {
          "title": "Row C",
          "attr": "c",
          "format": "{{ value }}%"
        }];
      var collection = new MultiStatsCollection(  {
          'data': [{
            _end_at: "2002-03-01T00:00:00+00:00",
            _start_at: "2002-02-01T00:00:00+00:00",
            a: [23661],
            b: [23661],
            c: [31]
          }]
        }, { 'parse': true, stats: stats, period: 'month' });
      
      expect(collection.at(0).get('_start_at').format()).toEqual("2002-02-01T00:00:00+00:00");
      expect(collection.at(0).get('b')).toEqual(23661);
      
    });
  });
});
