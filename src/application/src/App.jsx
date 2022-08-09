import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import ReactGA from 'react-ga';

import Header from 'Components/Header';
import Footer from 'Components/Footer';
import Stats from 'Containers/Stats';
import Main from 'Containers/Main';
import { useWallet } from 'Services/wallet';
import config from 'Constants/config';

import styles from './App.scss';

const App = () => {
  const location = useLocation();
  const { isConnecting, principle } = useWallet();

  useEffect(() => {
    if (!isConnecting) {
      ReactGA.initialize(config.GOOGLE_ANALYTICS_TRACKING_CODE, {
        debug: true,
        gaOptions: {
          userId: principle ? principle.toString() : 'anon',
        },
      });

      ReactGA.pageview(location.pathname + location.search);
    }
  }, [location, isConnecting]);

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

      <Footer />
    </div>
  )
};

export default App;
