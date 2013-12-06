define(['common/collections/multi_stats', 'extensions/models/model', 'extensions/collections/collection'], 
  function(MultiStatsCollection, Model, Collection) {
  describe("MultiStatsCollection", function() {

    var stats;
    beforeEach(function() {
      stats = [
        {
          "title": "Row A",
          "attr": "a"
        },
        {
          "title": "Row B",
          "attr": "b",
          "format": "£{{ value }}"
        },
        {
          "title": "Row C",
          "attr": "c",
          "format": "{{ value }}%"
        }
      ];
    });
    
    it("parses data into the correct format", function() {
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
      expect(collection.at(0).get('a')).toEqual(23661);
      expect(collection.at(0).get('b')).toEqual(23661);
      expect(collection.at(0).get('c')).toEqual(31);
    });

    it("does not blow up when a requested attribute is not available", function () {
      var collection = new MultiStatsCollection(  {
          'data': [{
            _end_at: "2002-03-01T00:00:00+00:00",
            _start_at: "2002-02-01T00:00:00+00:00",
            a: [23661],
            c: [31]
          }]
        }, { 'parse': true, stats: stats, period: 'month' });
      
      expect(collection.at(0).get('_start_at').format()).toEqual("2002-02-01T00:00:00+00:00");
      expect(collection.at(0).get('a')).toEqual(23661);
      expect(collection.at(0).get('b')).not.toBeDefined();
      expect(collection.at(0).get('c')).toEqual(31);
    });

    it("trims to the latest date that has at least one stat available", function () {
      var collection = new MultiStatsCollection(  {
          'data': [
            {
              _end_at: "2002-03-01T00:00:00+00:00",
              _start_at: "2002-02-01T00:00:00+00:00",
              a: [23661],
              b: [23661],
              c: [31]
            },
            {
              _end_at: "2002-04-01T00:00:00+00:00",
              _start_at: "2002-03-01T00:00:00+00:00",
              a: [123],
              b: [],
              c: []
            },
            {
              _end_at: "2002-05-01T00:00:00+00:00",
              _start_at: "2002-04-01T00:00:00+00:00",
              a: [],
              b: [],
              c: []
            }
          ]
        }, { 'parse': true, stats: stats, period: 'month' });
      
      expect(collection.length).toEqual(2);
      expect(collection.at(0).get('_start_at').format()).toEqual("2002-02-01T00:00:00+00:00");
      expect(collection.at(0).get('_end_at').format()).toEqual("2002-03-01T00:00:00+00:00");
      expect(collection.at(0).get('a')).toEqual(23661);
      expect(collection.at(0).get('b')).toEqual(23661);
      expect(collection.at(0).get('c')).toEqual(31);
      expect(collection.at(1).get('_start_at').format()).toEqual("2002-03-01T00:00:00+00:00");
      expect(collection.at(1).get('a')).toEqual(123);
      expect(collection.at(1).get('b')).not.toBeDefined();
      expect(collection.at(1).get('c')).not.toBeDefined();
    });
  });
});
