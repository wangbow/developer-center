import {Router, Route, hashHistory} from 'react-router';
import MainPage from './containers';
import AuthPage from 'components/authPage'
import RedisManager from './list-middleware/redis-manager';
import MysqlManager from './list-middleware/mysql-manager';
import RabbitmqManager from './list-middleware/rabbitMQ-manager';
import ZookeeperManager from './list-middleware/zooKeeper-manager';
import JenkinsManager from './list-middleware/jenkins-manager';
import DclbManager from './list-middleware/dclb-manager';

import CreateRedis from './create-middleware/create-redis';
import CreateMysql from './create-middleware/create-mysql';
import CreateRabbitMQ from './create-middleware/create-rabbitMQ';
import CreateZookeeper from './create-middleware/create-zooKeeper';
import CreateJenkins from './create-middleware/create-jenkins';
import CreateDclb from './create-middleware/create-dclb';

import GoDomain from './components/domain-middleware';
import Redirect from './components/redirect-middleware';
import LimitPage from './components/limit-middleware';


export default(
  <Router history={hashHistory}>
    <Route path="/" component={MainPage} />
    <Route path="/auth/:id" component={AuthPage} />
    <Route path="/list/redis" component={RedisManager} />
    <Route path="/list/mysql" component={MysqlManager} />
    <Route path="/list/mq" component={RabbitmqManager} />
    <Route path="/list/zk" component={ZookeeperManager} />
    <Route path="/list/jenkins" component={JenkinsManager} />
    <Route path="/list/dclb" component={DclbManager} />
    <Route path="/create/redis" component={CreateRedis} />
    <Route path="/create/mysql" component={CreateMysql} />
    <Route path="/create/mq" component={CreateRabbitMQ} />
    <Route path="/create/zk" component={CreateZookeeper} />
    <Route path="/create/jenkins" component={CreateJenkins} />
    <Route path="/create/dclb" component={CreateDclb} />
    <Route path="/domain/:id" component={GoDomain} />
    <Route path="/redirectrule/:id" component={Redirect} />
    <Route path="/limit" component={LimitPage} />
  </Router>
)
