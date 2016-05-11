import Ember from 'ember';
import {task,timeout} from 'ember-concurrency';

export default Ember.Component.extend({

  classNames: Ember.String.w('ui right internal rail stage-details'),

  isRunning: Ember.computed.equal('model.status', 'RUNNING'),
  isDone: Ember.computed.match('model.status', /^(SUCCESS|FAIL)$/),

  didRender() {
    let tabs = this.$(".stage-tabs .item");
    let activeTab = this.$(".stage-tabs .active.item");
    if (tabs.length && !activeTab.length) {
      let log = this.get('model.logFiles.firstObject');
      this.send('showLogs', log);
    }
  },

  actions: {
    showLogs(log) {
      this.get('logsPoller').cancelAll();
      this.changeTab(log.get('title'));
      this.get('logsPoller').perform();
    },
    close() {
      this.sendAction('close');
    }
  },

  logsPoller: task(function*() {
    if (this.get('isDone')) {
      return;
    }
    do {
      yield this.updateLogsContent();
      yield timeout(5000); // 5-second interval
    }
    while(!this.get('isDone'));
  }).drop(),


  updateLogsContent() {
    let stage = this.get('model');
    return Ember.RSVP.hash({logFiles: stage.get('logFetcher.task').perform(stage)})
      .then((hash) => {
        stage.set('logFiles', hash.logFiles);
      });
  },

  changeTab: function(tab) {
    this.$(".stage-tabs .item").tab("change tab", tab);
  },

});
