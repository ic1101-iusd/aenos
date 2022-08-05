import React, { useMemo, useEffect, useState } from 'react';

import { useWallet } from 'Services/wallet';
import { idlFactory as vaultIdl, canisterId as vaultCanisterId } from 'Declarations/protocol';

import usePositions from './usePositions';
import useCollateralPrice from './useCollateralPrice';
import VaultContext from './VaultContext';

const VaultProvider = ({ children }) => {
  const [vaultActor, setVaultActor] = useState();

  const { createActor, principle } = useWallet();

  useEffect(() => {
    const initVaultActor = async () => {
      const vaultActor = await createActor(vaultIdl, vaultCanisterId);

      setVaultActor(vaultActor);
    };

    initVaultActor();
  }, [principle]);

  const {
    createPosition,
    currentPosition,
    positions,
    updatePosition,
    setCurrentPosition,
    closePosition,
    selectPosition,
    getAllPositions,
    allPositions,
  } = usePositions({ vaultActor, principle });

  const { collateralPrice, collateralNextPrice } = useCollateralPrice({ vaultActor });

  const value = useMemo(() => {
    return {
      collateralPrice,
      collateralNextPrice,
      createPosition,
      currentPosition,
      positions,
      updatePosition,
      setCurrentPosition,
      closePosition,
      selectPosition,
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
    selectPosition,
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
