import EmberRouter from '@ember/routing/router';
import config from 'ember-mfe-shell/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('mfe1');
  this.route('comfe');
});
