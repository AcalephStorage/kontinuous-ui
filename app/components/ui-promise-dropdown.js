import SemanticDropdown from 'semantic-ui-ember/components/ui-dropdown';

export default SemanticDropdown.extend({

  firstShow: true,
  classNameBindings: ['waitList.isPending:loading'],

  didInsertElement() {
    this._super();
  },

  onShow() {
    if (this.get('firstShow') && !this.get('waitList.isPending')) {
      this.$().dropdown('set selected', this.get('value'));
      this.set('firstShow', false);
    }
  },

  onNoResults() {
    return !this.get('waitList.isPending');
  }

});
