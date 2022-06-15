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

  const { createPosition, currentPosition, positions } = usePositions({ vaultActor, principle });

  const { collateralPrice } = useCollateralPrice({ vaultActor });

  const value = useMemo(() => {
    return {
      collateralPrice,
      createPosition,
      currentPosition,
      positions,
    };
  }, [collateralPrice, createPosition, currentPosition, positions]);

  return (
    <VaultContext.Provider value={value}>
      {children}
    </VaultContext.Provider>
  )
};

export default VaultProvider;
