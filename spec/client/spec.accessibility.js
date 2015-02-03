define([
    'client/accessibility'
  ],
  function (accessibility) {

    describe('In-page changes made available to screenreader', function() {

      it('creates a live region if one doesn\'t exist', function() {
        expect($('.live-region-container').length).toEqual(0);
        accessibility.updateLiveRegion('Transactions now sorted by cost per transaction in descending order');
        expect($('.live-region-container').length).toEqual(1);
      });


      it('places update text in the live region', function() {
        accessibility.updateLiveRegion('Update text');
        expect($('.live-region-container').text()).toEqual('Update text');
      });

    });

  });
