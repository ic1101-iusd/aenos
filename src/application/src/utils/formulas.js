const COLLATERAL_INDEX = 1.5;

const formulas = {
  collateralPrice: 0,
  collateralIndex: COLLATERAL_INDEX,
  collateralRatio: 3,
  collateralAmount: 0,

  getAvailableDollars(collateralAmount) {
    console.log({
      collateralAmount: this.collateralAmount,
      price: this.collateralPrice,
      index: this.collateralIndex,
      ratio: this.collateralRatio,
    })
    return (collateralAmount * this.collateralPrice) / (this.collateralIndex * this.collateralRatio) || 0;
  },
  // return health factor (< 1 = liquidation)
  getLiquidationRation(dollars) {
    return (this.collateralAmount * this.collateralPrice) / (dollars * this.collateralIndex) || 0;
  },
  getLiquidationPrice() {
    return (this.getAvailableDollars(this.collateralAmount) * this.collateralIndex) / this.collateralAmount || 0;
  },
  getBuyingPower(collateralAmount) {
    const avDollars = this.getAvailableDollars(collateralAmount);

    console.log({ avDollars})
    if (avDollars < 0.1) {
      return avDollars;
    }

    return avDollars + this.getBuyingPower(avDollars / this.collateralPrice);
  },
};

export default formulas;
