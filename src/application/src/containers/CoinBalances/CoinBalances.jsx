import React, { useState, useEffect } from 'react';

import CoinIcon from 'Components/CoinIcon';
import { useWallet } from 'Services/wallet';
import { mint_token } from 'Declarations/mint_token';
import { fake_btc } from 'Declarations/fake_btc';

import styles from './CoinBalances.scss';

const CoinBalances = () => {
  const { balances } = useWallet();
  const [sources, setSources] = useState(null);

  useEffect(() => {
    // TODO: refactor?
    mint_token.logo().then(logo => {
      setSources(current => ({
        ...current,
        'USB': logo,
      }));
    });

    fake_btc.logo().then(logo => {
      setSources(current => ({
        ...current,
        'FBTC': logo,
      }));
    });
  }, []);

  console.log({ balances})

  return (
    <div className={styles.coinBalances}>
      {balances.map(bal => {
        return (
          <div
            className={styles.balance}
            key={bal.canisterId}
          >
            <CoinIcon
              src={sources[bal.symbol]}
              symbol={bal.symbol}
            />
            <span>
              {bal.symbol}: {bal.amount}
            </span>
          </div>
        )
      })}
    </div>
  )
};

export default CoinBalances;
