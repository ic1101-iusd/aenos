import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { Principal } from '@dfinity/principal';

import { useWallet } from 'Services/wallet';
import { protocol, idlFactory as vaultIdl, canisterId as vaultCanisterId } from 'Declarations/protocol';
import { idlFactory as btcIdl, canisterId as btcCanisterId } from 'Declarations/fake_btc';

import VaultContext, { BTC_PRICE_MOCK } from './VaultContext';

const VaultProvider = ({ children }) => {
  const { plug, principle } = useWallet();
  const [collateralPrice, setCollateralPrice] = useState(BTC_PRICE_MOCK);

  const getCollateralPrice = useCallback(async () => {
    const price = await protocol.getCollateralPrice();

    setCollateralPrice(Number(price));
  }, []);

  const createPosition = useCallback(async (collateralAmount, stableAmount) => {
    // TODO: EXAMPLE - need to refactor
    console.log({ collateralAmount, stableAmount, vaultCanisterId });

    const actor = await plug.current.createActor({
      canisterId: btcCanisterId,
      interfaceFactory: btcIdl,
    });
    console.log({ actor, principle });
    const b = await actor.balanceOf(principle);
    console.log({ b });

    const approve = await actor.approve(Principal.fromText(vaultCanisterId), collateralAmount * 10**8 * 20000000);

    console.log({ approve, vaultCanisterId });

    const vaultActor = await plug.current.createActor({
      canisterId: vaultCanisterId,
      interfaceFactory: vaultIdl,
    })

    const res = await vaultActor.createPosition(collateralAmount * 10**8, Math.round(stableAmount));

    console.log({ res });
  }, [principle]);

  useEffect(() => {
    getCollateralPrice();
  }, []);

  const value = useMemo(() => {
    return {
      collateralPrice,
      createPosition,
    };
  }, [collateralPrice]);

  return (
    <VaultContext.Provider value={value}>
      {children}
    </VaultContext.Provider>
  )
};

export default VaultProvider;
