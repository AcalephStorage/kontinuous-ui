import Ember from 'ember';

export function duration(params) {
  let start = moment(params[0]),
    end = moment(params[1]);

  if (!start.isValid() || !end.isValid()) {
    return "";
  }

  let diff = end.diff(start, 'seconds');
  if (diff.length) {
    return moment.duration(diff, 's').humanize();
  } else {
    return '';
  }
}

export default Ember.Helper.helper(duration);
