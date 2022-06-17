import { useEffect, useState, useCallback } from 'react';

const FIVE_MINUTES = 5 * 60 * 1000;

const useCollateralPrice = ({ vaultActor }) => {
  const [collateralPrice, setCollateralPrice] = useState(0);

  const getCollateralPrice = useCallback(async () => {
    const price = await vaultActor.getCollateralPrice();

    setCollateralPrice(Number(price));
  }, [vaultActor]);

  useEffect(() => {
    if (vaultActor) {
      getCollateralPrice();

      const interval = setInterval(() => getCollateralPrice(), FIVE_MINUTES);

      return () => {
        clearInterval(interval);
      };
    }
  }, [vaultActor]);

  return {
    collateralPrice,
  };
};

export default useCollateralPrice;
