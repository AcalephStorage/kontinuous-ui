import SemanticModalComponent from 'semantic-ui-ember/components/ui-modal';
import Ember from 'ember';

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
    let p = this.get('pipeline.newRecord');

    p.save()
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
