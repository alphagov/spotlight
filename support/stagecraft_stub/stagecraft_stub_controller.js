define(function () {
  var fs = requirejs('fs');
  
  return function (req, res) {
    var paramPath = req.params[0],
        filePath = 'support/stagecraft_stub/responses/' + paramPath + '.json';
    if (fs.existsSync(filePath)) {
      var content = fs.readFileSync(filePath);
      res.send(JSON.parse(content));
    } else {
      res.send({error: "No such stub exists: " + filePath});
    }
  }
});
