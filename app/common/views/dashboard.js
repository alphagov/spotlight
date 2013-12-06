define([
  'common/views/govuk',
  'stache!common/templates/dashboard'
],
function (GovUkView, contentTemplate) {
  var DashboardView = GovUkView.extend({
    contentTemplate: contentTemplate,

    extendRelatedPagesContext: function (context) {
      _.each(context.related_pages, function (page, i){
        context.related_pages[i].formatted_public_timestamp = this.getFormattedTimestamp(page.public_timestamp);
      }, this);
      return context;
    },

    getFormattedTimestamp: function (timestamp) {
      return this.getMoment(timestamp).format("Do MMMM YYYY");
    },

    getContent: function () {
      context = this.extendRelatedPagesContext(this.model.toJSON());

      context.modules = _.map(this.moduleInstances, function (module) {
        return module.html;
      }).join('');

      return this.contentTemplate(context);
    },

    getPageTitleItems: function () {
      return [
        this.model.get('title'),
        this.model.get('strapline')
      ];
    }
  });

  return DashboardView;
});
