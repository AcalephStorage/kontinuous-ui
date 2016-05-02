import Ember from 'ember';

export default Ember.Component.extend({

  router: Ember.inject.service('-routing'),

  attributeBindings: ['data-content'],

  click(e) {
    if (e.target.tagName !== 'A' && e.target.target !== '_blank') {
      let routeName = this.get('routeName');
      this.get('router').transitionTo(routeName, this.getRouteContext());
    }
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
