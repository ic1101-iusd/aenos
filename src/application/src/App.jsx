import React from 'react';

import Header from 'Components/Header';
import CoinBalances from 'Containers/CoinBalances';
import Position from 'Containers/Position';
import PositionsTable from 'Containers/PositionsTable';

import styles from './App.scss';

const App = () => {
  return (
    <div className={styles.app}>
      <Header />
      <CoinBalances />
      <Position />
      <PositionsTable />
    </div>
  )
};

export default App;
