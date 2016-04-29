import Ember from 'ember';

export default Ember.Component.extend({

  build: Ember.inject.service(),

  willInsertElement() {
    this.set('build._all', this.get('pipeline.builds'));
    this.get('pipeline.builds').then(() => {
      let latest = this.get('build.latest');
      this.set('model', latest);
    });
  },

  isLastBuild: Ember.computed('model', function() {
    return this.get('model') === this.get('build.all.lastObject');
  }),

  isFirstBuild: Ember.computed('model', function() {
    return this.get('model') === this.get('build.all.firstObject');
  }),

  reselectStage() {
    let currentIndex = this.get('selectedStage.index');
    let stage = this.get('model.stages').findBy('index', currentIndex);
    if (stage) {
      this.send('selectStage', stage);
    } else {
      this.send('unselectStage');
    }
  },

  actions: {
    previousBuild() {
      if (this.get('isFirstBuild')) {
        return;
      }
      let index = this.get('build.all').indexOf(this.get('model'));
      let prev = this.get('build.all').objectAt(index - 1);
      this.set('model', prev);
      this.reselectStage();
    },
    nextBuild() {
      if (this.get('isLastBuild')) {
        return;
      }
      let index = this.get('build.all').indexOf(this.get('model'));
      let next = this.get('build.all').objectAt(index + 1);
      this.set('model', next);
      this.reselectStage();
    },
    createBuild() {
      let p = this.get('pipeline');
      let b = this.get('build').new(p);

      b.save()
        .then(() => {
          this.set('successMessage', 'Successfully created build for pipeline.');
        }, (res) => {
          this.set('errorMessage', res.errors.Message || 'Failed to create build for pipeline.');
        });
    },
    selectStage(stage) {
      this.set('model.pipeline', this.get('pipeline'));
      this.set('selectedStage', stage);
    },
    unselectStage() {
      this.set('selectedStage', null);
    }
  },

});
