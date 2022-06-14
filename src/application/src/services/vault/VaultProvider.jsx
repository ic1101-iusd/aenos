import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { Principal } from '@dfinity/principal';

import { useWallet } from 'Services/wallet';
import { useCoins } from 'Services/coins';
import { idlFactory as vaultIdl, canisterId as vaultCanisterId } from 'Declarations/protocol';

import VaultContext, { BTC_PRICE_MOCK } from './VaultContext';

const VaultProvider = ({ children }) => {
  const [collateralPrice, setCollateralPrice] = useState(BTC_PRICE_MOCK);
  const [vaultActor, setVaultActor] = useState();

  const { plug, principle } = useWallet();
  const { btc } = useCoins();

  const getCollateralPrice = useCallback(async () => {
    const price = await vaultActor.getCollateralPrice();

    setCollateralPrice(Number(price));
  }, [vaultActor]);

  useEffect(() => {
    const initVaultActor = async () => {
      const vaultActor = await plug.current.createActor({
        canisterId: vaultCanisterId,
        interfaceFactory: vaultIdl,
      });

      setVaultActor(vaultActor);
    };

    if (principle && plug.current) {
      initVaultActor();
    }
  }, [principle]);

  useEffect(() => {
    if (vaultActor) {
      getCollateralPrice();
    }
  }, [vaultActor]);

  const createPosition = useCallback(async (collateralAmount, stableAmount) => {
    // TODO: EXAMPLE - need to refactor
    console.log({ collateralAmount, stableAmount, btc });

    const approve = await btc.actor.approve(Principal.fromText(vaultCanisterId), collateralAmount * 10**8 * 20000000);

    console.log({ approve });

    const res = await vaultActor.createPosition(collateralAmount * 10**8, Math.round(stableAmount));

    console.log({ res });
  }, [vaultActor, principle, btc]);

  const value = useMemo(() => {
    return {
      collateralPrice,
      createPosition,
    };
  }, [collateralPrice, createPosition]);

  return (
    <VaultContext.Provider value={value}>
      {children}
    </VaultContext.Provider>
  )
};

export default VaultProvider;
