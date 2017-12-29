import React from 'react';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import { ListPage, MainPage } from './containers';
import {Create,CreateItem}  from './components';

export default (
  <Router history={hashHistory}>
    <Route path="/" component={MainPage}>
      <IndexRoute component={ListPage}/>
      <Route path="/create" component={Create}/>
      <Route path="/createitem" component={CreateItem}/>
    </Route>
  </Router>
)
