import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  filename: attr('string'),
  title: attr('string'),
  content: attr('string'),
});
