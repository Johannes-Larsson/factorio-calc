/*
 * takes a string like 1/60m meaning 1 per 60 minutes 
 * (equivalent to 1/1h or 1/h or 2/2h or 1/3600s or 1/3600, and so on) 
 * and returns a number representing the amount per second, 0.00027777778 in this exaple.
 * returns -1 if there is an error parsing.
 */
module.exports = {
  intp: function (interval) {
    let unit = interval.slice(-1);
    const hasUnit = ("dhms".indexOf(unit) != -1);
    if (!hasUnit) {
      if (isNaN(unit)) {
        return -1; // tried to specify unrecognized unit
      } else {
        unit = 's';
      }
    }

    let s;

    if (interval.indexOf('/') == -1) { // is not a fraction
      if (hasUnit) {
        return -1; // not fraction with unit is not allowed
      } else {
        let ret = parseFloat(interval);
        if (ret != NaN) {
          return ret;
        } else {
          return -1;
        }
      }
    } else { // is a fraction
      if (hasUnit) {
        s = interval.slice(0, -1).split('/');
      } else {
        s = interval.split('/');
      }
      let t = parseFloat(s[0]);
      let n = parseFloat(s[1]);
      if (isNaN(t)) {
        return -1;
      }
      if (isNaN(n)) {
        n = 1;
      }

      const times = {
        "d": 24*3600,
        "h": 3600,
        "m": 60,
        "s": 1
      };

      if (unit in times) {
        return t/(n*times[unit]);
      } else {
        return -1;
      }
    }
  }
};
