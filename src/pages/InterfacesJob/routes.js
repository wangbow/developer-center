import React from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import {MainPage} from './main';
import {ListPage, Create} from './containers';
import {ReportsHistory, ReportDetail} from './components';
export default (
  <Router history={hashHistory}>
    <Route path="/" component={MainPage}>
      <IndexRoute component={ListPage}/>
      <Route path="/create" component={Create} />
      <Route path="/reports" component={ReportsHistory} />
      <Route path="/reports/report-detail" component={ReportDetail} />
    </Route>
  </Router>
)
