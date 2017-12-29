import React from 'react';
import { Router, Route, hashHistory } from 'react-router';
import { ListPage,AddModal,Detail } from './containers';

export default (
  <Router history={hashHistory}>
    <Route path="/" component={ListPage}/>
    <Route path="/add" component={AddModal}/>
    <Route path="/detail/:id" component={Detail}/>
    <Route path="/edit/:id" component={AddModal} />
  </Router>
)
