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

  // tasks
  //
  pipelineCreator: task(function*() {
    let p = this.get('pipeline.newRecord');
    yield this.get('pipeline').save(p);
  }).drop(),


  // function overrides
  //
  didInsertElement() {
    this._super();
    this.$().modal('show');
  },

  onVisible() {
    this._super();
    this.newPipeline();
  },

  onApprove() {
    this.get('pipelineCreator').perform()
      .then(() => {
        this.$().modal('hide');
        this.get('router').transitionTo('pipelines');
      }, (res) => {
        this.set('errorMessage', res.errors.Message);
      });

    return false;
  },

  onDeny() {
    this.unloadPipeline();
    this.$().modal('hide');
    this.get('router').transitionTo('pipelines');
  },

});
