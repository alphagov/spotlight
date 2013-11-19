define([
  'extensions/views/view',
  'd3loader!'
],
function (View, d3) {
  
  var Component = View.extend({
    
    d3: d3,
    
    initialize: function () {
      View.prototype.initialize.apply(this, arguments);
      
      if (_.isFunction(this.interactive)) {
        this.graph.on('hover', function () {
          if (this.interactive.apply(this, arguments)) {
            this.onHover.apply(this, arguments);
          }
        }, this);
      } else if (this.interactive === true) {
        this.graph.on('hover', this.onHover, this);
      }
      
      this.collection.on('change:selected', this.onChangeSelected, this);
    },
    
    moveToFront: function (el) {
      if (_.isFunction(el.node)) {
        el = el.node();
      }
      el.parentNode.appendChild(el);
    },
    
    configs: {},
    
    applyConfig: function (name) {
      var config = this.configs[name];
      if (!config) {
        return;
      }
      _.each(config, function (value, key) {
        this[key] = value;
      }, this);
    },

    render: function () {
      View.prototype.render.apply(this, arguments);
      
      if (!this.componentWrapper) {
        var componentWrapper = this.componentWrapper = this.wrapper.append('g');
        if (this.classed){
          componentWrapper.classed(this.classed, true);
        }
      }
    },
    
    onChangeSelected: function (group, groupIndex, model, index) {},
    
    onHover: function (e) {}
  });

  return Component;
});
