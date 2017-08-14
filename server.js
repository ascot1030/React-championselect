import React from 'react';
import ReactDOMServer from 'react-dom/server';
import bodyParser from 'body-parser';
import compression from 'compression';
import express from 'express';
import fetch from 'isomorphic-fetch';
import os from 'os';
import path from 'path';
import qs from 'querystring';
import sendgrid from 'sendgrid';
import throng from 'throng';

import App from './src/containers/App';
import configureStore from './src/store/configureStore';
import routes from './src/routes/index';

import {
  Provider
} from 'react-redux';

import {
  RoutingContext,
  match
} from 'react-router';

import {
  CHAMPION_GG_MOST_PLAYED_URL,
  SOLOMID_AUTH_SIGN_IN_URL,
  SOLOMID_AUTH_SIGN_UP_URL,
  SOLOMID_AUTH_FORGOT_PASS_URL,
  SOLOMID_AUTH_RESET_PASS_URL
} from './src/constants/urls';

const MS_IN_YR = 31622400;
const WORKERS = process.env.WEB_CONCURRENCY || 1;

const server = express();
const port = process.env.PORT || 5555;

const start = () => {
  server.use(compression());
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({
    extended: true
  }));

  server.use(express.static('public', {maxAge: MS_IN_YR}));

  // TODO: serve SystemJS dependency from CDN
  server.use('/jspm_packages', express.static('jspm_packages', {maxAge: MS_IN_YR}));

  server.use('/cpmstar', express.static('cpmstar', {maxAge: MS_IN_YR}));

  // redirect all traffic to use `www`
  function redirectWww(req, res, next) {
    if (!req.headers.host.slice(0, 4) === 'www.') {
      return res.redirect(301, req.protocol + '://www.' + req.headers.host + req.originalUrl);
    }

    next();
  }

  server.set('trust proxy', true);
  server.use(redirectWww);

  // Routes --------------------------------------------------------------------

  server.get('/mostpopularchampions', function (req, res) {
    // TODO: abstract
    fetch(`${CHAMPION_GG_MOST_PLAYED_URL}?api_key=${process.env.CHAMPION_GG_API_KEY}&limit=64`)
      .then(response => response.json())
      .then(json => {
        const MS_IN_DAY = 86400;
        res.setHeader('Cache-Control', `max-age=${MS_IN_DAY}`);
        res.json(json);
      })
      .catch(error => {
        res.json(error);
      });
  });

  server.get('/comments/:championKey', redirectChampionsOrMatchups);
  server.get('/tips/:championKey', redirectChampionsOrMatchups);
  server.get('/comments/view/*', redirectHome);
  server.get('/comments/:championKey/:matchupChampionKey', redirectChampionsOrMatchups);
  server.get('/tips/:championKey/:matchupChampionKey', redirectChampionsOrMatchups);

  server.get('/comments', redirectHome);
  server.get('/streams', redirectHome);

  server.get('/comments/*', redirectHome);

  function redirectChampionsOrMatchups (req, res) {
    const {
      params: {
        championKey,
        matchupChampionKey
      }
    }  = req;

    let redirect = '/';
    if (matchupChampionKey === 'general' || !matchupChampionKey) {
      redirect = `/champions/${championKey}`
    } else {
      redirect = `/matchups/${championKey}/${matchupChampionKey}`
    }

    res.redirect(301, redirect);
  }

  function redirectHome (req, res) {
    res.redirect(301, '/');
  }

  // TODO: clean up
  server.get('/', handleRender);
  server.get('/champions', handleRender);
  server.get('/champions/:championKey', handleRender);
  server.get('/champions/:championKey/countertips', handleRender);
  server.get('/champions/:championKey/matchups/:lane/:type', handleRender);
  server.get('/matchups/:championKey/:matchupChampionKey', handleRender);
  server.get('/matchups/:championKey/:matchupChampionKey/comments', handleRender);
  server.get('/matchups/:championKey/:matchupChampionKey/countertips', handleRender);
  server.get('/forgot', handleRender);
  server.get('/reset', handleRender);

  const loaderIoId = 'loaderio-6aeb9f2c27daaba9bfd5119ac54138db';
  const loaderIoFastlyId = 'loaderio-66cb49f6e46f5333bdd1c203d4abedb4';

  server.get(`/${loaderIoId}`, function (req, res) {
    res.send(loaderIoId);
  });

  server.get(`/${loaderIoFastlyId}`, function (req, res) {
    res.send(loaderIoFastlyId);
  });

  function handleRender (req, res) {
    match({
      routes,
      location: req.url
    }, (error, redirectLocation, renderProps) => {
      if (error) {
        if (error.notFound) {
          res.status(404).send(error.message);
        } else {
          res.status(500).send(error.message);
        }
      } else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      } else if (renderProps) {

        // const params = qs.parse(req.query);
        // const message = params.message || 'Huh?'

        // const preloadedState = {message};
        // const store = configureStore(preloadedState)
        const store = configureStore();

        // TODO: use JSX somehow
        const providerElement = React.createElement(Provider, {store}, React.createElement(App));

        const html = ReactDOMServer.renderToString(providerElement);
        const finalState = store.getState();

        res.setHeader('Cache-Control', `max-age=${MS_IN_YR}`);
        res.status(200).send(renderFullPage(html, finalState));
      }
    });
  }

  function renderFullPage (html, preloadedState) {
    const title = 'ChampionSelect';

    // TODO: use template
    // TODO: conditionally output development/production templates
    // TODO: escape stringified state
    return `
      <!doctype html>
      <html>
        <head>
          <title>${title}</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
          <meta http-equiv="x-ua-compatible" content="ie=edge">

          <link rel="icon" href="https://s3.amazonaws.com/solomid-resources/championselect/favicon.ico">

          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/css/bootstrap.min.css" integrity="sha384-y3tfxAZXuh4HwSYylfB+J125MxIs6mR5FOHamPBG064zB+AFeWH94NdvaCBm8qnd" crossorigin="anonymous">
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/loaders.css/0.1.2/loaders.min.css">
          <link rel="stylesheet" href="/index.css">

          <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
          <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/js/bootstrap.min.js" integrity="sha384-vZ2WRJMwsjRMW/8U7i6PWi6AlO1L79snBrmgiDpgIWJ82z8eA5lenwvxbMV1PAh7" crossorigin="anonymous"></script>

          <script src="/jspm_packages/system.js"></script>
          <script src="/jspm.browser.js"></script>
          <script src="/jspm.config.js"></script>
          <script src="/bundle.js"></script>
          <script src="/google.js"></script>
        </head>
        <body>
          <div id="mount">${html}</div>

          <script>
            window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)}
          </script>
          <script>
            SystemJS.import('champion-select/index.js');
          </script>
        </body>
      </html>
    `;
  }

  // Authentication ------------------------------------------------------------

  server.post('/forgot', function (req, res) {
    const {
      email
    } = req.body;

    const data = qs.stringify({
      email
    });

    fetch(`${SOLOMID_AUTH_FORGOT_PASS_URL}`, {
      body: data,
      headers: constructHeaders(data),
      method: 'POST'
    })
      .then(authResponse => {
        if (!authResponse.ok) {
          // TODO: check specific error messages
          res.statusMessage = "A user with that email wasn't found.";
          res.status(500).send();
          return Promise.reject(error);
        }

        return authResponse;
      })
      .then(authResponse => authResponse.json())
      .then(json => {
          const {
            email,
            token,
            user_id
          } = json;

          const helper = sendgrid.mail;
          const from = new helper.Email('no-reply@championselect.net');
          const to = new helper.Email(email);
          const subject = 'ChampionSelect password reset'
          const params = qs.stringify({
            token,
            user_id
          })

          // TODO: clean up
          const host = process.env.HOST || req.headers.host;
          const url = `${req.protocol}://${host}/reset?${params}`;

          const body = `
            <p>Hi ${email},</p>
            <p>You've recently requested your SoloMid Network password to be reset. Set a new password by following the link below:</p>
            <a href="${url}">Reset password</a>
            <p>If you didn't request a password reset, please ignore this email.</p>
            <p>Your password won't change until you access the link above and create a new one.</p>
            <p>Thanks! <br />Team SoloMid </p>
          `;

          const content = new helper.Content('text/html', body);
          const mail = new helper.Mail(from, subject, to, content);
          const sg = sendgrid(process.env.SENDGRID_API_KEY);

          const sgReq = sg.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON()
          })

          sg.API(sgReq)
            .then(sgRes => {
              res.json(json);
            })
            // TODO: do not rely on catch here
            // .catch(error => {
            //   console.log(error);
            // });

      })
      .then(json => json)
  });

  server.post('/reset', function (req, res) {
    const {
      password,
      token,
      userId
    } = req.body;

    const data = qs.stringify({
      password,
      token,

      // TODO: clean up
      user_id: userId
    });

    fetch(`${SOLOMID_AUTH_RESET_PASS_URL}`, {
      body: data,
      headers: constructHeaders(data),
      method: 'POST'
    })
      .then(authResponse => {
        return authResponse.json(json => {
          const {
            error
          } = json;

          if (!response.ok) {
            res.statusMessage = error;
            res.status(500).send();
            Promise.reject(error);
          }

          return response.json();
        });
      })
      .then(json => {
        // TODO: DRY
        const error = json.error;

        if (error) {
          res.statusMessage = error;
          res.status(500).send();
        }

        res.json(json)
      })
  });

  server.post('/signin', function (req, res) {
    const {
      email,
      password
    } = req.body;

    const data = qs.stringify({
      'grant_type': 'password',
      email,
      password
    });

    fetch(`${SOLOMID_AUTH_SIGN_IN_URL}`, {
      body: data,
      headers: constructHeaders(data),
      method: 'POST'
    })
      .then(response => response.json())
      .then(json => {
        res.json(json);
      })
      .catch(error => {
        res.json(error);
      });
  });

  server.post('/signup', function (req, res) {
    const {
      username,
      email,
      password
    } = req.body;

    const data = qs.stringify({
      username,
      email,
      password
    });

    fetch(`${SOLOMID_AUTH_SIGN_UP_URL}`, {
      body: data,
      headers: constructHeaders(data),
      method: 'POST'
    })
      .then(response => response.json())
      .then(json => {
        res.json(json);
      })
      .catch(error => {
        res.json(error);
      });
  });

  // Send 404
  server.all('*', send404);

  function send404 (req, res) {
    res.setHeader('Cache-Control', `max-age=${MS_IN_YR}`);
    res.status(404).send('Not found.');
  }

  // Listen --------------------------------------------------------------------

  server.listen(port, error => {
    if (error) {
      console.log(error);
    } else {
      console.info(`🌎  Listening on port ${port} in ${process.env.NODE_ENV} mode.`);
    }
  });

  function constructHeaders (data) {
    const credentials = new Buffer(`${process.env.AUTH_ID}:${process.env.AUTH_SECRET}`).toString('base64');

    return new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': data.length,
      'Authorization': `Basic ${credentials}`
    });
  }
};

if (process.env.NODE_ENV === 'production') {
  throng({
    lifetime: Infinity,
    start,
    workers: WORKERS,
  });
} else {
  start();
}
