import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  number: attr('number'),
  status: attr('string'),
  create: attr('date'),
  started: attr('date'),
  finished: attr('date'),
  current_stage: attr('number'),
  branch: attr('string'),
  commit: attr('string'),
  author: attr('string'),
  event: attr('string'),
  clone_url: attr('string')
});
