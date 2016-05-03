import Ember from 'ember';

export function duration(params) {
  let start = moment(params[0]),
    end = moment(params[1]);

  if (!start.isValid() || !end.isValid()) {
    return "";
  }

  let diff = end.diff(start, 'seconds');
  let words = moment.duration(diff, 's').humanize().split(' ');
  if (Ember.String.w('a an').contains(words[0])) {
    return `${diff} ${words.get('lastObject')}`;
  } else {
    return words.join(' ');
  }
}

export default Ember.Helper.helper(duration);
