module.exports = {
  selectors: {
    'filterTable': '#filtered-list table',
    'textFilter': '#filter',
    servicesCount: '.summary-figure-count',
    servicesCountDescription: '.summary-figure-description'
  },

  beforeEach: function (client) {
    client
      .url('http://localhost:3057/performance/services')
      .waitForElementVisible('body.js-enabled', 20000);
  },

  'Sections Exist': function (client) {
    client
      .assert.visible('#filter-wrapper')
      .assert.visible('#filtered-list')
      .end();
  },

  'Text filter': function (client) {
    client
      .assert.containsText(this.selectors.filterTable, 'Department for Business, Innovation & Skills')
      .assert.containsText(this.selectors.filterTable, 'Debt Relief Order (DRO) applicatons')
      .setValue(this.selectors.textFilter, ['prison', client.Keys.ENTER])
      .waitForElementVisible(this.selectors.filterTable, 1000)
      .assert.doesNotContainText(this.selectors.filterTable, 'Department for Business, Innovation & Skills')
      .assert.doesNotContainText(this.selectors.filterTable, 'Debt Relief Order (DRO) applicatons')
      .assert.containsText(this.selectors.filterTable, 'Ministry of Justice')
      .assert.containsText(this.selectors.filterTable, 'Bookings for prison visits')
      .end();
  },

  'Filtered services total count is correct': function (client) {
    var test = this;
    client
      .assert.doesNotContainText(test.selectors.servicesCountDescription, 'containing')
      .setValue(this.selectors.textFilter, ['prison', client.Keys.ENTER])
      .getText(this.selectors.servicesCount, function(result) {
          this
            .assert.containsText(test.selectors.servicesCount, result.value)
            .assert.containsText(test.selectors.servicesCountDescription, 'containing')
            .end();
      });
  },

};
