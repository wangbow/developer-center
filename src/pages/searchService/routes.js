import React from 'react';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import MainPage from './components/search-home';
import SearchList from './components/search-list';
import Details from './components/search-details';



export default (
  <Router history={hashHistory}>
    <Route path="/" component={MainPage} />
    <Route path="/searchList" component={SearchList} />
    <Route path="/details/:name/:id" component={Details} />
  </Router>
)
