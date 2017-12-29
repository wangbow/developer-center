import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import MainPage from './Main';
import Success from './success';

export default (
  <Router history={hashHistory}>
    <Route path="/" component={MainPage}/>
    <Route path="/success" component={Success}/>
  </Router>
)
