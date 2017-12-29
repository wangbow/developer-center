import {Router, Route, hashHistory} from 'react-router'

import MainPage from './main.page'
import LimitPage from './limit.page'
import ListMysqlPage from './list.mysql.page'
import ListRedisPage from './list.redis.page'
import CreateMysqlPage from './create.mysql.page'
import CreateRedisPage from './create.redis.page'
import CreateMQPage from './create.mq.page'
import ListMQPage from './list.mq.page'
import CreateZKPage from './create.zk.page'
import CreateJenkinsPage from './create.jenkins.page'
import CreateDclbPage from './create.dclb.page'
import ListZKPage from './list.zk.page'
import ListJenkinsPage from './list.jenkins.page'
import ListDclbPage from './list.dclb.page'
import ListRedirectrulePage from './list.redirectrule.page'
import ListDomainPage from './list.domain.page'
import {maxInsNum, listQ} from '../../serves/middleare'

import CreateFormPage from './create.form.page'

import AuthPage from '../../components/authPage'



export default(
  <Router history={hashHistory}>
    <Route path="/" component={MainPage} />
    <Route path="/create/mysql" component={CreateMysqlPage}/>
    <Route path="/create/redis" component={CreateRedisPage}/>
    <Route path="/create/mq" component={CreateMQPage}/>
    <Route path="/create/zk" component={CreateZKPage}/>
    <Route path="/create/jenkins" component={CreateJenkinsPage}/>
    <Route path="/create/dclb" component={CreateDclbPage}/>
    <Route path="/create/form" component={CreateFormPage}/>
    <Route path="/limit" component={LimitPage} />
    <Route path="/list/redis" component={ListRedisPage} />
    <Route path="/list/mysql" component={ListMysqlPage} />
    <Route path="/list/mq" component={ListMQPage} />
    <Route path="/list/zk" component={ListZKPage} />
    <Route path="/list/jenkins" component={ListJenkinsPage} />
    <Route path="/list/dclb" component={ListDclbPage} />
    <Route path="/list/redirectrule/:id" component={ListRedirectrulePage} />
    <Route path="/list/domain/:id" component={ListDomainPage} />
    <Route path="/auth/:id" component={AuthPage} />
  </Router>
)
