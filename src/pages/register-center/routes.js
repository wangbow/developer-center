import React from 'react';
import { Router, Route, hashHistory } from 'react-router';
import MainPage from './register-home';
import LookInstance from './register-stance';
import ServerManager from './register-server';
import PowerManager from './register-power';


export default (
  <Router history={hashHistory}>

      <Route path="/" component={MainPage}/>
      <Route path="/lookInstance/:name" component={LookInstance}/>
      <Route path="/serverManager/:name" component={ServerManager}/>
      <Route path="/powerManager" component={PowerManager}/>
      
  </Router>
)
