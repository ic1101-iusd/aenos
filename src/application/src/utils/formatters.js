const DEFAULT_DECIMALS = 8;

export const formatPercent = (num) => {
  return `${(num * 100).toFixed(2)}%`;
};

export const { format: formatDollars } = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const { format: formatCoins } = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
});

export const formatStable = (num) => {
  const formattedNum = formatCoins(num);

  return `${formattedNum} iUSD`;
};

export const toBigInt = (num, decimals = DEFAULT_DECIMALS) => {
  return Math.floor(num * 10**decimals);
};

export const fromBigInt = (num, decimals = DEFAULT_DECIMALS) => {
  return Number(num) / 10**decimals;
};
