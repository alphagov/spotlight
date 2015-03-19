module.exports = {
  selectors: {
    'filterTable': '#filtered-list table',
    'textFilter': '#filter'
  },

  beforeEach: function (client) {
    client
      .url('http://localhost:3057/performance/web-traffic')
      .waitForElementVisible('body.js-enabled.ready.loaded', 20000);
  },

  'Sections Exist': function (client) {
    client
      .assert.visible('#filter-wrapper')
      .assert.visible('#filtered-list')
      .end();
  },

  'Text filter': function (client) {
    client
      .assert.containsText(this.selectors.filterTable, 'The Charity Commission')
      .setValue(this.selectors.textFilter, 'prime')
      .waitForElementVisible(this.selectors.filterTable, 1000)
      .assert.doesNotContainText(this.selectors.filterTable, 'The Charity Commission')
      .assert.containsText(this.selectors.filterTable, 'The Deputy Prime Minister\'s Office')
      .end();
  }

};

