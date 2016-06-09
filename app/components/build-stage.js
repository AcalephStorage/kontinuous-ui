import Ember from 'ember';
import {task} from 'ember-concurrency';

export default Ember.Component.extend({

  tagName: 'li',
  classNames: Ember.String.w('stage'),
  classNameBindings: ['model.status'],

  store: Ember.inject.service(),

  defaultStatusIcon: 'code',
  iconClassMap: {
    'command': 'terminal',
    'docker_build': 'legal',
    'docker_publish': 'upload',
    'wait': 'pause',
    'wait_done': 'right arrow',
  },
  statusIcon: Ember.computed('model.type', function() {
    let type = this.get('model.type');
    let status = this.get('model.status');

    if (type === 'wait' && status === 'SUCCESS') {
      type = 'wait_done';
    }
    return this.iconClassMap[type] || this.defaultStatusIcon;
  }),
  isRunning: Ember.computed.equal('model.status', 'RUNNING'),

  click() {
    let stage = this.get('model');
    if (stage.get('type') === 'wait' && stage.get('status') === 'WAITING') {
      this.sendAction('promptWaitStageMessage', stage);
    } else {
      this.fetchLogs();
      this.sendAction('selectStage', stage);
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    this.removeObserver('model.status', this, this.fetchLogs);
  },

  fetchLogs() {
    let stage = this.get('model');

    if (Ember.isEmpty(stage.get('logFiles'))) {
      let logFetcher = this.get('logFetcher').perform(stage);
      stage.set('logFetcher', logFetcher);
      logFetcher.then((logFiles) => {
        stage.set('logFiles', logFiles);
      });

      if (stage.get('status') === 'PENDING') {
        this.addObserver('model.status', this, this.fetchLogs);
      } else {
        this.removeObserver('model.status', this, this.fetchLogs);
      }
    }
  },

  logFetcher: task(function*(stage) {
    if (stage.get('status') !== 'PENDING' && stage.get('type') != 'wait') {
      let logFiles = yield this.getStageLogs(stage);
      return logFiles;
    }
  }),

  getStageLogs(stage) {
    let query = {
      owner: this.get('pipeline.owner'),
      repo: this.get('pipeline.repo'),
      buildNumber: this.get('build.number'),
      stageIndex: stage.get('index'),
    };

    return this.get('store').query('log', query);
  },

});
