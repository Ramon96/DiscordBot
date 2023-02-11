const getKeyByValue = (object, value) => {
  return Object.keys(object).filter((key) => object[key] === value);
};

module.exports = getKeyByValue;
