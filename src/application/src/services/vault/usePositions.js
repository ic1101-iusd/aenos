import { useCallback, useEffect, useState } from 'react';
import { Principal } from '@dfinity/principal';
import { toast } from 'react-toastify';
import ReactGA from 'react-ga';

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

const usePositions = ({ vaultActor, principle, collateralPrice }) => {
  const [allPositions, setAllPositions] = useState([]);
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

      ReactGA.event({
        category: 'Position',
        action: 'Create',
        value: collateralAmount * collateralPrice,
      });
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
      setPositions(current => current.map(p => position.id === p.id ? position : p));

      await updateBalances();

      if (collateral > currentPosition.collateralAmount) {
        ReactGA.event({
          category: 'Position',
          action: 'Deposit',
          value: (collateral - currentPosition.collateralAmount) * collateralPrice,
        });
      }
      if (collateral < currentPosition.collateralAmount) {
        ReactGA.event({
          category: 'Position',
          action: 'Withdraw',
          value: (currentPosition.collateralAmount - collateral) * collateralPrice,
        });
      }
      if (diffStable !== 0) {
        ReactGA.event({
          category: 'Position',
          action: 'Change debt',
          value: diffStable,
        });
      }
    } catch (e) {
      logger.error(e);
    }
  }, [currentPosition, vaultActor, btc, iUsd, updateBalances, collateralPrice]);

  const getAccountPositions = useCallback(async () => {
    try {
      if (!principle) {
        setPositions([]);
        setCurrentPosition(null);
        return;
      }

      const positions = (await vaultActor.getAccountPositions(principle)).map(position => {
        return {
          ...position,
          collateralAmount: fromBigInt(position.collateralAmount),
          stableAmount: fromBigInt(position.stableAmount),
        };
      });

      logger.log({ positions });

      setPositions(positions);

      // setting first valid position as current
      if (!currentPosition) {
        setCurrentPosition(positions.filter(position => !(position.deleted || position.liquidated))?.[0] ?? null);
      }
    } catch (e) {
      logger.error(e);
    }
  }, [vaultActor, principle, currentPosition]);

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

      logger.log({ res });

      if (currentPosition?.id === id) {
        setCurrentPosition(null);
      }

      await updateBalances();
      await getAccountPositions();

      ReactGA.event({
        category: 'Position',
        action: 'Close',
        value: closingPosition.collateralAmount * collateralPrice,
      });
    } catch (e) {
      logger.error(e);
    }
  }, [currentPosition, updateBalances, btc, iUsd, getAccountPositions]);

  const getAllPositions = useCallback(async () => {
    try {
      const lastPositionId = await vaultActor.getLastPositionId();

      const allPositions = (await vaultActor.getPositions(lastPositionId, 0)).map(position => {
        return {
          ...position,
          collateralAmount: fromBigInt(position.collateralAmount),
          stableAmount: fromBigInt(position.stableAmount),
        };
      });

      logger.log({ allPositions });

      setAllPositions(allPositions);
    } catch (e) {
      logger.error(e);
    }
  }, [vaultActor]);

  const selectPosition = useCallback((id) => {
    if (id === null) {
      setCurrentPosition(null);
    }

    // unset current position
    if (currentPosition?.id === id) {
      setCurrentPosition(null);
      return;
    }

    setCurrentPosition(
      positions.find(position => position.id === id)
    );
  }, [positions, currentPosition]);

  useEffect(() => {
    if (vaultActor) {
      getAccountPositions();
    }
  }, [vaultActor, principle]);

  return {
    createPosition,
    positions,
    currentPosition,
    updatePosition,
    closePosition,
    selectPosition,
    getAllPositions,
    allPositions,
  };
};

export default usePositions;
