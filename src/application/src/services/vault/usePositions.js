import { useCallback, useEffect } from 'react';
import { Principal } from '@dfinity/principal';
import { toast } from 'react-toastify';

import { toBigInt } from 'Utils/formatters';
import { canisterId as vaultCanisterId } from 'Declarations/protocol';
import { useCoins } from 'Services/coins';
import logger from 'Utils/logger';

const usePositions = ({ vaultActor, principle }) => {
  const { btc, updateBalances } = useCoins();

  const createPosition = useCallback(async (collateralAmount, stableAmount) => {
    try {
      console.log({ collateralAmount, stableAmount, btc });

      const collateral = toBigInt(collateralAmount);
      const stable = toBigInt(stableAmount);

      const approve = toast.promise(
        await btc.actor.approve(
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

      const res = toast.promise(
        await vaultActor.createPosition(collateral, stable),
        {
          pending: `Use ${collateralAmount} BTC as collateral to generate ${stable} AIS`,
          success: `${stable} AIS generated successfully`,
          error: {
            render({ error }) {
              logger.error('CreatePosition', error);

              return 'Something went wrong. Try again later.';
            }
          },
        }
      );

      console.log({ res });

      await updateBalances();
    } catch (e) {
      logger.error(e);
    }
  }, [vaultActor, principle, btc]);

  const getAccountPositions = useCallback(async () => {
    try {
      const positions = await vaultActor.getAccountPositions(principle);

      console.log({ positions });
    } catch (e) {
      logger.error(e);
    }
  }, [vaultActor, principle]);

  useEffect(() => {
    if (principle && vaultActor) {
      getAccountPositions();
    }
  }, [vaultActor]);

  return {
    createPosition,
  };
};

export default usePositions;
