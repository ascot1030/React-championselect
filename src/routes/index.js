import React from 'react';

import App from '../containers/App';
import Champion from '../containers/Champion';
import Champions from '../containers/Champions';
import ChampionHome from '../containers/ChampionHome';
import ChampionCounterTips from '../containers/ChampionCounterTips';
import ChampionMatchups from '../containers/ChampionMatchups';
import Matchup from '../containers/Matchup';
import MatchupHome from '../containers/MatchupHome';
import MatchupComments from '../containers/MatchupComments';
import MatchupCounterTips from '../containers/MatchupCounterTips';
import Home from '../containers/Home';

import ForgotPassword from '../components/ForgotPassword';
import ResetPassword from '../components/ResetPassword';

import {
  IndexRoute,
  Route
} from 'react-router';

const routes = (
  <Route
    component={App}
    path="/"
  >
    <IndexRoute component={Home} />
    <Route
      component={ForgotPassword}
      path="/forgot"
    />
    <Route
      component={ResetPassword}
      path="/reset"
    />
    <Route
      component={Champions}
      path="/champions"
    />
    <Route
      component={Champion}
      path="/champions/:championKey"
    >
      <IndexRoute component={ChampionHome} />
      <Route
        component={ChampionCounterTips}
        path="/champions/:championKey/countertips"
      />
      <Route
        component={ChampionMatchups}
        path="/champions/:championKey/matchups/:lane/:type"
      />
    </Route>
    <Route
      component={Matchup}
      path="/matchups/:championKey/:matchupChampionKey"
    >
      <IndexRoute component={MatchupHome} />
      <Route
        component={MatchupComments}
        path="/matchups/:championKey/:matchupChampionKey/comments"
      />
      <Route
        component={MatchupCounterTips}
        path="/matchups/:championKey/:matchupChampionKey/countertips"
      />
    </Route>
  </Route>
);

export default routes;
