function validateDate(date) {
  var matches = /^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/.exec(date);
  if (matches == null) return false;
  var d = matches[1];
  var m = matches[2] - 1;
  var y = matches[3];
  var composedDate = new Date(y, m, d);
  return (
    composedDate.getDate() == d &&
    composedDate.getMonth() == m &&
    composedDate.getFullYear() == y
  );
}

module.exports = validateDate;
