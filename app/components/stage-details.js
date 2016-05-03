import Ember from 'ember';
import DS from 'ember-data';
import {task} from 'ember-concurrency';

export default Ember.Component.extend({

  classNames: Ember.String.w('ui right internal rail stage-details'),

  isRunning: Ember.computed.equal('model.status', 'RUNNING'),
  isDone: Ember.computed.match('model.status', /^(SUCCESS|FAIL)$/),

  didUpdate() {
    let tabs = this.$(".stage-tabs .item");
    if (tabs.length) {
      let tabName = tabs[0].dataset.tab;
      tabs.tab('change tab', tabName);
    }
  },

  actions: {
    showLogs(log) {
      this.changeTab(log.title);
    },
    close() {
      this.sendAction('close');
    }
  },

  changeTab: function(tab) {
    this.$(".stage-tabs .item").tab("change tab", tab);
  },

});
