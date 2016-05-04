import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  name: attr('string'),
  type: attr('string'),
  index: attr('number'),
  params: attr('object'),
  labels: attr('object'),
  started: attr('unix-date'),
  finished: attr('unix-date'),
  status: attr('string'),
  pod_namespace: attr('string'),
  job_name: attr('string'),
  pod_name: attr('string')
});
