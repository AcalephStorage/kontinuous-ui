import Ember from 'ember';

export default Ember.Component.extend({

  classNames: Ember.String.w('ui right internal rail info-box'),

  actions: {
    close() {
      this.sendAction("close");
    }
  }

});
