import Ember from 'ember';
import {task,timeout} from 'ember-concurrency';

export default Ember.Component.extend({

  classNames: Ember.String.w('ui grid main-content'),

  build: Ember.inject.service(),
  notify: Ember.inject.service(),

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
    this.setLatestBuild();
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
    this.get('stagesPoller').cancelAll();
    this.get('stagesPoller').perform();
  },

  setLatestBuild() {
    let buildnum = this.get('pipeline.latest_build.number');
    if (buildnum) {
      this.set('buildNumber', buildnum.toString());
    }
  },

  buildFetcher: task(function * () {
    if (this.get('buildNumber')) {
      yield this.get('build').find(this.get('buildQuery'))
        .then((build) => {
          this.set('model', build);
        });
    }
  }).drop(),

  buildCreator: task(function * () {
    let notify = this.get('notify');
    let note = notify.info('Sending request to create build for pipeline.', {closeAfter: null});

    let p = this.get('pipeline');
    let b = this.get('build').new(p);

    yield b.save()
      .then(() => {
        note.set('visible', false);
        notify.success('Successfully created build for pipeline.');
      }, (res) => {
        note.set('visible', false);
        notify.error(res.errors.Message || 'Failed to create build for pipeline.');
      })
      .finally(() => {
        this.get('build').unload(b);
        this.get('pipeline').reload()
          .then((p) => {
            p.get('builds').reload();
            this.set('pipeline', p);
            this.setLatestBuild();
          });
      });
  }).drop(),

  buildsPoller: task(function*() {
    while(true) {
      yield this.get('pipeline.builds').reload();
      yield timeout(10000); // 10-second interval
    }
  }).on('init').drop(),

  stagesPoller: task(function*() {
    while(true) {
      this.get('buildFetcher').perform();
      yield timeout(5000); // 5-second interval
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
      this.get('buildCreator').perform();
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
    },
    editPipeline() {
      this.send('unselectStage');
      this.send('closePipelineDetails');
      this.set('isEditingPipeline', true);
    },
    closePipelineEditor() {
      this.set('isEditingPipeline', false);
    }
  },

});
