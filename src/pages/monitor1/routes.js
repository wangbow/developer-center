import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import { Monitor } from './containers';

export default (
  <Router history={hashHistory}>
    <Route path="/" component={Monitor}/>
  </Router>
)
