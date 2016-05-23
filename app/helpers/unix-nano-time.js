import Ember from 'ember';

export function duration(params) {
  let [time] = params;

  if (time) {
    return moment.unix(time/1000000000).format("MMM D, YYYY hh:mm:ss A");
  }
}

export default Ember.Helper.helper(duration);
