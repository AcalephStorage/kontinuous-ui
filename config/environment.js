/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'kontinuous-ui',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      kontinuousAPI: {
        host: process.env.KONTINUOUS_API_URL,
        version: process.env.KONTINUOUS_API_VERSION || 'v1',
      },

      k8sAPI: {
        host: process.env.KUBERNETES_API_URL,
        version: process.env.KUBERNETES_API_VERSION || 'v1',
      }
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  ENV['ember-simple-auth'] = {
    authenticationRoute: 'login',
  };

  ENV['auth0-ember-simple-auth'] = {
    clientID: process.env.AUTH0_CLIENT_ID,
    domain: process.env.AUTH0_DOMAIN
  };

  ENV['contentSecurityPolicy'] = {
    'font-src': "'self' data: cdn.auth0.com fonts.gstatic.com",
    'style-src': "'self' 'unsafe-inline' https://fonts.googleapis.com",
    'script-src': "'self' 'unsafe-eval' https://cdn.auth0.com https://acaleph.auth0.com",
    'connect-src': "'self' http://localhost:* https://acaleph.auth0.com",
    'img-src': "'self' *.gravatar.com https://avatars.githubusercontent.com"
  };

  return ENV;
};
