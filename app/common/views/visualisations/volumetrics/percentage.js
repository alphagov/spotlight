define([
  'common/views/visualisations/volumetrics/target',
  'extensions/models/model'
],
function (TargetView, Model) {
  var PercentageView = TargetView.extend({
    getTargetPercent: function (previous) {
      var target = this.target;
      var total = 0;
      var equalToTarget = 0;

      this.collection.each(function (model) {
        if (previous) {
          var previousModel = model.get('values');
          var previousModelValue = new Model(previousModel[previousModel.length - 2]).get(this.valueAttr);
          total += previousModelValue;

          if (target === model.get(this.pinTo)) {
            equalToTarget += previousModelValue;
          }
        } else {
          total += model.get(this.valueAttr);

          if (target === model.get(this.pinTo)) {
            equalToTarget += model.get(this.valueAttr);
          }
        }
      }, this);

      return equalToTarget / total;
    }
  });

  return PercentageView;
});