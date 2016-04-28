import Ember from 'ember';

export default Ember.Component.extend({

  classNames: Ember.String.w('ui right internal attached rail half-size'),

  stage: Ember.inject.service(),

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
