import Ember from 'ember';
import {task,timeout} from 'ember-concurrency';

export default Ember.Component.extend({

  classNames: Ember.String.w('ui grid main-content'),

  pipeline: Ember.inject.service(),

  pipelinesPoller: task(function*() {
    while (true) {
      this.get('pipelinesFetcher').perform();
      yield timeout(60000); // 1-minute interval
    }
  }).on('init').drop(),

  pipelinesFetcher: task(function*() {
    yield this.get('pipeline').fetchAll();
  }),

  didInsertElement() {
    this.$(".in-header.icon.button").popup({
      variation: "small inverted",
      position: "top right",
      inline: true,
      exclusive: true,
    });
  },

});
