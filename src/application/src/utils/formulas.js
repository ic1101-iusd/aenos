const COLLATERAL_INDEX = 1.5;

export const getAvailableDollars = (collateralAmount, collateralPrice) => {
  return (collateralAmount * collateralPrice) / COLLATERAL_INDEX ?? 0;
};

// return health factor (< 1 = liquidation)
export const getLiquidationRation = (collateralAmount, collateralPrice, dollars) => {
  return (collateralAmount * collateralPrice) / (dollars * COLLATERAL_INDEX) ?? 0;
};

export const getLiquidationPrice = (collateralAmount, dollars) => {
  return (dollars * 1.5) / collateralAmount ?? 0;
};

export const getBuyingPower = (collateralAmount, collateralPrice) => {
  const avDollars = getAvailableDollars(collateralAmount, collateralPrice);

  if (avDollars < 0.1) {
    return avDollars;
  }

  return avDollars + getBuyingPower(avDollars / collateralPrice, collateralPrice);
};
