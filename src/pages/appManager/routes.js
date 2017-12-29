import React from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';

import ApplicationContent from './Main';
//import UploadDetail from './uploadDetail';
import PublishDetail from './publish/publishDetail';
import PublishLog from './publishLog';
import TransitionPage from 'components/transitionPage';
import LogModal from 'components/logModal';
import {List, MiroAppDetail} from './containers';
import Publish from './publish';
import AuthPage from 'components/authPage';
import MiroAuthPage from './components/miro-auth-page';





export default (
  <Router history={hashHistory}>
    <Route path="/" component={ApplicationContent}>
      <IndexRoute component={List}/>
      <Route path="/publish_detail/:id" component={PublishDetail}/>
      <Route path="/miro-detail/:id" component={ MiroAppDetail } />
      <Route path="/publish" component={Publish}/>
      <Route path="/publishLog" component={PublishLog}/>
      <Route path="/transition/:state" component={TransitionPage}/>
      <Route path="/publishConsole" component={LogModal}/>
     {/* <Route path="/miroauth/:id" component={MiroAuthPage}/> */}
      <Route path="/auth/:id" component={ AuthPage }/>
    </Route>
  </Router>
)
