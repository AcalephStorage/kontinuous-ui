import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  apiVersion: attr('string'),
  kind: attr('string'),
  name: attr('string'),
  namepsace: attr('string'),
  creationTimestamp: attr('date'),
  spec: attr('object'),
});
