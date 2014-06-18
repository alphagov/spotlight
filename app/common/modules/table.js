define(function () {
  return {
    requiresSvg: false,
    hasTable: false,

    visualisationOptions: function () {
      return {
        sortBy: this.model.get('sort-by'),
        sortOrder: this.model.get('sort-order') || 'descending',
        url: this.url
      };
    }

  };
});
