import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import Create from './Create';
import Success from './success'
import errorPool from './errorPool'
import errorInvite from './errorInvite'
export default (
  <Router history={hashHistory}>
    <Route path="/" component={Create}/>
    <Route path="/success" component={Success}/>
    <Route path="/errorPool/:msg" component={errorPool}/>
    <Route path="/errorInvite/:msg" component={errorInvite}/>
  </Router>
)
