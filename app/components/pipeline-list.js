import Ember from 'ember';

export default Ember.Component.extend({

  classNames: Ember.String.w('ui grid container'),

  pipeline: Ember.inject.service(),

});
