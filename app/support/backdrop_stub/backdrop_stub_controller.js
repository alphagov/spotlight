define([
  'support/backdrop_stub/response_fetcher'
], function (ResponseFetcher) {
  return function (req, res) {
    var fetcher = new ResponseFetcher();
    var json = fetcher.fetchJson(req);
    if (json) {
      return res.json(json);
    } else {
      res.status(404);
      return res.json({error: "no matching response found"});
    }
  };
});
