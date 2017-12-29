// publics
import {Component, PropTypes} from 'react'
import {Button, FormGroup, Row, Col, Label, FormControl, Select, Option} from 'tinper-bee';
import { findDOMNode } from 'react-dom';
import Tabs, {TabPane} from 'rc-tabs';
import TabContent from 'rc-tabs/lib/TabContent';
import ScrollableInkTabBar from 'rc-tabs/lib/ScrollableInkTabBar';
import 'rc-tabs/assets/index.css';
import Header from './component/header.component'
import List from './component/list'
import './index.css'


class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabActive: 'redis',
      providerId: "",
      insStatus: "",
      insName: ""
    }

    this.selectTab = this.selectTab.bind(this);
    this.searchByKey = this.searchByKey.bind(this);
    this.insStatusHandleChange = this.insStatusHandleChange.bind(this);
  }

  insStatusHandleChange(value) {
    this.setState({
      insStatus: value
    });
  }

  selectTab(key) {
    let _this = this;
    this.setState({
      tabActive: key,
      providerId: findDOMNode(_this.refs.providerId).value,
      insName: findDOMNode(_this.refs.insName).value
    });

  }

  searchByKey() {
    let _this = this;
    this.setState({
      providerId: findDOMNode(_this.refs.providerId).value,
      insName: findDOMNode(_this.refs.insName).value,
      providerName: findDOMNode(_this.refs.providerName).value
    });
  }

  enterKeyhandle = (event) => {
    var keynum = event.keyCode || event.which;
    if (keynum == '13') {
      this.searchByKey();
    }
  }
  // renders
  render() {
    return (
      <div>
        <Header widthGoBack={false}>
          <span>中间件服务管理</span>
        </Header>
        <div className="md-search">
          <div className="search-group">
            <Label >租户id</Label>
            <FormControl onKeyPress={this.enterKeyhandle} ref="providerId" placeholder="租户"/>
          </div>
          <div className="search-group">
            <Label >运行状态</Label>
            <Select size="lg" ref="insStatus" defaultValue="全部" onChange={this.insStatusHandleChange}>
              <Option value="">全部</Option>
              <Option value="Deploying">部署中</Option>
              <Option value="Running">运行中</Option>
              <Option value="Suspend">停止了</Option>
              <Option value="Restarting">重启中</Option>
              <Option value="Unkown">未知中</Option>
              <Option value="Checking">检测中</Option>
              <Option value="Destroyed">销毁了</Option>
            </Select>
          </div>
          <div className="search-group">
            <Label >服务名称</Label>
            <FormControl onKeyPress={this.enterKeyhandle} ref="insName" placeholder="服务名称"/>
          </div>
          <div className="search-group">
            <Label >租户名称</Label>
            <FormControl onKeyPress={this.enterKeyhandle} ref="providerName" placeholder="租户名称"/>
          </div>
          <div className="search-button">
            <Button colors="primary" onClick={this.searchByKey} className="searchKey">查询</Button>
          </div>
        </div>

        <div className="md-tas">
          <Tabs
            defaultActiveKey="redis"
            onChange={this.selectTab}
            renderTabBar={() => <ScrollableInkTabBar />}
            renderTabContent={() => <TabContent />}
          >
            <TabPane tab='Redis' key="redis">
              <List type="redis"
                    active={this.state.tabActive}
                    search={this.state}
              />
            </TabPane>
            <TabPane tab='MySQL' key="mysql">
              <List type="mysql"
                    active={this.state.tabActive}
                    search={
                      this.state
                    }
              />
            </TabPane>
            <TabPane tab='RabbitMQ' key="mq">
              <List type="mq"
                    active={this.state.tabActive}
                    search={
                      this.state
                    }
              />
            </TabPane>
            <TabPane tab='ZooKeeper' key="zk">
              <List type="zk"
                    active={this.state.tabActive}
                    search={
                      this.state
                    }
              />
            </TabPane>

            <TabPane tab='Jenkins' key="jenkins">
              <List type="jenkins"
                    active={this.state.tabActive}
                    search={
                      this.state
                    }
              />
            </TabPane>

            <TabPane tab='Dclb' key="dclb">
              <List type="dclb"
                    active={this.state.tabActive}
                    search={
                      this.state
                    }
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}

export default MainPage;
