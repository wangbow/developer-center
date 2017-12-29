import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory,IndexRoute } from 'react-router';
import SearchDataManager from './SearchDataManager';
import OpenSearchHelp from './OpenSearchHelp';



export default  (
   <Router history={hashHistory}>
    <Route path="/" component={SearchDataManager} />
    <Route path="/help" component={OpenSearchHelp} />
   </Router>
)