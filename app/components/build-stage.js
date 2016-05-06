import Ember from 'ember';
import DS from 'ember-data';
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

  click() {
    this.fetchLogs();
    this.sendAction('selectStage', this.get('model'));
  },

  fetchLogs() {
    let stage = this.get('model');

    if (Ember.isEmpty(stage.get('logFiles'))) {
      let l = this.get('logFetcher').perform(stage);
      stage.set('logFetcher', l);
    }
  },

  logFetcher: task(function*(stage) {
    if (stage.get('status') !== 'PENDING') {
      return yield this.getStageLogs(stage)
        .then((logFiles) => {
          stage.set('logFiles', logFiles);
        });
    }
  }),

  getStageLogs(stage) {
    let adapter = this.get('store').adapterFor('stage'),
      query = {
        owner: this.get('pipeline.owner'),
        repo: this.get('pipeline.repo'),
        buildNumber: this.get('build.number'),
        stageIndex: stage.get('index'),
      };

    return new Ember.RSVP.Promise((resolve) => {
      adapter._getLogs(query)
        .then((logFiles) => {
          logFiles.forEach((logFile) => {
            let filename = logFile.filename.split('/');
            logFile.title = filename.objectAt(filename.length - 1);
            logFile.details = atob(logFile.content);
          });
          resolve(logFiles);
        }, () => {
          resolve([]);
        });
    });
  },

});
