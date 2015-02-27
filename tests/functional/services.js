module.exports = {
  selectors: {
    'filterTable': '#filtered-list table',
    'textFilter': '#filter',
    'kpi': '.service-kpis'
  },

  beforeEach: function (client) {
    client
      .url('http://localhost:3057/performance/services')
      .waitForElementVisible('body.js-enabled.ready.loaded', 20000);
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
      .assert.containsText(this.selectors.filterTable, 'Vehicle tax renewals')
      .setValue(this.selectors.textFilter, 'PAYE')
      .waitForElementVisible(this.selectors.filterTable, 1000)
      .assert.doesNotContainText(this.selectors.filterTable, 'Vehicle tax renewals')
      .assert.containsText(this.selectors.filterTable, 'PAYE transactions')
      .end();
  },

  'Department filter': function (client) {
    client
      .assert.containsText(this.selectors.filterTable, 'Vehicle tax renewals')
      .click('#department option[value="co"]')
      .waitForElementVisible(this.selectors.filterTable, 1000)
      .assert.doesNotContainText(this.selectors.filterTable, 'Vehicle tax renewals')
      .assert.containsText(this.selectors.filterTable, 'e-petition signatures')
      .end();
  },

  'Service gropu filter': function (client) {
    client
      .assert.containsText(this.selectors.filterTable, 'Vehicle tax renewals')
      .click('#service-group option[value="my-service"]')
      .waitForElementVisible(this.selectors.filterTable, 1000)
      .assert.doesNotContainText(this.selectors.filterTable, 'Vehicle tax renewals')
      .assert.containsText(this.selectors.filterTable, 'My transaction')
      .end();
  },

  'Text, Services and Department filter': function (client) {
    client
      .assert.containsText(this.selectors.filterTable, 'Vehicle tax renewals')
      .click('#department option[value="co"]')
      .waitForElementVisible(this.selectors.filterTable, 1000)
      .assert.containsText(this.selectors.filterTable, 'Digital Services Store')
      .assert.containsText(this.selectors.filterTable, 'Digital Marketplace')
      .setValue(this.selectors.textFilter, 'Digital Marketplace')
      .waitForElementVisible(this.selectors.filterTable, 1000)
      .assert.doesNotContainText(this.selectors.filterTable, 'Digital Services Store')
      .assert.containsText(this.selectors.filterTable, 'Digital Marketplace')
      .click('#service-group option[value="my-service"]')
      .waitForElementVisible(this.selectors.filterTable, 1000)
      .assert.containsText(this.selectors.filterTable, 'My transaction')
      .assert.containsText(this.selectors.filterTable, 'Second transaction')
      .end();
  },

  'KPI Values': function (client) {
    client
      .assert.containsText(this.selectors.kpi + ' .number_of_transactions', 'Transactions per year')
      .assert.doesNotContainText(this.selectors.kpi + ' .number_of_transactions', 'no data')
      .assert.containsText(this.selectors.kpi + ' .total_cost', 'Annual cost')
      .assert.doesNotContainText(this.selectors.kpi + ' .total_cost', 'no data')
      .assert.containsText(this.selectors.kpi + ' .cost_per_transaction', 'Cost per transaction')
      .assert.doesNotContainText(this.selectors.kpi + ' .cost_per_transaction', 'no data')
      .assert.containsText(this.selectors.kpi + ' .user_satisfaction_score', 'User satisfaction')
      .assert.doesNotContainText(this.selectors.kpi + ' .user_satisfaction_score', 'no data')
      .assert.containsText(this.selectors.kpi + ' .completion_rate', 'Completion rate')
      .assert.doesNotContainText(this.selectors.kpi + ' .completion_rate', 'no data')
      .end();
  },

  'no data': function (client) {
    client
      .setValue(this.selectors.textFilter, 'no data can be found')
      .assert.containsText(this.selectors.kpi + ' .number_of_transactions', 'Transactions per year')
      .assert.containsText(this.selectors.kpi + ' .number_of_transactions', 'no data')
      .assert.containsText(this.selectors.kpi + ' .total_cost', 'Annual cost')
      .assert.containsText(this.selectors.kpi + ' .total_cost', 'no data')
      .assert.containsText(this.selectors.kpi + ' .cost_per_transaction', 'Cost per transaction')
      .assert.containsText(this.selectors.kpi + ' .cost_per_transaction', 'no data')
      .assert.containsText(this.selectors.kpi + ' .user_satisfaction_score', 'User satisfaction')
      .assert.containsText(this.selectors.kpi + ' .user_satisfaction_score', 'no data')
      .assert.containsText(this.selectors.kpi + ' .completion_rate', 'Completion rate')
      .assert.containsText(this.selectors.kpi + ' .completion_rate', 'no data')
      .end();
  },

  'Clicking on a kpi summary link': function (client) {
    client
      .assert.cssClassPresent(this.selectors.filterTable + ' th[data-key="number_of_transactions"]', 'descending')
      .click(this.selectors.kpi + ' .number_of_transactions .visualisation-moreinfo a')
      .assert.cssClassPresent(this.selectors.filterTable + ' th[data-key="number_of_transactions"]', 'ascending')
      .end();
  }

};
