import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  owner: attr('string'),
  repo: attr('string'),
  events: attr('array'),
  login: attr('string')
});
