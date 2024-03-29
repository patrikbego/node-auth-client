import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import CssBaseline from '@material-ui/core/CssBaseline';
import { StateProvider } from '../utils/reducers/StateProvider';
import reducer, { initialState } from '../utils/reducers/reducer';
import GlobalAlertBar from '../components/GlobalAlertBar';

import '../styles/global.css';

export default function MyApp(props) {
  const { Component, pageProps } = props;

  // TODO: create front per with hashtags and when clicked on hashtags show list of blogs related to that hashtag

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  console.log('App loaded');
  if (typeof window !== 'undefined') {
    const userStorage = sessionStorage.getItem('user');
    if (userStorage) {
      const us = JSON.parse(userStorage);
      initialState.user = us;
    }
    const tokenStorage = sessionStorage.getItem('token');
    if (tokenStorage) {
      const ts = JSON.parse(tokenStorage);
      initialState.token = ts;
    }
    const darkOrLiteThemeStorage = sessionStorage.getItem('darkOrLiteTheme');
    if (darkOrLiteThemeStorage) {
      const ds = JSON.parse(darkOrLiteThemeStorage);
      initialState.darkOrLiteTheme = ds;
    }
  }

  return (
    <>
      <StateProvider
        initialState={initialState}
        reducer={reducer}
      >
        <Head>
          <title>OctoPlasm</title>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
        </Head>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...pageProps} />
        <GlobalAlertBar />
      </StateProvider>
    </>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
