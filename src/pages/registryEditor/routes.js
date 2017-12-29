import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import MainPage from './Main';
import Editor from './editor';

export default (
  <Router history={hashHistory}>
    <Route path="/" component={MainPage}/>
      <Route path="/editor/:id" component={Editor}/>
  </Router>
)
