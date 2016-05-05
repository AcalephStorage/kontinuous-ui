import DS from 'ember-data';

export default DS.Store.extend({

  adapterFor(modelName) {
    if (modelName.startsWith('k8s-')) {
      switch(modelName) {
        case 'k8s-log':
          return this._super(modelName);
        default:
          return this._super('k8s');
      }
    }
    return this._super(modelName);
  }

});
