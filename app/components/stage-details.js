import Ember from 'ember';
import {task} from 'ember-concurrency';

export default Ember.Component.extend({

  classNames: Ember.String.w('ui right internal attached rail half-size'),

  store: Ember.inject.service(),
  stage: Ember.inject.service(),

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

    namespace="acaleph";
    podName="acaleph-dashboard-v2-bvw8l";

    return new Ember.RSVP.Promise((resolve) => {
      let podUrl = `${Configuration.APP.k8sAPI.host}/api/${Configuration.APP.k8sAPI.version}/namespaces/${namespace}/pods/${podName}`;console.log(podUrl);
      Ember.$.ajax(podUrl)
        .then((pod) => {
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
