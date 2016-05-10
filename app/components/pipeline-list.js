import Ember from 'ember';

export default Ember.Component.extend({

  classNames: Ember.String.w('ui grid full-height'),

  pipeline: Ember.inject.service(),

  didInsertElement() {
    this.$(".in-header.icon.button").popup({
      variation: "small inverted",
      position: "top right",
      inline: true,
      exclusive: true,
    });
  },

});
