import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import MainPage from './Main';
//import EditPage from './Edit';

export default (
  <Router history={hashHistory}>
    <Route path="/" component={MainPage}/>
  </Router>
)
