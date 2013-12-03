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
      "some-group": "xyz"
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
      "some-group": "abc"
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
      "some-group": "def"
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



    describe("parse", function () {
      it("parses the response", function () {
        var collection = new VolumetricsCollection([], {
          'data-type': "some-type",
          'data-group': "some-group",
          valueAttr: "some:value",
          category: "some-group",
          period: "month",
          seriesList: [
            { id: "abc", title: "ABC" },
            { id: "def", title: "DEF" },
            { id: "xyz", title: "XYZ" }
          ]         
        });

        var parsed = collection.parse(response);

        expect(JSON.stringify(parsed)).toEqual(JSON.stringify(expected));
      });
    });
  });
});
