function validateDate(date: string) {
  var matches = /^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/.exec(date);
  if (matches == null) return false;
  var d = Number(matches[1]);
  var m = Number(matches[2]) - 1;
  var y = Number(matches[3]);
  var composedDate = new Date(y, m, d);
  return (
    composedDate.getDate() == d &&
    composedDate.getMonth() == m &&
    composedDate.getFullYear() == y
  );
}

export default validateDate;
