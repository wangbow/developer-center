import React from 'react';
import { Router, Route, hashHistory } from 'react-router';
import { Create, ListPage } from './containers';
import AuthPage from '../../components/authPage';

export default (
  <Router history={hashHistory}>
    <Route path="/" component={ListPage}/>
      <Route path="/create" component={Create}/>
      <Route path="/auth/:id" component={AuthPage} />
  </Router>
)
