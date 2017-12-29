import React from 'react';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import MircoServer from './component/mscon-home';



export default (
  <Router history={hashHistory}>
    <Route path="/" component={MircoServer} />
  </Router>
)
