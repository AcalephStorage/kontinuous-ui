import Ember from 'ember';

export default Ember.Component.extend({

  classNames: Ember.String.w('ui borderless attached menu main-menu'),

  session: Ember.inject.service(),
  appNamespace: Ember.inject.service(),

  actions: {
    logout () {
      this.get('session').invalidate();
    }
  }

});
