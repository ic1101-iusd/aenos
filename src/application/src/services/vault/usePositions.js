import { useCallback, useEffect, useState } from 'react';
import { Principal } from '@dfinity/principal';
import { toast } from 'react-toastify';

import { toBigInt, fromBigInt } from 'Utils/formatters';
import { canisterId as vaultCanisterId } from 'Declarations/protocol';
import { useCoins } from 'Services/coins';
import logger from 'Utils/logger';

const coinApprove = async (coin, amount, bigIntAmount) => {
  const approve = await toast.promise(
    coin.actor.approve(
      Principal.fromText(vaultCanisterId),
      bigIntAmount
    ),
    {
      pending: `Approving ${amount} ${coin.symbol}`,
      success: `Approved successfully`,
      error: {
        render({ error }) {
          logger.error(`Approving ${coin.symbol}`, error);

          return 'Something went wrong. Try again later.';
        }
      },
    }
  );

  logger.log({ approve });
};

const usePositions = ({ vaultActor, principle }) => {
  const [positions, setPositions] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);

  const { btc, iUsd, updateBalances } = useCoins();

  const createPosition = useCallback(async (collateralAmount, stableAmount) => {
    try {
      logger.log('create', { collateralAmount, stableAmount });

      const bigIntCollateral = toBigInt(collateralAmount);
      const bigIntStable = toBigInt(stableAmount);

      await coinApprove(btc, collateralAmount, bigIntCollateral);

      const res = await toast.promise(
        vaultActor.createPosition(bigIntCollateral, bigIntStable),
        {
          pending: `Use ${collateralAmount} BTC as collateral to generate ${stableAmount} ${iUsd.symbol}`,
          success: `${stableAmount} ${iUsd.symbol} generated successfully`,
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

      logger.log(position);

      setCurrentPosition(position);
      setPositions(current => [...current, position]);

      await updateBalances();
    } catch (e) {
      logger.error(e);
    }
  }, [vaultActor, btc, updateBalances]);

  const updatePosition = useCallback(async (id, diffCollateral, diffStable) => {
    try {
      logger.log('update', { id, diffCollateral, diffStable, currentPosition });

      const collateral = currentPosition.collateralAmount + diffCollateral;
      const stable = currentPosition.stableAmount + diffStable;

      const bigIntCollateral = toBigInt(collateral);
      const bigIntStable = toBigInt(stable);
      const bigIntDiffCollateral = toBigInt(diffCollateral);
      const bigIntDiffStable = toBigInt(diffStable);

      if (diffCollateral > 0) {
        await coinApprove(btc, diffCollateral, bigIntDiffCollateral);
      }
      if (diffStable < 0) {
        await coinApprove(iUsd, diffStable * -1, bigIntDiffStable * -1);
      }

      const res = await toast.promise(
        vaultActor.updatePosition(id, bigIntCollateral, bigIntStable),
        {
          pending: 'Updating position...',
          success: 'Position updated',
          error: {
            render({ error }) {
              logger.error('UpdatePosition', error);

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

      logger.log('res', position);

      setCurrentPosition(position);

      await updateBalances();
    } catch (e) {
      logger.error(e);
    }
  }, [currentPosition, vaultActor, btc, iUsd, updateBalances]);

  const closePosition = useCallback(async (id) => {
    try {
      const closingPosition = positions.find(position => position.id === id);

      logger.log('closePotion', { id, closingPosition });

      const bigIntDebt = toBigInt(closingPosition.stableAmount);

      await coinApprove(iUsd, closingPosition.stableAmount, bigIntDebt);

      const res = await toast.promise(
        vaultActor.closePosition(id),
        {
          pending: 'Closing position...',
          success: `Position closed, ${closingPosition.collateralAmount} ${btc.symbol} moved back to your wallet`,
          error: {
            render({ error }) {
              logger.error('ClosePosition', error);

              return 'Something went wrong. Try again later.';
            }
          },
        }
      );

      console.log({ res });

      setCurrentPosition(null);

      await updateBalances();
    } catch (e) {
      logger.error(e);
    }
  }, [currentPosition, updateBalances, btc, iUsd]);

  const getAccountPositions = useCallback(async () => {
    try {
      const positions = (await vaultActor.getAccountPositions(principle)).map(position => {
        return {
          ...position,
          collateralAmount: fromBigInt(position.collateralAmount),
          stableAmount: fromBigInt(position.stableAmount),
        };
      });

      logger.log({ positions });

      setPositions(positions);

      // TODO: Temporary setting currentPosition on init
      if (!currentPosition) {
        setCurrentPosition(positions.filter(position => !(position.deleted || position.liquidated))?.[0] ?? null);
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
    updatePosition,
    setCurrentPosition,
    closePosition,
  };
};

export default usePositions;
