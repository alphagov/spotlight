define([
    'extensions/models/model',
    'backbone'
],
function (Model, Backbone) {
    describe("Model", function() {
        it("inherits from Backbone.Model", function() {
            var model = new Model();
            expect(model instanceof Backbone.Model).toBe(true);
        });

        describe("parse", function() {
            
            it("converts valid date attributes into moment date objects", function() {
                var model = new Model({
                    foo: 'bar',
                    '_timestamp': '2013-01-01T00:00:00+00:00',
                    '_start_at': '2013-01-02T00:00:00+00:00',
                    '_end_at': '2013-01-03T00:00:00+00:00'
                }, {
                    parse: true
                });
                
                expect(model.get('foo')).toEqual('bar');
                expect(moment.isMoment(model.get('_timestamp'))).toBe(true);
                expect(model.get('_timestamp').format('YYYY-MM-DD')).toEqual('2013-01-01');
                expect(model.get('_start_at').format('YYYY-MM-DD')).toEqual('2013-01-02');
                expect(model.get('_end_at').format('YYYY-MM-DD')).toEqual('2013-01-03');
            });
            
            it("warns when a timestamp is invalid", function() {
                spyOn(window.console, "warn");
                var model = new Model({
                    foo: 'bar',
                    '_timestamp': 'asdf'
                }, {
                    parse: true
                });
                
                expect(moment.isMoment(model.get('_timestamp'))).toBe(false);
                expect(console.warn).toHaveBeenCalled();
            });
            
        });
    });
});
