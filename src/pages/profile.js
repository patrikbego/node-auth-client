import React, { StrictMode } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import SignUp from '../components/SignUp';
import Header from '../components/Header';
import muiSetter from '../utils/theme';
import { useStateValue } from '../utils/reducers/StateProvider';
import { errorWrapper } from '../utils/errorUtils';
import controllers from '../api/controller';
import EditProfile from '../components/EditProfile';

export default function Profile({ appUser }) {
  const { darkLightTheme } = muiSetter(useStateValue, createMuiTheme);
  return (
    <>
      {/* <StrictMode> */}
      <ThemeProvider theme={darkLightTheme}>
        <Header loading={false} />
        <EditProfile appUser={appUser} />
      </ThemeProvider>
      {/* </StrictMode> */}
    </>
  );
}

export async function getServerSideProps() {
  const appUser = errorWrapper(await controllers.getUser());
  return {
    props: {
      appUser,
    },
  };
}
