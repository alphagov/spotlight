define([
  'common/collections/categories'
],
function (VolumetricsCollection) {
  describe("VolumetricsCollection", function () {
    var response = {
  "data": [
    {
      "some:value": 5, 
      "values": [
        {
          "_end_at": "2012-09-01T00:00:00+00:00", 
          "some:value": 3,
          "_start_at": "2012-08-01T00:00:00+00:00"
        }, 
        {
          "_end_at": "2012-10-01T00:00:00+00:00", 
          "_start_at": "2012-09-01T00:00:00+00:00"
        }
      ], 
      "some-category": "xyz"
    }, 
    {
      "some:value": 7, 
      "values": [
        {
          "_end_at": "2012-09-01T00:00:00+00:00", 
          "some:value": 3,
          "_start_at": "2012-08-01T00:00:00+00:00"
        }, 
        {
          "_end_at": "2012-10-01T00:00:00+00:00", 
          "some:value": 4,
          "_start_at": "2012-09-01T00:00:00+00:00"
        }
      ], 
      "some-category": "abc"
    }, 
    {
      "some:value": 16, 
      "values": [
        {
          "_end_at": "2012-09-01T00:00:00+00:00", 
          "some:value": 6,
          "_start_at": "2012-08-01T00:00:00+00:00"
        }, 
        {
          "_end_at": "2012-10-01T00:00:00+00:00", 
          "some:value": 10,
          "_start_at": "2012-09-01T00:00:00+00:00"
        }
      ], 
      "some-category": "def"
    }
  ]
};

    var expected = [
      {
        "id": "abc",
        "title": "ABC",
        "values": [
          {
            "_end_at": "2012-09-01T00:00:00+00:00", 
            "some:value": 3,
            "_start_at": "2012-08-01T00:00:00+00:00"
          }, 
          {
            "_end_at": "2012-10-01T00:00:00+00:00", 
            "some:value": 4,
            "_start_at": "2012-09-01T00:00:00+00:00"
          }
        ]
      },
      {
        "id": "def",
        "title": "DEF",
        "values": [
          {
            "_end_at": "2012-09-01T00:00:00+00:00", 
            "some:value": 6,
            "_start_at": "2012-08-01T00:00:00+00:00"
          }, 
          {
            "_end_at": "2012-10-01T00:00:00+00:00", 
            "some:value": 10,
            "_start_at": "2012-09-01T00:00:00+00:00"
          }
        ]
      }, 
      {
        "id": "xyz",
        "title": "XYZ",
        "values": [
          {
            "_end_at": "2012-09-01T00:00:00+00:00", 
            "some:value": 3,
            "_start_at": "2012-08-01T00:00:00+00:00"
          }, 
          {
            "_end_at": "2012-10-01T00:00:00+00:00", 
            "_start_at": "2012-09-01T00:00:00+00:00"
          }
        ]
      }
    ];

    var collection;
    beforeEach(function (){
      collection = new VolumetricsCollection([], {
        'data-type': "some-type",
        'data-group': "some-group",
        valueAttr: "some:value",
        category: "some-category",
        period: "month",
        seriesList: [
          { id: "abc", title: "ABC" },
          { id: "def", title: "DEF" },
          { id: "xyz", title: "XYZ" }
        ]         
      });
      collection.backdropUrl = '//testdomain/{{ data-group }}/{{ data-type }}';
    });

    describe("url", function () {
      it("should query backdrop with the correct url for the config", function () {
        expect(collection.url()).toContain("some-group");
        expect(collection.url()).toContain("some-type");
        expect(collection.url()).toContain("period=month");
        expect(collection.url()).toContain("group_by=some-category");
        expect(collection.url()).toContain("collect=some%3Avalue");
        expect(collection.url()).not.toContain("filter_by");
      });
    });

    describe("parse", function () {
      it("parses the response", function () {
        var parsed = collection.parse(response);
        expect(JSON.stringify(parsed)).toEqual(JSON.stringify(expected));
      });
    });
  });
});
