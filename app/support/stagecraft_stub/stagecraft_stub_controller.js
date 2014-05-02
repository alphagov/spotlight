var fs = require('fs');

module.exports =  function (req, res) {
  var paramPath = req.params[0],
      filePath = 'app/support/stagecraft_stub/responses/' + paramPath + '.json';
  if (fs.existsSync(filePath)) {
    var content = fs.readFileSync(filePath);
    res.send(JSON.parse(content));
  } else {
    res.status(404);
    res.send({error: "No such stub exists: " + filePath});
  }
};
