const getKeyByValue = (object: { [x: string]: number }, value: number) => {
  return Object.keys(object).filter((key) => object[key] === value);
};

export default getKeyByValue;
