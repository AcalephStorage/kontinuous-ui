import Ember from 'ember';
import {task} from 'ember-concurrency';
import Configuration from '../config/environment';

export default Ember.Component.extend({

  classNames: Ember.String.w('ui right internal rail stage-details'),

  pipeline: Ember.inject.service(),
  store: Ember.inject.service(),
  notify: Ember.inject.service(),

  definition: null,
  commit: {
    message: "",
    option: "commit",
  },

  actions: {
    close() {
      this.sendAction('close');
    },
    updateDefinition() {
      this.get('definitionUpdater').perform();
    }
  },

  definitionFetcher: task(function*() {
    let query = this.get('model').getProperties('repo', 'owner');
    let definition = yield this.get('store').queryRecord('definition', query);
    this.set('definition', definition);
  }).on('init').drop(),

  definitionUpdater: task(function*() {
    this.set('definition.pipeline', this.get('model'));
    yield this.get('definition').save()
      .then(() => {
        this.get('notify').success('Successfully updated `.pipeline.yml`.');
      }, (res) => {
        this.get('notify').error(res.errors.Message || 'Failed to update `.pipeline.yml`.');
      })
  }).drop(),

});
