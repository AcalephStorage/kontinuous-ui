import Ember from 'ember';

export function duration(params) {
  let nano = 1000000000;
  let start = moment.unix(params[0]/nano),
    end = moment.unix(params[1]/nano);

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
