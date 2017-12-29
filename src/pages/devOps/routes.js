import { Router, Route, hashHistory ,IndexRoute} from 'react-router'
// self component
import Detail from './container/detail.page';
import Change from './container/change.page';
import MainPage from './app';
import Creation from './container/creation.page';

export default (
  <Router history={hashHistory}>
    <Route path="/" component={MainPage} >
     <IndexRoute component={Detail}/>
      <Route                             
        path="/detail"
        component={Detail}
      />
      <Route
        path="/change"
        component={Change}
      />
    </Route>

    <Route
      path="/creation"
      component={Creation}
    />
  </Router>
)
