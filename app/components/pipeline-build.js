import Ember from 'ember';

export default Ember.Component.extend({

  pipeline: Ember.inject.service(),
  build: Ember.inject.service(),

  actions: {
    previousBuild() {
      this.get('build').prev();
    },
    nextBuild() {
      this.get('build').next();
    },
    selectStage(stage) {
      this.set('selectedStage', stage);
    }
  }

});
