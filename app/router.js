import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('login');
  this.route('pipelines', {path: ''}, function() {
    this.route('create', {path: '/new'});
  });
  this.route('pipeline', {path: ':owner/:repo'});
});

export default Router;
