import SemanticModalComponent from 'semantic-ui-ember/components/ui-modal';
import Ember from 'ember';
import {task} from 'ember-concurrency';

export default SemanticModalComponent.extend({

  name: 'pipeline-create',
  classNameBindings: ['name'],
  closable: false,
  observeChanges: true,

  router: Ember.inject.service('-routing'),
  pipeline: Ember.inject.service(),
  notify: Ember.inject.service(),

  errorMessage: null,

  actions: {
    selectRepo(_, value, text, $el) {
      if (Ember.isPresent($el)) {
        var nameArr = value.split("/"),
          owner = nameArr[0],
          name = nameArr[1];

        this.set('pipeline.newRecord.owner', owner);
        this.set('pipeline.newRecord.repo', name);
      }
    }
  },

  newPipeline() {
    this.get('pipeline').new();
  },

  unloadPipeline() {
    let p = this.get('pipeline.newRecord');
    this.get('pipeline').unload(p);
  },

  closeModal() {
    this.$().modal('hide');
    this.get('router').transitionTo('pipelines');
  },

  pipelineCreator: task(function*() {
    let p = this.get('pipeline.newRecord');
    yield this.get('pipeline').save(p);
  }).drop(),


  didInsertElement() {
    this._super();
    this.$().modal('show');
  },

  onVisible() {
    this._super();
    this.newPipeline();
  },

  onApprove() {
    this.set('errorMessage', null);
    this.get('pipelineCreator').perform()
      .then(() => {
        this.unloadPipeline();
        this.get('pipeline').fetchAll();
        this.get('notify').success("Successfully created pipeline.");
        this.closeModal();
      }, (res) => {
        if (res.message && res.message.indexOf("An adapter cannot assign a new id to a record that already has an id") !== -1) {
          this.closeModal();
        } else {
          this.set('errorMessage', res.errors.Message || "There was an error creating the pipeline.");
        }
      });

    return false;
  },

  onDeny() {
    this.unloadPipeline();
    this.closeModal();
  },

});
