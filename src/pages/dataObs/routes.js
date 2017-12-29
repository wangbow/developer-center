import {
  Router,
  Route,
  IndexRedirect,
  hashHistory,
} from 'react-router';

// pages
import Main from './main';
import UserAct from './userAct';
import Browser from './browser';
import Default from './default/Main';
import Service from './service';

export default (
  <Router history={hashHistory}>
    <Route path="/" component={Main}>
      <IndexRedirect from="/" to="/default" />
      <Route path="userAct" component={UserAct} />
      <Route path="browser" component={Browser} />
      <Route path="service" component={Service} />
    </Route>
    <Route path="default" component={Default} />
  </Router>
)