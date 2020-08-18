const getAverage = (...items: number[]) => {
  if (items.length === 0) {
    return NaN;
  }

  const sum = items.reduce((a, b) => a + b, 0);

  return sum / items.length;
};

export { getAverage };
