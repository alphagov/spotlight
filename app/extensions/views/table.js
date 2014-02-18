define([
  './view'
],
function (View) {
  return View.extend({
    initialize: function (options) {
      var collection = this.collection = options.collection;

      View.prototype.initialize.apply(this, arguments);

      collection.on('reset add remove sync', this.render, this);

      this.prepareTable();
      this.render();
    },

    prepareTable: function () {
      this.table = $('<table></table>');
      this.table.appendTo(this.$el);
    },

    renderEl: function (elementName, context, value, attr) {
      var element;
      if (context) {
        element = $('<' + elementName + '></' + elementName + '>');
        if (value) {
          element.text(value);
        }
        if (attr) {
          element.attr(attr);
        }
        element.appendTo(context);
      }
      return element;
    },

    // Example Input
    // [[date, no-dig, dig], ['01/02/01', 'meh', 'meh meh']]
    //
    // Example Render
    // <table>
    //   <tr>
    //     <th scope="col">date</th>
    //     <th scope="col">no-dig</th>
    //     <th scope="col">dig</th>
    //   </tr>
    //   <tr>
    //     <td>01/02/01</td>
    //     <td>meh</td>
    //     <td>meh meh</td>
    //   </tr>
    // </table>

    render: function () {
      this.table.empty();
      _.each(this.collection.getDataByTableFormat(), function (row, rowIndex) {

        this.row = this.renderEl('tr', this.table);

        _.each(row, function (cel) {
          var elName = 'td',
              attr;
          if (rowIndex === 0) {
            elName = 'th';
            attr = {scope: 'col'};
          }
          this.renderEl(elName, this.row, cel, attr);
        }, this);

      }, this);
    }
  });
});