import {Router, Route, hashHistory} from 'react-router'

import MainPage from './main.page'

export default(
  <Router history={hashHistory}>
    <Route path="/" component={MainPage}></Route>
  </Router>
)
