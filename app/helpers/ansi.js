import Ember from 'ember';

export function ansi(params) {
  let content = params[0];
  let converted = ansi_up.ansi_to_html(content);

  return Ember.String.htmlSafe(converted);

}

export default Ember.Helper.helper(ansi);
