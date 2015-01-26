define([
    'client/views/services',
    'common/collections/dashboards',
    'extensions/models/model',
    'jquery'
  ],
  function (ServicesView, DashboardCollection, Model, $) {

    describe('filter', function () {

      beforeEach(function () {
        var $el = $('<div class="visualisation-table"><table><thead><tr><td class="" width=""><a href="/performance/bis-apprenticeship-vacancies-applications">Apprenticeships: applications for vacancies</a></td><td class="integer" width=""></td><td class="currency" width=""></td><td class="currency" width=""></td><td class="percentage" width=""></td><td class="percentage" width=""></td><td class="percentage" width=""></td></tr><tr><th scope="col" data-key="titleLink" aria-sort="none" width=""><a href="#">Transaction name</a></th> <th scope="col" data-key="transactions-per-year" aria-sort="ascending" class="asc" width=""><a href="#">Transactions per year</a></th><th scope="col" data-key="total-cost" aria-sort="none" width=""><a href="#">Cost per year</a></th><th scope="col" data-key="cost-per-transaction" aria-sort="none" width=""><a href="#">Cost per transaction</a></th><th scope="col" data-key="digital-take-up" aria-sort="none" width=""><a href="#">Digital take-up</a></th><th scope="col" data-key="user-satisfaction-score" aria-sort="none" width=""><a href="#">User satisfaction</a></th><th scope="col" data-key="completion-rate" aria-sort="none" width=""><a href="#">Completion rate</a></th></tr></thead><tbody><tr><td class="" width=""><a href="/performance/dwp-attendance-allowance-claims-maintained">Attendance Allowance: existing claims</a></td><td class="integer" width="">89,074,589</td><td class="currency" width=""></td><td class="currency" width="">£306</td><td class="percentage" width=""></td><td class="percentage" width="">0.75</td><td class="percentage" width="">0.35</td></tr><tr><td class="" width=""><a href="/performance/dwp-carers-allowance-claims-maintained">Carers Allowance: existing claims</a></td><td class="integer" width="">23,534,666</td><td class="currency" width="">£345,983,458</td><td class="currency" width="">£250</td><td class="percentage" width=""></td><td class="percentage" width="">0.63</td><td class="percentage" width="">0.73</td></tr></table></div>');

        this.config = {
          model: new Model(),
          collection: new DashboardCollection([
              {
                "department": {
                  "abbr": "BIS",
                  "title": "Department for Business, Innovation and Skills"
                },
                "agency": {
                  "abbr": "SFA",
                  "title": "Skills Funding Agency"
                },
                "slug": "bis-apprenticeship-vacancies-applications",
                "title": "Apprenticeships: applications for vacancies",
                "total-cost": null,
                "transactions-per-year": null,
                "cost-per-transaction": null,
                "tx-digital-takeup": null,
                "digital-takeup": null,
                "completion-rate": null,
                "user-satisfaction-score": null,
                "titleLink": "<a href=\"/performance/bis-apprenticeship-vacancies-applications\">Apprenticeships: applications for vacancies</a>"
              },
              {
                "department": {
                  "abbr": "DWP",
                  "title": "Department for Work and Pensions"
                },
                "slug": "dwp-attendance-allowance-claims-maintained",
                "title": "Attendance Allowance: existing claims",
                "total-cost": null,
                "transactions-per-year": 89074589,
                "cost-per-transaction": 306,
                "tx-digital-takeup": 0.2,
                "digital-takeup": 0.25,
                "completion-rate": 0.35,
                "user-satisfaction-score": 0.75,
                "titleLink": "<a href=\"/performance/dwp-attendance-allowance-claims-maintained\">Attendance Allowance: existing claims</a>"
              },
              {
                "department": {
                  "abbr": "DWP",
                  "title": "Department for Work and Pensions"
                },
                "slug": "dwp-carers-allowance-claims-maintained",
                "title": "Carer's Allowance: existing claims",
                "total-cost": 345983458,
                "transactions-per-year": 23534666,
                "cost-per-transaction": 250,
                "tx-digital-takeup": 0.41,
                "digital-takeup": 0.43,
                "completion-rate": 0.73,
                "user-satisfaction-score": 0.63,
                "titleLink": "<a href=\"/performance/dwp-carers-allowance-claims-maintained\">Carer's Allowance: existing claims</a>"
              }
            ],
            {
              axes: {
                x: {
                  key: 'titleLink',
                  label: 'Transaction name'
                },
                y: [
                  {
                    key: 'transactions-per-year',
                    label: 'Transactions per year',
                    format: 'integer'
                  },
                  {
                    key: 'total-cost',
                    label: 'Cost per year',
                    format: 'currency'
                  },
                  {
                    label: 'Cost per transaction',
                    key: 'cost-per-transaction',
                    format: 'currency'
                  },
                  {
                    label: 'Digital take-up',
                    key: 'digital-take-up',
                    format: 'percentage'
                  },
                  {
                    label: 'User satisfaction',
                    key: 'user-satisfaction-score',
                    format: 'percentage'
                  },
                  {
                    label: 'Completion rate',
                    key: 'completion-rate',
                    format: 'percentage'
                  }
                ]
              }
            })
        };
      });

      it('listens to filter on the model', function () {
        spyOn(ServicesView.prototype, 'filter');
        this.services = new ServicesView(this.config);
        this.services.render();
        this.services.model.trigger('change:filter');
        expect(this.services.filter).toHaveBeenCalled();
      });

      it('shows only rows that match the supplied filter', function () {
        this.services = new ServicesView(this.config);
        this.services.render();
        this.services.model.set('filter', 'vacancies');
        expect(this.services.$el.find('tbody td a').first().html()).toEqual('Apprenticeships: applications for vacancies');
      });

    });

  });