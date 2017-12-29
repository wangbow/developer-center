import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory,IndexRoute } from 'react-router';
import ImportModalManager from './ImportModalManager';
import AddModal from './addModal';
import HDFSAddModal from './HDFSaddModal';
import Detail from './detail';
import Edit from './edit';
import HDFSDetail from './HDFSDetail';
import HDFSEdit from './HDFSedit';
import HDFSModalManager from './HDFSModalManager';

export default  (
   <Router history={hashHistory}>
    <Route path="/" component={ImportModalManager} />
    <Route path="/HDFS" component={HDFSModalManager} />

    <Route path="/add" component={AddModal} />
    <Route path="/addHDFS" component={HDFSAddModal} />
    

    <Route path="/detail/:id" component={Detail} />
    <Route path="/HDFSdetail/:id" component={HDFSDetail} />
    <Route path="/edit/:id" component={Edit} />
    <Route path="/HDFSedit/:id" component={HDFSEdit} />
   </Router>
)