import Ember from 'ember';

export default Ember.Component.extend({

  router: Ember.inject.service('-routing'),

  click() {
    let routeName = this.get('routeName');
    this.get('router').transitionTo(routeName, this.getRouteContext());
  },

  getRouteContext() {
    let model = this.get('model');
    if (Ember.isNone(model)) {
      return null;
    } else {
      return [model];
    }
  }

});
