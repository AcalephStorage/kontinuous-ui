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
  },
  statusIcon: Ember.computed('model.type', function() {
    let type = this.get('model.type');
    return this.iconClassMap[type] || this.defaultStatusIcon;
  }),
  isRunning: Ember.computed.equal('model.status', 'RUNNING'),

  click() {
    this.fetchLogs();
    this.sendAction('selectStage', this.get('model'));
  },

  fetchLogs() {
    let stage = this.get('model');

    if (Ember.isEmpty(stage.get('logFiles'))) {
      let logFetcher = this.get('logFetcher').perform(stage);
      stage.set('logFetcher', logFetcher);
      logFetcher.then((logFiles) => {
        stage.set('logFiles', logFiles);
      });
    }
  },

  logFetcher: task(function*(stage) {
    if (stage.get('status') !== 'PENDING') {
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
