define([
  'common/collections/grouped_timeshift',
  'extensions/models/query'
],
function (GroupedTimeshiftCollection, Query) {
  describe("GroupedTimeshiftCollection", function () {
    var weekDuration = Query.prototype.periods.week.duration;

    it("should return query parameters", function(){
      var collection = new GroupedTimeshiftCollection([],{
        valueAttr: 'value',
        period: 'week',
        category: 'group',
        seriesList: [
          { id: 'one', title: 'One', timeshift: 1 }
        ]
      });

      var queryParams = collection.queryParams();

      expect(queryParams.collect).toBe('value');
      expect(queryParams.period).toBe('week');
      expect(queryParams.group_by).toBe('group');
      expect(queryParams.duration).toBe(weekDuration + 1); // standard duration plus timeshift for a week graph
    });

    it("should calculate standard duration", function(){
      var collection = new GroupedTimeshiftCollection([],{
        period: 'week'
      });

      expect(collection.standardDuration()).toBe(weekDuration);
    });

    it("should allow for a custom standard duration", function(){
      var collection = new GroupedTimeshiftCollection([],{
        period: 'week',
        duration: 29
      });

      expect(collection.standardDuration()).toBe(29);
    });

    it("should work out the duration of a graph based on a maximum timeshift", function (){
      var collection = new GroupedTimeshiftCollection([],{
        period: 'week',
        seriesList: [
          { id: 'one', title: 'One', timeshift: 4 },
          { id: 'two', title: 'Two', timeshift: 5 },
          { id: 'thr', title: 'Thr', timeshift: 6 },
        ]
      });

      expect(collection.duration()).toBe(weekDuration + 6);
    });

    it("should apply standard dates to a set of values", function(){
      var seriesList = [
         { values: [
            { _start_at: 'a', _end_at: 'b' },
            { _start_at: 'b', _end_at: 'c' },
            { _start_at: 'c', _end_at: 'd' }
          ] },
         { values: [
            { _start_at: 'd', _end_at: 'e' },
            { _start_at: 'e', _end_at: 'f' },
            { _start_at: 'f', _end_at: 'g' }
          ] },
        ];
      var standardValues = [
        { _start_at: 'd', _end_at: 'e' },
        { _start_at: 'e', _end_at: 'f' },
        { _start_at: 'f', _end_at: 'g' }
      ]
      var expectedList = [
         { values: [
            { _original_start_at: 'a', _original_end_at: 'b', _start_at: 'd', _end_at: 'e' },
            { _original_start_at: 'b', _original_end_at: 'c', _start_at: 'e', _end_at: 'f' },
            { _original_start_at: 'c', _original_end_at: 'd', _start_at: 'f', _end_at: 'g' }
          ] },
         { values: [
            { _original_start_at: 'd', _original_end_at: 'e', _start_at: 'd', _end_at: 'e' },
            { _original_start_at: 'e', _original_end_at: 'f', _start_at: 'e', _end_at: 'f' },
            { _original_start_at: 'f', _original_end_at: 'g', _start_at: 'f', _end_at: 'g' }
          ] },
        ];

      expect(GroupedTimeshiftCollection.prototype.applyStandardDates(seriesList, standardValues)).toEqual(expectedList);
    });

    describe('parse', function () {

      var response, expected;
      beforeEach(function () {
         response = {
          data: [
            {
              key: 'one',
              values: [
                { _start_at: 'a', _end_at: 'b', value: 1 },
                { _start_at: 'b', _end_at: 'c', value: 2 },
                { _start_at: 'c', _end_at: 'd', value: 3 },
                { _start_at: 'd', _end_at: 'e', value: 4 }
              ]
            },
            {
              key: 'two',
              values: [
                { _start_at: 'a', _end_at: 'b', value: 5 },
                { _start_at: 'b', _end_at: 'c', value: 6 },
                { _start_at: 'c', _end_at: 'd', value: 7 },
                { _start_at: 'd', _end_at: 'e', value: 8 }
              ]
            }
          ]
        };

         expected = [{
            id: 'one',
            title: 'One',
            values: [
              { _start_at: 'c', _end_at: 'd', value: 3, _original_start_at: 'c', _original_end_at: 'd' },
              { _start_at: 'd', _end_at: 'e', value: 4, _original_start_at: 'd', _original_end_at: 'e' }
            ]
          },{
            id: 'one2',
            title: 'One',
            timeshift: 2,
            values: [
              { _start_at: 'c', _end_at: 'd', value: 1, _original_start_at: 'a', _original_end_at: 'b' },
              { _start_at: 'd', _end_at: 'e', value: 2, _original_start_at: 'b', _original_end_at: 'c' }
            ]
          },{
            id: 'two',
            title: 'Two',
            values: [
              { _start_at: 'c', _end_at: 'd', value: 7, _original_start_at: 'c', _original_end_at: 'd' },
              { _start_at: 'd', _end_at: 'e', value: 8, _original_start_at: 'd', _original_end_at: 'e' }
            ]
          }];
      });


    it("should parse response data", function(){

      var collection = new GroupedTimeshiftCollection([],{
        valueAttr: 'value',
        period: 'week',
        category: 'key',
        duration: 2,
        seriesList: [
          { id: 'one', title: 'One' },
          { id: 'one', title: 'One', timeshift: 2 },
          { id: 'two', title: 'Two' }
        ]
      });

      var parsed = collection.parse(response);
      expect(parsed.length).toBe(3);
      expect(parsed).toEqual(expected);
    });

    it("should cope if not all of the specified series are present in the response", function(){

      var collection = new GroupedTimeshiftCollection([],{
        valueAttr: 'value',
        period: 'week',
        category: 'key',
        duration: 2,
        seriesList: [
          { id: 'one', title: 'One' },
          { id: 'one', title: 'One', timeshift: 2 },
          { id: 'two', title: 'Two' },
          { id: 'three', title: 'Three' }
        ]
      });

      var parsed = collection.parse(response);
      expect(parsed.length).toBe(3);
      expect(parsed).toEqual(expected);
    });


    it("should cope if none of the specified series are present in the response", function(){

      var collection = new GroupedTimeshiftCollection([],{
        valueAttr: 'value',
        period: 'week',
        category: 'key',
        duration: 2,
        seriesList: [
          { id: 'three', title: 'Three' }
        ]
      });

      var parsed = collection.parse(response);
      expect(parsed.length).toBe(0);
      expect(parsed).toEqual([]);
    });

  });


  });
});
