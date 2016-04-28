import Ember from 'ember';

export default Ember.Component.extend({

  pipeline: Ember.inject.service(),
  build: Ember.inject.service(),
  stage: Ember.inject.service(),

  didInsertElement() {
    this.set('build.current', null);
    this.set('stage.current', null);
    this.get('pipeline.current.builds').then(() => {
      let latest = this.get('build.latest');
      this.set('build.current', latest);
    });
  },

  actions: {
    previousBuild() {
      let n = this.get('selectedStage.index');
      this.get('build').prev();
      let stage = this.get('build.current.stages').findBy('index', n);
      if (stage) {
        this.send('selectStage', stage);
      } else {
        this.send('unselectStage');
      }
    },
    nextBuild() {
      let n = this.get('selectedStage.index');
      this.get('build').next();
      let stage = this.get('build.current.stages').findBy('index', n);
      if (stage) {
        this.send('selectStage', stage);
      } else {
        this.send('unselectStage');
      }
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
      this.get('stage').setCurrent(stage);
    },
    unselectStage() {
      this.set('selectedStage', null);
      this.set('stage.current', null);
    }
  },

});
