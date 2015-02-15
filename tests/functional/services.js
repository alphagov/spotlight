module.exports = {

  beforeEach: function (client) {
    client
      .url('http://localhost:3057/performance/services')
      .waitForElementVisible('body', 1000);
  },

  'Sections Exist': function (client) {
    client
      .assert.visible('#filter-wrapper')
      .assert.visible('.service-kpis')
      .assert.visible('#filtered-list')
      .end();
  },

  'Text filter': function (client) {
    client
      .assert.containsText('#filtered-list table', 'Vehicle tax renewals')
      .setValue('#filter', 'PAYE')
      .waitForElementVisible('#filtered-list table', 1000)
      .assert.doesNotContainText('#filtered-list table', 'Vehicle tax renewals')
      .assert.containsText('#filtered-list table', 'PAYE transactions')
      .end();
  },

  'Dropdown filter': function (client) {
    client
      .assert.containsText('#filtered-list table', 'Vehicle tax renewals')
      .click('#department option[value="co"]')
      .waitForElementVisible('#filtered-list table', 1000)
      .assert.doesNotContainText('#filtered-list table', 'Vehicle tax renewals')
      .assert.containsText('#filtered-list table', 'e-petition signatures')
      .end();
  },

  'Text and Dropdown filter': function (client) {
    client
      .assert.containsText('#filtered-list table', 'Vehicle tax renewals')
      .click('#department option[value="co"]')
      .waitForElementVisible('#filtered-list table', 1000)
      .assert.containsText('#filtered-list table', 'Digital Services Store')
      .assert.containsText('#filtered-list table', 'Digital Marketplace')
      .setValue('#filter', 'Digital Marketplace')
      .waitForElementVisible('#filtered-list table', 1000)
      .assert.doesNotContainText('#filtered-list table', 'Digital Services Store')
      .assert.containsText('#filtered-list table', 'Digital Marketplace')
      .end();
  },

  'KPI Values': function (client) {
    client
      .assert.containsText('.service-kpis .number_of_transactions', 'Transactions per year')
      .assert.doesNotContainText('.service-kpis .number_of_transactions', 'no data')
      .assert.containsText('.service-kpis .total_cost', 'Annual cost')
      .assert.doesNotContainText('.service-kpis .total_cost', 'no data')
      .assert.containsText('.service-kpis .cost_per_transaction', 'Cost per transaction')
      .assert.doesNotContainText('.service-kpis .cost_per_transaction', 'no data')
      .assert.containsText('.service-kpis .user_satisfaction_score', 'User satisfaction')
      .assert.doesNotContainText('.service-kpis .user_satisfaction_score', 'no data')
      .assert.containsText('.service-kpis .completion_rate', 'Completion rate')
      .assert.doesNotContainText('.service-kpis .completion_rate', 'no data')
      .end();
  },

  'no data': function (client) {
    client
      .setValue('#filter', 'no data can be found')
      .assert.containsText('.service-kpis .number_of_transactions', 'Transactions per year')
      .assert.containsText('.service-kpis .number_of_transactions', 'no data')
      .assert.containsText('.service-kpis .total_cost', 'Annual cost')
      .assert.containsText('.service-kpis .total_cost', 'no data')
      .assert.containsText('.service-kpis .cost_per_transaction', 'Cost per transaction')
      .assert.containsText('.service-kpis .cost_per_transaction', 'no data')
      .assert.containsText('.service-kpis .user_satisfaction_score', 'User satisfaction')
      .assert.containsText('.service-kpis .user_satisfaction_score', 'no data')
      .assert.containsText('.service-kpis .completion_rate', 'Completion rate')
      .assert.containsText('.service-kpis .completion_rate', 'no data')
      .end();
  },

  'Clicking on a kpi summary link': function (client) {
    client
      .assert.cssClassPresent('#filtered-list th[data-key="number_of_transactions"]', 'descending')
      .click('.service-kpis .number_of_transactions .visualisation-moreinfo a')
      .assert.cssClassPresent('#filtered-list th[data-key="number_of_transactions"]', 'ascending')
      .end();
  }

};