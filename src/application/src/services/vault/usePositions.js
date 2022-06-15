import { useCallback, useEffect, useState } from 'react';
import { Principal } from '@dfinity/principal';
import { toast } from 'react-toastify';

import { toBigInt, fromBigInt } from 'Utils/formatters';
import { canisterId as vaultCanisterId } from 'Declarations/protocol';
import { useCoins } from 'Services/coins';
import logger from 'Utils/logger';

const usePositions = ({ vaultActor, principle }) => {
  const [positions, setPositions] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);

  const { btc, updateBalances } = useCoins();

  const createPosition = useCallback(async (collateralAmount, stableAmount) => {
    try {
      console.log({ collateralAmount, stableAmount, btc });

      const collateral = toBigInt(collateralAmount);
      const stable = toBigInt(stableAmount);

      const approve = await toast.promise(
        btc.actor.approve(
          Principal.fromText(vaultCanisterId),
          collateral
        ),
        {
          pending: `Approving ${collateralAmount} BTC`,
          success: `Approved successfully`,
          error: {
            render({ error }) {
              logger.error('Approving BTC', error);

              return 'Something went wrong. Try again later.';
            }
          },
        }
      );

      console.log({ approve });

      const res = await toast.promise(
        vaultActor.createPosition(collateral, stable),
        {
          pending: `Use ${collateralAmount} BTC as collateral to generate ${stableAmount} AIS`,
          success: `${stableAmount} AIS generated successfully`,
          error: {
            render({ error }) {
              logger.error('CreatePosition', error);

              return 'Something went wrong. Try again later.';
            }
          },
        }
      );

      const position = {
        ...res.ok,
        collateralAmount: fromBigInt(res.ok.collateralAmount),
        stableAmount: fromBigInt(res.ok.stableAmount),
      };

      console.log(position);

      setCurrentPosition(position);
      setPositions(current => [...current, position]);

      await updateBalances();
    } catch (e) {
      logger.error(e);
    }
  }, [vaultActor, principle, btc]);

  const getAccountPositions = useCallback(async () => {
    try {
      const positions = (await vaultActor.getAccountPositions(principle)).map(position => {
        return {
          ...position,
          collateralAmount: fromBigInt(position.collateralAmount),
          stableAmount: fromBigInt(position.stableAmount),
        };
      });

      console.log({ positions });

      setPositions(positions);

      // TODO: Temporary setting currentPosition on init
      if (!currentPosition) {
        setCurrentPosition(positions[0]);
      }
    } catch (e) {
      logger.error(e);
    }
  }, [vaultActor, principle, currentPosition]);

  useEffect(() => {
    if (principle && vaultActor) {
      getAccountPositions();
    }
  }, [vaultActor]);

  return {
    createPosition,
    positions,
    currentPosition,
  };
};

export default usePositions;
