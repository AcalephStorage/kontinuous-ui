import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import {hasMany,belongsTo} from 'ember-data/relationships';

export default Model.extend({
  number: attr('number'),
  status: attr('string'),
  created: attr('number'),
  started: attr('number'),
  finished: attr('number'),
  current_stage: attr('number'),
  branch: attr('string'),
  commit: attr('string'),
  author: attr('string'),
  event: attr('string'),
  clone_url: attr('string'),
  stages: hasMany('stage', {async: true}),
  pipeline: belongsTo('pipeline'),
});
