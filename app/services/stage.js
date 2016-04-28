import Ember from 'ember';
import {task} from 'ember-concurrency';
import Configuration from '../config/environment';

export default Ember.Service.extend({

  pipeline: Ember.inject.service(),
  build: Ember.inject.service(),
  store: Ember.inject.service(),

  sortKey: ['index'],
  all: Ember.computed.sort('build.current.stages', 'sortKey'),
  current: null,

  setCurrent(record) {
    this.get('logFetcher').cancelAll();
    this.set('current', record);
    let f = this.get('logFetcher').perform(record);
    record.set('logFetcher', f);
  },

  logFetcher: task(function*(record) {
    if (this.get('current.status') === 'RUNNING' && Ember.isEmpty(this.get('current.podLogs'))) {
      console.log("To do: show pod logs");
      // yield this.getPodLogs(record)
      //   .then((podLogs) => {
      //     console.log(podLogs);
      //     record.set('podLogs', podLogs);
      //     record.set('logFiles', null);
      //   });
    } else if (Ember.String.w('SUCCESS FAIL').contains(this.get('current.status')) && Ember.isEmpty(this.get('current.logFiles'))) {
      yield this.getDoneLogs(record)
        .then((logFiles) => {
          record.set('podLogs', null);
          record.set('logFiles', logFiles);
        }, () => {
          record.get('logFetcher').cancel();
        });
    }
  }),

  getPodLogs(record) {
    let namespace = record.get('pod_namespace'),
      podName = record.get('podName');

    namespace="acaleph";
    podName="acaleph-dashboard-v2-bvw8l";

    return new Ember.RSVP.Promise((resolve) => {
      let podUrl = `${Configuration.APP.k8sAPI.host}/api/${Configuration.APP.k8sAPI.version}/namespaces/${namespace}/pods/${podName}`;
      console.log(podUrl);
      Ember.$.ajax(podUrl)
        .then((pod) => {
          console.log(pod);
        });
    });
  },

  getDoneLogs(record) {
    let adapter = this.get('store').adapterFor('stage'),
      query = {
        owner: this.get('pipeline.current.owner'),
        repo: this.get('pipeline.current.repo'),
        buildNumber: this.get('build.current.number'),
        stageIndex: record.get('index')
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
        }, () => ([]));
    });
  },

});
