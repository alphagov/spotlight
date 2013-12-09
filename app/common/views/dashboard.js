define([
  'common/views/govuk',
  'stache!common/templates/dashboard'
],
function (GovUkView, contentTemplate) {
  var DashboardView = GovUkView.extend({
    contentTemplate: contentTemplate,

    extendRelatedPagesContext: function (context) {
      if(context.related_pages){
        _.each(context.related_pages, function (page, i){
          context.related_pages[i].formatted_public_timestamp = this.getFormattedTimestamp(page.public_timestamp);
        }, this);
        context.additional_copy_class = "with_related_pages";
      }
      return context;
    },

    getFormattedTimestamp: function (timestamp) {
      return this.getMoment(timestamp).format("Do MMMM YYYY");
    },

    getContent: function () {
      var context = this.extendRelatedPagesContext(this.model.toJSON());

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
