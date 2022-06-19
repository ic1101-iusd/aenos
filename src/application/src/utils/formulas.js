const COLLATERAL_INDEX = 1.15;

const formulas = {
  getAvailableDollars(collateralAmount, collateralPrice, collateralRatio) {
    return (collateralAmount * collateralPrice) / (collateralRatio * COLLATERAL_INDEX) || 0;
  },
  // return health factor (< 1 = liquidation)
  getCollateralRatio(collateralAmount, collateralPrice, stableAmount) {
    return (collateralAmount * collateralPrice) / (stableAmount * COLLATERAL_INDEX) || 0;
  },
  getLiquidationPrice(collateralAmount, stableAmount) {
    return (stableAmount * COLLATERAL_INDEX) / collateralAmount || 0;
  },
  getBuyingPower(collateralAmount, collateralPrice, collateralRatio) {
    const avDollars = this.getAvailableDollars(collateralAmount, collateralPrice, collateralRatio);

    if (avDollars < 0.1) {
      return avDollars;
    }

    return avDollars + this.getBuyingPower(avDollars / collateralPrice, collateralPrice, collateralRatio);
  },
};

export default formulas;
