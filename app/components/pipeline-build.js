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
    createBuild() {
      let b = this.get('build').new();

      b.save()
        .then(() => {
          this.set('successMessage', 'Successfully created build for pipeline.');
        }, (res) => {
          this.set('errorMessage', res.errors.Message || 'Failed to create build for pipeline.');
        });
    },
    selectStage(stage) {
      this.set('selectedStage', stage);
    }
  },

});
