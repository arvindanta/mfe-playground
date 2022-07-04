import EmberRouter from '@ember/routing/router';
import config from 'ember-octane-mfe/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {});
