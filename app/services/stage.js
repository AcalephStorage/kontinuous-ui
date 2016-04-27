import Ember from 'ember';
import {task} from 'ember-concurrency';

export default Ember.Service.extend({

  logFetcher: task(function * (stage) {
    if (Ember.String.w('SUCCESS FAIL').contains(stage.get('status'))) {
      return yield this.getDoneLogs(stage);
    } else {
      return yield this.getPodLogs(stage);
    }
  }),

  getDoneLogs(stage) {

  }
});
