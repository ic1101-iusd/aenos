import React, { useMemo, useEffect, useState } from 'react';

import { useWallet } from 'Services/wallet';
import { idlFactory as vaultIdl, canisterId as vaultCanisterId } from 'Declarations/protocol';

import usePositions from './usePositions';
import useCollateralPrice from './useCollateralPrice';
import VaultContext from './VaultContext';

const VaultProvider = ({ children }) => {
  const [vaultActor, setVaultActor] = useState();

  const { plug, principle } = useWallet();

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

  const {
    createPosition,
    currentPosition,
    positions,
    updatePosition,
    setCurrentPosition,
    closePosition,
    getAllPositions,
    allPositions,
  } = usePositions({ vaultActor, principle });

  const { collateralPrice } = useCollateralPrice({ vaultActor });

  const value = useMemo(() => {
    return {
      collateralPrice,
      createPosition,
      currentPosition,
      positions,
      updatePosition,
      setCurrentPosition,
      closePosition,
      allPositions,
      getAllPositions,
      vaultActor,
    };
  }, [
    collateralPrice,
    createPosition,
    currentPosition,
    positions,
    updatePosition,
    closePosition,
    allPositions,
    getAllPositions,
    vaultActor,
  ]);

  return (
    <VaultContext.Provider value={value}>
      {children}
    </VaultContext.Provider>
  )
};

export default VaultProvider;
