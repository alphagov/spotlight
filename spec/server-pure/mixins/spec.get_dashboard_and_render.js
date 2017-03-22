var requirejs = require('requirejs');

var controllerMap = require('../../../app/server/controller_map')();
var get_dashboard_and_render = require('../../../app/server/mixins/get_dashboard_and_render');
var StagecraftApiClient = requirejs('stagecraft_api_client');

describe('get_dashboard_and_render', function () {
  var fakeRenderContent,
      fake_request,
      fake_response,
      fakeStatusCall,
      api_client_initialize_spy;
  beforeEach(function (){
    api_client_initialize_spy = spyOn(StagecraftApiClient.prototype, 'initialize').andCallThrough();
    fakeRenderContent = jasmine.createSpy('fakiefakefakefake');
    var request_attrs = {
      'port': 8989,
      'stagecraftUrl': 'urlURL'
    };
    fake_request = {
      get: function(key) {
        return {
          'Request-Id':'Xb35Gt',
          'GOVUK-Request-Id': '1231234123'
        }[key];
      },
      'app': {
        'get': function(key) {
          return request_attrs[key];
        }
      },
      originalUrl: ''
    };

    fakeStatusCall = jasmine.createSpy('status');
    fake_response = {status: fakeStatusCall};
  });
  it('should set up the correct client_instance', function(){
    var client_instance = get_dashboard_and_render(fake_request, fake_response, fakeRenderContent);
    expect(StagecraftApiClient.prototype.initialize).toHaveBeenCalledWith(
      {
        params: {}
      },
      {
        ControllerMap: controllerMap,
        requestId: 'Xb35Gt',
        govukRequestId: '1231234123'
      });
    expect(client_instance.stagecraftUrlRoot).toEqual('urlURL/public/dashboards');
  });
  it('should escape XSS attempts in queries', function(){
    fake_request.originalUrl = 'http://localhost:3057/performance/central-government-websites?sortby=percentOfTotal(count:sum)%22%27--!%3E%3C/Title/%3C/Style/%3C/script/%3C/Textarea/%3C/Noscr%20ipt/%3C/Pre/%3C/Xmp%3E%3CSvg/Onload=confirm`OPENBUGBOUNTY`%3E&sortorder=descending';
    var client_instance = get_dashboard_and_render(fake_request, fake_response, fakeRenderContent);
    expect(StagecraftApiClient.prototype.initialize).toHaveBeenCalledWith(
      {
        params: {
          sortby: 'percentOfTotal(count:sum)&#34;\'--!&gt;&lt;/Title/&lt;/Style/&lt;/script/&lt;/Textarea/&lt;/Noscr ipt/&lt;/Pre/&lt;/Xmp&gt;&lt;Svg/Onload=confirm`OPENBUGBOUNTY`&gt;',
          sortorder: 'descending'
        }
      },
      {
        ControllerMap: controllerMap,
        requestId: 'Xb35Gt',
        govukRequestId: '1231234123'
      });
    expect(client_instance.stagecraftUrlRoot).toEqual('urlURL/public/dashboards');
  });
  describe('on sync of client_instance', function() {
    it('should set up the correct client_instance', function(){
      var client_instance = get_dashboard_and_render(fake_request, fake_response, fakeRenderContent);
      var offSpy = spyOn(StagecraftApiClient.prototype, 'off').andCallThrough();
      client_instance.set({'status': 200});
      client_instance.trigger('sync');
      expect(offSpy).toHaveBeenCalled();
      expect(fakeStatusCall).toHaveBeenCalledWith(200);
      expect(fakeRenderContent).toHaveBeenCalledWith(fake_request, fake_response, client_instance);
    });
  });
  describe('on error of client_instance', function() {
    it('it should return an error', function(){
      var client_instance = get_dashboard_and_render(fake_request, fake_response, fakeRenderContent);
        var offSpy = spyOn(StagecraftApiClient.prototype, 'off').andCallThrough();
        client_instance.set({'status': 404});
        client_instance.trigger('error');
        client_instance.trigger('error');
        expect(offSpy).toHaveBeenCalled();
        expect(fakeStatusCall).toHaveBeenCalledWith(404);
        expect(fakeRenderContent).toHaveBeenCalledWith(fake_request, fake_response, client_instance);
    });
  });
});
