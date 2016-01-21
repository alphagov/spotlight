module.exports = {
    get_department_name: function (service) {
        if ("department" in service){
          department_name = service.department.title;
        } else if ("agency" in service) {
          department_name = service.agency.title;
        } else {
          department_name = '<abbr title="Unknown">—</abbr>';
        }
        return department_name;
    }
};
