define([
  'extensions/collections/collection',
  'lodash'
],
function (Collection, _) {
  return Collection.extend({
    comparator: 'title',

    initialize: function(models) {
      Collection.prototype.initialize.apply(this, arguments);
      this.departmentList = this.getPropertyList(models, 'department');
      this.agencyList = this.getPropertyList(models, 'agency');
      this.departmentsAndAgencies = this.departmentList.concat(this.agencyList);
      this.serviceGroupList = this.getPropertyList(models, 'service');
    },

    agencyValid: function(agencyFilter) {
      var valid = _.map(this.agencyList, this.getSlug);
      return _.include(valid, agencyFilter);
    },

    departmentValid: function(departmentFilter) {
      var valid = _.map(this.departmentList, this.getSlug);
      console.log('{{{}}}', valid);
      return _.include(valid, departmentFilter);
    },

    serviceGroupValid: function(serviceGroupFilter) {
      var valid = _.map(this.serviceGroupList, this.getSlug);
      return _.include(valid, serviceGroupFilter);
    },

    sanitizeServiceGroup: function(serviceGroup) {
      serviceGroup = serviceGroup || {};
      if (this.serviceGroupValid(serviceGroup)) {
        return serviceGroup;
      } else {
        return null;
      }
    },

    sanitizeDepartmentOrAgency: function(departmentOrAgency) {
      if(departmentOrAgency === null || departmentOrAgency === undefined) {
        return departmentOrAgency;
      }

      var isAgency = departmentOrAgency.indexOf('agency:') === 0;

      if (isAgency && !this.agencyValid(departmentOrAgency.replace('agency:', ''))) {
        return null;
      }

      if (!isAgency && !this.departmentValid(departmentOrAgency)) {
        return null;
      }

      return departmentOrAgency;
    },

    filterServices: function (filter) {
      filter = filter || {};
      var textFilter = (filter.text || '').toUpperCase(),
          departmentFilter = (filter.department || null),
          serviceGroupFilter = (filter.serviceGroup || null);


      var filteredDashboards = this.filter(function (dashboard) {
        var title = dashboard.get('title').toUpperCase(),
          department = dashboard.get('department') || { title: '', abbr: '' },
            agency = dashboard.get('agency') || {title: '', abbr: ''},
            serviceGroup = dashboard.get('service') || {title: '', abbr: '', slug: ''};

        // Remove the dashboard from the list if it doesn't match the text filter
        var textSearchFields = [title, department.abbr.toUpperCase(), department.title.toUpperCase()];
        if (textFilter && textSearchFields.join(' ').indexOf(textFilter) === -1) {
          return false;
        }

        if (departmentFilter) {
          if (departmentFilter.indexOf('agency:') === 0) {
            if (this.getSlug(agency) !== departmentFilter.replace('agency:', '')) {
              return false;
            }
          } else {
            if (this.getSlug(department) !== departmentFilter) {
              return false;
            }
          }
        }
        if (serviceGroupFilter && serviceGroup.slug !== serviceGroupFilter) {
          return false;
        }

        return true;
      }, this);

      return filteredDashboards;
    },

    getSlug: function (organisation) {
      if (organisation.slug) {
        return organisation.slug;
      } else if (organisation.abbr) {
        return organisation.abbr.toLowerCase().replace(/ /g, '-');
      } else if (organisation.title) {
        return organisation.title.toLowerCase().replace(/ /g, '-');
      } else {
        return 'unknown-organisation';
      }
    },

    filterDashboards: function () {
      var types = _.isArray(arguments[0]) ? arguments[0] : _.toArray(arguments);
      return _.map(this.filter(function (service) {
        return types.indexOf(service.get('dashboard-type')) > -1;
      }), function (m) { return m.toJSON(); });
    },

    getPropertyList: function (models, prop) {
      var values = _.pluck(models, prop);
      values = _.filter(values, _.identity);
      values = _.sortBy(values, 'title');
      values = _.uniq(values, true, function (o) {
        return o.title;
      });
      /* each item should have a slug provided by the API, but in case it
      doesn't, provide a fallback */
      values = _.map(values, _.bind(function (a) {
        return _.extend({
          slug: this.getSlug(a)
        }, a);
      }, this));

      return values;
    },

    getDepartmentFilterTitle: function(departmentFilter) {
      var departmentFilterObject;

      if (departmentFilter) {
        departmentFilter = departmentFilter.replace('agency:', '');
        departmentFilterObject = _.find(this.departmentsAndAgencies, {slug: departmentFilter});
      }
      return (departmentFilterObject && departmentFilterObject.title) || '';
    },

    getServiceGroupFilterTitle: function(serviceGroupFilter) {
      var serviceGroupFilterObject = _.find(this.serviceGroupList, {slug: serviceGroupFilter});
      return (serviceGroupFilterObject && serviceGroupFilterObject.title) || '';
    }

  }, {
    SERVICES: ['transaction', 'high-volume-transaction', 'service-group'],
    CONTENT: ['content'],
    OTHER: ['other']
  });
});
