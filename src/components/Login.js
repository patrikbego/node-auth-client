import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import { FormHelperText } from '@material-ui/core';
import Link from 'next/link';
import Copyright from './Copyright';
import controllers from '../api/controller';
import Password from './formFields/Password';
import Email from './formFields/Email';
import facebookService from '../utils/facebookService';
import googleService from '../utils/googleService';
import { useStateValue } from '../utils/reducers/StateProvider';
import Header from './Header';
import utilStyles from '../styles/utils.module.css';

export default function Login({ URL }) {
  const useStyles = makeStyles((defTheme) => ({
    root: {
      height: '100vh',
    },
    image: {
      backgroundImage: 'url(https://source.unsplash.com/random)',
      backgroundRepeat: 'no-repeat',
      backgroundColor:
          defTheme.palette.type === 'light'
            ? defTheme.palette.grey[50]
            : defTheme.palette.grey[900],
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    paper: {
      margin: defTheme.spacing(8, 4),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: defTheme.spacing(1),
      backgroundColor: defTheme.palette.primary.main,
    },
    link: {
      // margin: theme.spacing(1, 1.5),
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: defTheme.spacing(1),
    },
    submit: {
      margin: defTheme.spacing(3, 0, 2),
    },
  }));

  // TODO consider loading this async / in the background
  try {
    facebookService.initFacebookSdk().then(console.info('fb initialized'));
    googleService.init().then(console.log('google initialized'));
  } catch (e) {
    console.error('Social init failed -> ', e);
  }

  const [{ user, token, darkOrLiteTheme }, dispatch] = useStateValue();

  const classes = useStyles();
  const [disable, setDisabled] = useState(true);
  const [fetchErrorMsg, setFetchErrorMsg] = useState();
  const router = useRouter();
  const disableCallback = (childData) => {
    setDisabled(childData);
  };

  function setAuthState(res) {
    dispatch({
      type: 'SET_USER',
      user: res.user,
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', res.token);
      // document.cookie = `devst=${res.token};max-age=604800;domain=bego.tips`;
      document.cookie = `devst=${res.token};max-age=604800`;
    }
    dispatch({
      type: 'SET_TOKEN',
      token: res.token,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const emailElement = event.target.email;
    const passwordElement = event.target.password;
    controllers.URL = URL;
    controllers.signIn(
      {
        email: emailElement.value,
        password: passwordElement.value,
      },
    ).then(
      async (response) => {
        try {
          const res = await response.json();
          if (response.status !== 200) {
            setFetchErrorMsg(res);
          } else {
            // if (typeof window !== 'undefined') {
            //   localStorage.setItem('token', res.token);
            // }
            setAuthState(res);
            await router.push('/');
          }
        } catch (e) {
          console.error(e);
          setFetchErrorMsg('User login failed!');
        }
      },
    ).catch(
      (e) => {
        console.error(e);
        if (e) {
          setFetchErrorMsg(e);
        } else {
          setFetchErrorMsg('User login failed!');
        }
      },
    );
  }

  async function loginWithFacebook() {
    const res = await facebookService.login();
    if (res) {
      setAuthState(res);
      await router.push('/');
    } else {
      setFetchErrorMsg(res);
      console.error('fb login failed');
    }
  }

  async function loginWithGoogle() {
    const res = await googleService.login();
    if (res) {
      setAuthState(res);
      await router.push('/');
    } else {
      console.error('google login failed');
    }
  }

  return (

    <Grid container component="main" className={classes.root}>
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Header loading={false} />
        <div className={classes.paper}>
          <Link
            variant="button"
            href="/"
            className={classes.link}
          >
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
          </Link>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>

          <form onSubmit={handleSubmit} className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Email disableCallback={disableCallback} />
              </Grid>
              <Grid item xs={12}>
                <Password disableCallback={disableCallback} />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={disable}
            >
              Sign In
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={loginWithFacebook}
            >
              Sign In with Facebook
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={loginWithGoogle}
            >
              Sign In with Google
            </Button>
            {fetchErrorMsg
                && <FormHelperText error>{fetchErrorMsg}</FormHelperText>}
            <Grid container>
              <Grid item xs>
                <Link className={utilStyles.a} href="/forgotPassword" variant="body2">
                  <a className={utilStyles.a}>Forgot password?</a>
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  <a className={utilStyles.a}>Don't have an account? Sign Up</a>
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
