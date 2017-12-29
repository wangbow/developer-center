import {
  Router,
  Route,
  IndexRedirect,
  hashHistory,
} from 'react-router';
import Default from './main';

export default (
  <Router history={hashHistory}>
    <Route path="/" component={Default} />
  </Router>
)