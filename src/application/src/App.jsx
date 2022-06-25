import React from 'react';
import {
  Routes,
  Route,
} from "react-router-dom";

import Header from 'Components/Header';
import Stats from 'Containers/Stats';
import Main from 'Containers/Main';

import styles from './App.scss';

const App = () => {
  return (
    <div className={styles.app}>
      <Header />

      <Routes>
        <Route
          path="/"
          element={<Main />}
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
