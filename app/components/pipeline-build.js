import Ember from 'ember';
import {task,timeout} from 'ember-concurrency';

export default Ember.Component.extend({

  classNames: Ember.String.w('ui columned grid'),

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
  isViewingStage: Ember.computed.bool('selectedStage'),
  infoBoxVisible: Ember.computed.or('isViewingPipelineDetails', 'isEditingPipeline', 'isViewingStage'),

  init() {
    this._super(...arguments);
    this.set('isViewingPipelineDetails', false);
    this.set('isEditingPipeline', false);
  },

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
    this.set('model', undefined);
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
      let build = yield this.get('build').find(this.get('buildQuery'));
      this.set('model', build);
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

  stageStatusUpdater: task(function * (stage) {
    let b = this.get('model');
    Ember.assign(stage, { build: b });
    stage.save()
      .finally(() => {
        this.get('buildFetcher').cancelAll();
        this.get('buildFetcher').perform();
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
      yield timeout(3000); // 3-second interval
    }
  }).drop(),

  closeInfoBox() {
    this.send('unselectStage');
    this.send('closePipelineDetails');
    this.send('closePipelineEditor');
  },

  actions: {
    historyHide() {
      return Ember.isPresent(this.get('model'));
    },
    selectBuild() {
      this.closeInfoBox();
    },
    confirmCreateBuild() {
      this.closeInfoBox();
      this.$('.ui.modal.create-build-confirmation').modal('show');
    },
    createBuild() {
      this.get('buildCreator').perform();
    },
    selectStage(stage) {
      this.send('closePipelineDetails');
      this.send('closePipelineEditor');
      this.set('selectedStage', stage);
    },
    unselectStage() {
      this.set('selectedStage', null);
    },
    promptWaitStageMessage(stage) {
      this.closeInfoBox();
      this.set('selectedWaitStage', stage);
      this.$('.ui.modal.wait-stage-prompt').modal('show');
    },
    startWaitStage() {
      let stage = this.get('selectedWaitStage');
      this.get('stageStatusUpdater').perform(stage);
    },
    viewPipelineDetails() {
      this.send('unselectStage');
      this.send('closePipelineEditor');
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
