var requirejs = require('requirejs');

var controllerMap = require('../../../app/server/controller_map')();
var get_dashboard_and_render = require('../../../app/server/mixins/get_dashboard_and_render');
var StagecraftApiClient = requirejs('stagecraft_api_client');

describe('get_dashboard_and_render', function () {
  var fakeRenderContent,
      fake_request,
      fake_response,
      api_client_initialize_spy
  beforeEach(function (){
    api_client_initialize_spy = spyOn(StagecraftApiClient.prototype, 'initialize').andCallThrough();
    fakeRenderContent = jasmine.createSpy('fakiefakefakefake');
    var request_attrs = {
      'port': 8989,
      'stagecraftUrl': 'urlURL'
    }
    fake_request = {
      'app': {
        'get': function(key) {
          return request_attrs[key];
        }
      }
    }
    fakeStatusCall = jasmine.createSpy('status'); 
    fake_response = {status: fakeStatusCall};
  });
  it('should set up the correct client_instance', function(){
    client_instance = get_dashboard_and_render(fake_request, fake_response, fakeRenderContent);
    expect(StagecraftApiClient.prototype.initialize).toHaveBeenCalledWith(
      {}, 
      {
        ControllerMap: controllerMap
      });
    expect(client_instance.urlRoot).toEqual('http://localhost:8989/stagecraft-stub/');
    expect(client_instance.stagecraftUrlRoot).toEqual('urlURL/public/dashboards');
  });
  describe('on sync of client_instance', function() {
    it('should set up the correct client_instance', function(){
      client_instance = get_dashboard_and_render(fake_request, fake_response, fakeRenderContent);
      offSpy = spyOn(StagecraftApiClient.prototype, 'off').andCallThrough();
      client_instance.set({'status': 200});
      client_instance.trigger('sync');
      expect(offSpy).toHaveBeenCalled();
      expect(fakeStatusCall).toHaveBeenCalledWith(200);
      expect(fakeRenderContent).toHaveBeenCalledWith(fake_request, fake_response, client_instance);
    });
  });
  describe('on error of client_instance', function() {
    it('it should do nothing', function(){
      client_instance = get_dashboard_and_render(fake_request, fake_response, fakeRenderContent);
      offSpy = spyOn(StagecraftApiClient.prototype, 'off').andCallThrough();
      client_instance.set({'status': 404});
      client_instance.trigger('error');
      expect(offSpy.callCount).toEqual(0);
      expect(fakeStatusCall.callCount).toEqual(0);
      expect(fakeRenderContent.callCount).toEqual(0);
    });
    describe('on second error of client_instance', function() {
      it('it should renderContent correctly', function(){
        client_instance = get_dashboard_and_render(fake_request, fake_response, fakeRenderContent);
        offSpy = spyOn(StagecraftApiClient.prototype, 'off').andCallThrough();
        client_instance.set({'status': 404});
        client_instance.trigger('error');
        client_instance.trigger('error');
        expect(offSpy).toHaveBeenCalled();
        expect(fakeStatusCall).toHaveBeenCalledWith(404);
        expect(fakeRenderContent).toHaveBeenCalledWith(fake_request, fake_response, client_instance);
      });
    });
  });
});
