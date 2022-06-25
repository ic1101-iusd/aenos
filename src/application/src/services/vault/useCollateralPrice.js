import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

import config from 'Constants/config';
import { fromBigInt } from 'Utils/formatters';

const FIVE_MINUTES = 5 * 60 * 1000;

// fetching next price is temporary from the server to simulate price changing through our bot
const useCollateralPrice = ({ vaultActor }) => {
  const [collateralPrice, setCollateralPrice] = useState(0);
  const [collateralNextPrice, setCollateralNextPrice] = useState({ value: 0, time: '--:--' });

  const getCollateralPrice = useCallback(async () => {
    const price = await vaultActor.getCollateralPrice();

    const { data } = await axios.get(`${config.SERVER_HOST}/price/next`);

    setCollateralPrice(fromBigInt(price));

    console.log({ data });
    const date = new Date(data.createdDate);

    setCollateralNextPrice({
      value: data.price,
      time: `${date.getHours()}:${date.getMinutes()}`,
    });
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
    collateralNextPrice,
  };
};

export default useCollateralPrice;
