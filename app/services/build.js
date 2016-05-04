import Ember from 'ember';

export default Ember.Service.extend({

  store: Ember.inject.service(),
  session: Ember.inject.service(),

  newRecord: null,

  new(pipeline) {
    let author = this.get('session.session.content.authenticated.profile.nickname');
    let build = this.get('store').createRecord('build', {author: author, pipeline: pipeline});
    this.set('newRecord', build);
    return build;
  },

  save(record) {
    return record.save();
  }

});
