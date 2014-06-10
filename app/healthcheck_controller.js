module.exports = function (request, response) {
  response.set('Cache-Control', 'no-cache');
  response.send({status: 'ok'});
};
