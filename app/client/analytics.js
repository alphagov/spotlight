(function() {
  'use strict';

  // Load Google Analytics libraries
  GOVUK.Tracker.load();

  // Use document.domain in dev, preview and staging so that tracking works
  // Otherwise explicitly set the domain as www.gov.uk (and not gov.uk).
  var cookieDomain = (document.domain === 'www.gov.uk') ? '.www.gov.uk' : document.domain;

  // Configure profiles, setup custom vars, track initial pageview
  GOVUK.analytics = new GOVUK.Tracker({
    universalId: 'UA-26179049-7',
    classicId: 'UA-26179049-1',
    cookieDomain: cookieDomain
  });

  // Set custom dimensions before tracking pageviews

  if (window.devicePixelRatio) {
    GOVUK.analytics.setDimension(11, window.devicePixelRatio, 'Pixel Ratio', 2);
  }

  // Track initial pageview
  GOVUK.analytics.trackPageview();
})();
