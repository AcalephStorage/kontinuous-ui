import Ember from 'ember';
import UILinkToComponent from './ui-link-to';

export default UILinkToComponent.extend({

  classNames: Ember.String.w('ui link card'),
  classNameBindings: ['model.latest_build.status'],

  routeName: 'pipeline',

});
