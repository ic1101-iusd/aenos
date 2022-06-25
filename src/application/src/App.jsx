import React from 'react';
import {
  Routes,
  Route,
} from "react-router-dom";

import Header from 'Components/Header';
import CoinBalances from 'Containers/CoinBalances';
import Position from 'Containers/Position';
import PositionsTable from 'Containers/PositionsTable';
import Stats from 'Containers/Stats';

import styles from './App.scss';

const App = () => {
  return (
    <div className={styles.app}>
      <Header />

      <Routes>
        <Route
          path="/"
          element={(
            <>
              <CoinBalances />
              <Position />
              <PositionsTable />
            </>
          )}
        />

        <Route
          path="/stats"
          element={<Stats />}
        />
      </Routes>
    </div>
  )
};

export default App;
