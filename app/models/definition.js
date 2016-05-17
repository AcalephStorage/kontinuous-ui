import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  content: attr('base64-string'),
  sha: attr('string')
});
