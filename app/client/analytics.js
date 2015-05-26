(function() {
  'use strict';

  // Load Google Analytics libraries
  GOVUK.Analytics.load();

  // Use document.domain in dev, preview and staging so that tracking works
  // Otherwise explicitly set the domain as www.gov.uk (and not gov.uk).
  var cookieDomain = (document.domain === 'www.gov.uk') ? '.www.gov.uk' : document.domain;

  // Configure profiles, setup custom vars, track initial pageview
  GOVUK.analytics = new GOVUK.Analytics({
    universalId: 'UA-26179049-1',
    cookieDomain: cookieDomain
  });

  // Set custom dimensions before tracking pageviews

  if (window.devicePixelRatio) {
    GOVUK.analytics.setDimension(11, window.devicePixelRatio);
  }

  // Track initial pageview
  GOVUK.analytics.trackPageview();
})();
