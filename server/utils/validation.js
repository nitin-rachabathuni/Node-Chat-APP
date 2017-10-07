var isRealString = str => {
  return typeof str === 'string' && str.trim().length > 0;
};

var isUniqueName = (name, namesArray) => {
  var count = 0;
  namesArray.forEach(names => {
    if (names.toUpperCase() == name.toUpperCase()) {
      count++;
    }
  });
  if (count > 0) {
    return false;
  }
  return true;
};

module.exports = { isRealString, isUniqueName };
