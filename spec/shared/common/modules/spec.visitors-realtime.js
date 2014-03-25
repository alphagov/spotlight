define([
  'common/modules/visitors-realtime',
  'extensions/models/model'
], function (RealtimeModule, Model) {

  describe('Realtime module', function () {

    describe('uses classes from the model', function () {

      it('should add classes if an array is passed', function () {
        var realtimeModule = new RealtimeModule({
          model: new Model({ 'module-type': 'realtime', classes: ['cols2', 'foo'] })
        });

        expect(realtimeModule.className()).toBe('module realtime cols2 foo');
      });

      it('should handle no classes being passed in to the model', function () {
        var realtimeModule = new RealtimeModule({
          model: new Model({ 'module-type': 'realtime' })
        });

        expect(realtimeModule.className()).toBe('module realtime');
      });

    });

  });

});
