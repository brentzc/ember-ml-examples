import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  this.route('main', { path: '/' });
  this.route('image-classifier');
  this.route('head-movements');
  this.route('sentiment-analysis');
});
