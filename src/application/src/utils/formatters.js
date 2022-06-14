export const formatPercent = (num) => {
  return `${(num * 100).toFixed(2)}%`;
};

export const { format: formatDollars } = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
