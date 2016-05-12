import Ember from 'ember';

export default Ember.Service.extend({

  store: Ember.inject.service(),
  session: Ember.inject.service(),

  newRecord: null,

  new(pipeline) {
    // TODO: use profile.nickname, file request for kontinuous
    let author = this.get('session.session.content.authenticated.user_name');
    let build = this.get('store').createRecord('build', {author: author, pipeline: pipeline});
    this.set('newRecord', build);
    return build;
  },

  save(record) {
    return record.save();
  },

  unload(record) {
    record.unloadRecord();
  },

  find(query) {
    return this.get('store').queryRecord('build', query);
  }

});
