import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  owner: attr('string'),
  name: attr('string'),
  full_name: attr('string'),
  avatar_url: attr('string'),
  default_branch: attr('string')
});
