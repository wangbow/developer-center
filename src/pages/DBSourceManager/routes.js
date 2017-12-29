import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory,IndexRoute } from 'react-router';
import DBSourceManager from './DBSourceManager';
import AddDBSource from './addDBSource';
import Detail from './detail';
import Edit from './edit';

export default  (
   <Router history={hashHistory}>
    <Route path="/" component={DBSourceManager} />
    <Route path="/add" component={AddDBSource} />
    <Route path="/detail/:id" component={Detail} />
    <Route path="/edit/:id" component={Edit} />
   </Router>
)