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
    var promise;
    switch(stage.get('status')) {
      case 'RUNNING':
        promise = this.getPodLogs(stage);
        break;
      case 'SUCCESS':
      case 'FAIL':
        promise = this.getDoneLogs(stage);
        break;
      default:
        return;
    }
    return yield promise.then((logFiles) => {
      stage.set('logFiles', logFiles);
    });
  }),

  getPodLogs(stage) {
    let namespace = stage.get('pod_namespace'),
      podName = stage.get('pod_name');

    return new Ember.RSVP.Promise((resolve) => {
      Ember.RSVP.hash({
        pod: this.get('store').queryRecord('k8s-pod', { namespace: namespace, name: podName })
      })
      .then((hash) => {
        let containers = hash.pod.get('spec.containers').getEach('name');
        let logs = [];

        containers.forEach((name) => {
          let q = { namespace: namespace, podName: podName, container: name };
          let store = this.get('store');
          let log = DS.PromiseObject.create({
            promise: store.queryRecord('k8s-log', q)
          });

          log.reopen({
            title: name,
            reloader: task(function*() {
              yield store.queryRecord('log', q)
                .then((l) => {
                  log.set('details', l.get('details'));
                });
            }).drop()
          });

          logs.push(log);
        });
        resolve(logs);
      }, () => {
        resolve([]);
      });
    });
  },

  getDoneLogs(stage) {
    let adapter = this.get('store').adapterFor('stage'),
      query = {
        owner: this.get('pipeline.owner'),
        repo: this.get('pipeline.repo'),
        buildNumber: this.get('build.number'),
        stageIndex: stage.get('index')
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
