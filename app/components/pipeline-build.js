import Ember from 'ember';

export default Ember.Component.extend({

  classNames: Ember.String.w('ui grid full-height'),

  build: Ember.inject.service(),

  sortByNumberDesc: ['number:desc'],
  all: Ember.computed.sort('pipeline.builds', 'sortByNumberDesc'),

  willInsertElement() {
    this.get('pipeline.builds').then(() => {
      let model = this.get('all.firstObject');
      this.set('model', model);
      this.addStageDesigns();
    });
  },

  didInsertElement() {
    this.$(".in-header.icon.button").popup({
      variation: "small inverted",
      position: "top right"
    });
  },

  addStageDesigns() {
    this.get('pipeline.builds').forEach((build) => {
      build.get('stages').forEach((stage) => {
        let iconClassMap = {
          'command': 'terminal',
          'docker_build': 'legal',
          'docker_publish': 'upload',
        };
        let type = stage.get('type');
        stage.set('statusIcon', iconClassMap[type] || 'terminal');
      });
    });
  },

  actions: {
    selectBuild(component, value) {
      this.send('unselectStage');
      let model = this.get('all').findBy('number', parseInt(value));
      this.set('model', model);
    },
    confirmCreateBuild() {
      this.$('.ui.modal.create-build-confirmation').modal('show');
    },
    createBuild() {
      let p = this.get('pipeline');
      let b = this.get('build').new(p);

      b.save()
        .then(() => {
          this.set('successMessage', 'Successfully created build for pipeline.');
        }, (res) => {
          this.set('errorMessage', res.errors.Message || 'Failed to create build for pipeline.');
        });
    },
    selectStage(stage) {
      this.set('model.pipeline', this.get('pipeline'));
      this.set('selectedStage', stage);
    },
    unselectStage() {
      this.set('selectedStage', null);
    }
  },

});
