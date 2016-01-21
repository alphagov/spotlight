module.exports = {
  selectors: {
    servicesLink: '.services-link',
    servicesCount: '.services-count',
    servicesPageCount: '.summary-figure-count',
    showcaseService: '.brand-interactive',
    topServicesCostItems: '.top-services-cost tbody a'
  },

  beforeEach: function (client) {
    client
      .url('http://localhost:3057/performance')
      .waitForElementVisible('body.js-enabled', 20000);
  },

  'Services total count is correct': function (client) {
    var test = this;
    client
      .getText(this.selectors.servicesCount, function(result) {
        this.click(test.selectors.servicesLink, function() {
          this
            .assert.containsText(test.selectors.servicesPageCount, result.value)
            .end();
        });
      });
  },

};

