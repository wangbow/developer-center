import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import Create from './Create';

export default (
  <Router history={hashHistory}>
    <Route path="/" component={Create}/>
  </Router>
)
