import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import MainPage from './Main';
import { TableTree } from './containers'
import AuthPage from '../../components/authPage';

export default (
  <Router history={hashHistory}>
    <Route path="/" component={MainPage}>
      <IndexRoute path="/alarm-info" component={TableTree} />
    </Route>
    <Route path="/auth/:id" component={AuthPage} />
  </Router>
)
