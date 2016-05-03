import Ember from 'ember';
import DS from 'ember-data';
import {task} from 'ember-concurrency';

export default Ember.Component.extend({

  classNames: Ember.String.w('ui right internal rail stage-details'),

  store: Ember.inject.service(),

  willInsertElement() {
    this.get('logFetcher').cancelAll();
    this.fetchLogs();
    this.addObserver('model.index', this, this.fetchLogs);
  },

  willDestroyElement() {
    this.removeObserver('model.index', this, this.fetchLogs);
  },

  actions: {
    showLogs(log) {
      this.changeTab(log.title);
    },
    close() {
      this.sendAction('close');
    }
  },

  logFetcher: task(function*() {
    let stage = this.get('model');
    let status = stage.get('status');

    var promise;
    if (status === 'RUNNING') {
      promise = this.getPodLogs(stage);
    } else if (Ember.String.w('SUCCESS FAIL').contains(status) && Ember.isEmpty(stage.get('logFiles'))) {
      promise = this.getDoneLogs(stage);
    } else {
      return;
    }

    return yield promise.then((logFiles) => {
      stage.set('logFiles', logFiles);
    });
  }),

  fetchLogs() {
    let l = this.get('logFetcher').perform();
    this.set('model.logFetcher', l);
  },

  getPodLogs(stage) {
    let namespace = stage.get('pod_namespace'),
      podName = stage.get('podName');

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
        owner: this.get('build.pipeline.owner'),
        repo: this.get('build.pipeline.repo'),
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

  changeTab: function(tab) {
    this.$(".stage-tabs .item").tab("change tab", tab);
  },

});
