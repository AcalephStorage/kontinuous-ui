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
        version: process.env.KONTINUOUS_API_VERSION || 'v1'
      },
      githubClient: {
        id: process.env.GITHUB_CLIENT_ID
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

  ENV['torii'] = {
    sessionServiceName: 'session',
    providers: {
      'kontinuous-github-token': {
        apiKey: ENV.APP.githubClient.id,
        scope: 'user:email,repo',
        redirectUri: process.env.AUTH_CALLBACK
      }
    }
  };

  ENV['ember-simple-auth'] = {
    routeAfterAuthentication: 'pipelines',
    routeIfAlreadyAuthenticated: 'pipelines',
    authenticationRoute: 'login',
  };

  ENV['contentSecurityPolicy'] = {
    'font-src': "'self' data: fonts.gstatic.com",
    'style-src': "'self' 'unsafe-inline' https://fonts.googleapis.com",
    'script-src': "'self' 'unsafe-eval'",
    'connect-src': "'self' http://localhost:*",
    'img-src': "'self' *.gravatar.com https://avatars.githubusercontent.com"
  };

  return ENV;
};
