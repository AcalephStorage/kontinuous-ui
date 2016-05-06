import Ember from 'ember';
import {task} from 'ember-concurrency';

export default Ember.Component.extend({

  classNames: Ember.String.w('ui grid full-height'),

  build: Ember.inject.service(),

  buildNumber: "",
  sortByNumberDesc: ['number:desc'],
  all: Ember.computed.sort('pipeline.builds', 'sortByNumberDesc'),
  buildQuery: Ember.computed('buildNumber', function() {
    return {
      owner: this.get('pipeline.owner'),
      repo: this.get('pipeline.repo'),
      build_number: this.get('buildNumber'),
    };
  }),

  willInsertElement() {
    this.addObserver('buildNumber', this, this.getBuildDetails);
    let buildnum = this.get('pipeline.latest_build.number');
    if (buildnum) {
      this.set('buildNumber', buildnum.toString());
    }
  },

  willDestroyElement() {
    this.removeObserver('buildNumber', this, this.getBuildDetails);
  },

  didInsertElement() {
    this.$(".in-header.icon.button").popup({
      variation: "small inverted",
      position: "top right",
      inline: true,
      exclusive: true,
    });
  },

  getBuildDetails() {
    this.get('buildFetcher').perform();
  },

  buildFetcher: task(function * () {
    if (this.get('buildNumber')) {
      yield this.get('build').find(this.get('buildQuery'))
        .then((build) => {
          this.set('model', build);
        });
    }
  }).drop(),

  actions: {
    selectBuild() {
      this.send('unselectStage');
    },
    confirmCreateBuild() {
      this.$('.ui.modal.create-build-confirmation').modal('show');
    },
    createBuild() {
      let p = this.get('pipeline');
      let b = this.get('build').new(p);

      b.save()
        .then(() => {
          this.set('successMessage', 'Successfully created build for pipeline.');
        }, (res) => {
          this.set('errorMessage', res.errors.Message || 'Failed to create build for pipeline.');
        })
        .finally(() => {
          this.get('build').unload(b);
        });
    },
    selectStage(stage) {
      this.send('closePipelineDetails');
      this.set('selectedStage', stage);
    },
    unselectStage() {
      this.set('selectedStage', null);
    },
    viewPipelineDetails() {
      this.send('unselectStage');
      this.set('isViewingPipelineDetails', true);
    },
    closePipelineDetails() {
      this.set('isViewingPipelineDetails', false);
    }
  },

});
