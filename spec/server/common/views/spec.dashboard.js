define([
  'common/views/dashboard',
  'extensions/models/model'
],
function (DashboardView, Model) {
  describe('DashboardView', function () {

    var view, model;
    beforeEach(function () {
      model = new Model({
        foo: 'bar',
        dashboardType: 'service',
        service: {
          'title': 'Carer\'s Allowance'
        }
      });
      view = new DashboardView({
        model: model,
        contentTemplate: jasmine.createSpy().andReturn('rendered')
      });
      view.moduleInstances = [
        { html: '<div>module 1</div>'},
        { html: '<div>module 2</div>'}
      ];
    });

    describe('getContent', function () {

      it('render content template with model data and module content', function () {
        var result = view.getContent();
        expect(result).toEqual('rendered');
        var context = view.contentTemplate.argsForCall[0][0];
        expect(context.foo).toEqual('bar');
        expect(context.modules).toEqual('<div>module 1</div><div>module 2</div>');
      });
    });

    describe('getPageHeader', function () {

      it('calculates correct page header for services', function () {
        model.set({
          service: {
            title: 'Carer\'s Allowance'
          }
        });
        view.dashboardType = 'service';
        expect(view.getPageHeader()).toEqual('Carer\'s Allowance');
      });

      it('calculates correct page header for transactions', function () {
        model.set({
          service: {
            title: 'Carer\'s Allowance'
          },
          transaction: {
            title: 'applications'
          }
        });
        view.dashboardType = 'transaction';
        expect(view.getPageHeader()).toEqual('Carer\'s Allowance applications');
      });

    });


    describe('getTagline', function () {

      it('calculates correct tagline for departments', function () {
        model.set({
          dashboardType: 'department',
          department: {
            title: 'Department for Work and Pensions'
          }
        });
        view.dashboardType = 'department';
        expect(view.getTagline()).toEqual('This dashboard shows information about how selected services run by the <strong>Department for Work and Pensions</strong> are currently performing.');
      });

      it('calculates correct tagline for agencies', function () {
        model.set({
          agency: {
            title: 'Pensions Ombudsman'
          }
        });
        view.dashboardType = 'agency';
        expect(view.getTagline()).toEqual('This dashboard shows information about how selected services run by the <strong>Pensions Ombudsman</strong> are currently performing.');
      });

      it('calculates correct tagline for services', function () {
        model.set({
          service: {
            title: 'Carer\'s Allowance'
          },
          transaction: {
            title: 'applications'
          }
        });
        view.dashboardType = 'service';
        expect(view.getTagline()).toEqual('This dashboard shows information about how the <strong>Carer\'s Allowance</strong> service is currently performing.');
      });

      it('calculates correct tagline for transactions', function () {
        model.set({
          service: {
            title: 'Carer\'s Allowance'
          },
          transaction: {
            title: 'applications'
          }
        });
        view.dashboardType = 'transaction';
        expect(view.getTagline()).toEqual('This dashboard shows information about how the <strong>Carer\'s Allowance applications</strong> service is currently performing.');
      });

      it('calculates correct tagline for policies', function () {
        model.set({
          other: {
            title: 'Housing',
            tagline: 'The government is helping local councils and developers work with local communities to plan and build better places to live for everyone.'
          }
        });
        view.dashboardType = 'other';
        expect(view.getTagline()).toEqual('The government is helping local councils and developers work with local communities to plan and build better places to live for everyone.');
      });

    });

    describe('getPageTitle', function () {

      it('calculates page title from title and strapline', function () {
        model.set({
          service: {
            title: 'Title'
          },
          'strapline': 'Service dashboard'
        });
        view.dashboardType = 'service';
        expect(view.getPageTitle()).toEqual('Title - Service dashboard - GOV.UK');
      });

      it('calculates page title from title alone', function () {
        model.set({
          service: {
            title: 'Title'
          }
        });
        view.dashboardType = 'service';
        expect(view.getPageTitle()).toEqual('Title - Performance - GOV.UK');
      });
    });

    describe('getBreadcrumbCrumbs', function () {

      it('calculates correct crumbs for departments', function () {
        model.set({
          dashboardType: 'department',
          department: {
            title: 'Department for Work and Pensions'
          }
        });
        view.dashboardType = 'department';
        expect(view.getBreadcrumbCrumbs()).toEqual([
          {'path': '/performance', 'title': 'Performance'}
        ]);
      });

      it('calculates correct crumbs for agencies', function () {
        model.set({
          department: {
            title: 'Department for Work and Pensions'
          }
        });
        view.dashboardType = 'agency';
        expect(view.getBreadcrumbCrumbs()).toEqual([
          {'path': '/performance', 'title': 'Performance'},
          {'title': 'Department for Work and Pensions'}
        ]);
      });

      it('calculates correct crumbs for services, including agency if defined', function () {
        model.set({
          department: {
            title: 'Department for Work and Pensions'
          },
          agency: {
            title: 'Pensions Ombudsman'
          }
        });
        view.dashboardType = 'service';
        expect(view.getBreadcrumbCrumbs()).toEqual([
          {'path': '/performance', 'title': 'Performance'},
          {'title': 'Department for Work and Pensions'},
          {'title': 'Pensions Ombudsman'}
        ]);
      });

      it('calculates correct crumbs for transactions', function () {
        model.set({
          department: {
            title: 'Department for Work and Pensions'
          },
          service: {
            title: 'Carer\'s Allowance'
          }
        });
        view.dashboardType = 'transaction';
        expect(view.getBreadcrumbCrumbs()).toEqual([
          {'path': '/performance', 'title': 'Performance'},
          {'title': 'Department for Work and Pensions'},
          {'title': 'Carer\'s Allowance'}
        ]);
      });

      it('calculates correct crumbs for policies', function () {
        model.set({
          policy: {
            title: 'Housing',
            tagline: 'The government is helping local councils and developers work with local communities to plan and build better places to live for everyone.'
          }
        });
        view.dashboardType = 'policy';
        expect(view.getBreadcrumbCrumbs()).toEqual([
          {'path': '/performance', 'title': 'Performance'}
        ]);
      });
    });

  });
});
