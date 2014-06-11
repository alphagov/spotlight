var healthcheck = require('../../app/healthcheck_controller');

describe('Health Check', function () {

  it('respond with "ok"', function () {
    var request = 'not important',
        response = jasmine.createSpyObj('response', ['send', 'set']);

    healthcheck(request, response);

    expect(response.send).toHaveBeenCalledWith({status: 'ok'});
  });

  it('has an explicit caching policy', function () {
    var request = 'not important',
        response = jasmine.createSpyObj('response', ['send', 'set']);

    healthcheck(request, response);

    expect(response.set).toHaveBeenCalledWith('Cache-Control', 'no-cache');
  });

});
