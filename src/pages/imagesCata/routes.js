import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import MainPage from './Main';

import VersionList from './versionList';
import AppPublish from './publish';
import VersionInfo from './versionInfo';
import TransitionPage from '../../components/transitionPage';
import Cata from './cata';
import PublicCata from './publicCata';
import OwnerCata from './ownerCata';
import PublicList from './container/publiclist';

import AuthPage from '../../components/authPage';

export default (
  <Router history={hashHistory}>
  <Route path="/" component={MainPage}/>
      <Route path="/publiccata/versionlist" component={Cata}>
        <IndexRoute component={PublicList}/>
        <Route path="/publiccata/versioninfo/:id" component={VersionInfo}/>
        <Route path="/publiccata/publish/:id" component={AppPublish}/>
      </Route>
      <Route path="/ownercata/versionlist" component={Cata}>
        <IndexRoute component={VersionList}/>
        <Route path="/ownercata/versioninfo/:id" component={VersionInfo}/>
        <Route path="/ownercata/publish/:id" component={AppPublish}/>
      </Route>
    <Route path="/transition/:state" component={TransitionPage} />
    <Route path="/auth/:id" component={AuthPage} />
  </Router>
)
