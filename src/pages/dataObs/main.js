import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Table } from 'tinper-bee';

import { Link } from 'react-router';
import TIME_INFO from './const/timeInfo';
// self component
import Header from './component/header';

// api
import { getAppList } from '../../serves/panelObsv';
import { getQuery } from './util';

class MainPage extends Component {
  static propTypes = {}
  static defaultProps = {}

  constructor(props) {
    super(props);
    this.state = {
      appList: [],
      appId: '',
      appIdInNum: '',
      timeId: getQuery().timeId || TIME_INFO[0].id,
    }
  }

  componentDidMount() {
    getAppList().then(data => {
      this.setState({
        appList: data,
        appId: getQuery().appId || data[0]['app_id'],
        appIdInNum: getQuery().appIdInNum || data[0]['number_app_id']
      })
    });
  }
  componentWillReceiveProps(np) {

  }
  componentDidUpdate() {
  }

  getGraphData(timeId) {
    return
  }

  handleAppChange = (...val) => {
    let appId = val[0];
    let appIdInNum = val[1];
    this.setState({
      appId: appId,
      appIdInNum,
    })
  }

  handleTimeChange = (id) => {
    this.setState({
      timeId: id,
    })
  }

  render() {
    return (
      <div className="main-page">
        <Header
          defaultAppId={getQuery().appId}
          defaultTimeId={getQuery().timeId}
          options={this.state.appList}
          onChange={this.handleAppChange}
          onChangeTime={this.handleTimeChange}
        />
        <div className="switches">
          <Link
            to={`/default?appIdInNum=${this.state.appIdInNum}&appId=${this.state.appId}&timeId=${this.state.timeId}`}
            className="u-button switch-btn"
            activeClassName="switch-btn__active">
            应用监控总览
          </Link>
          <Link
            to="/userAct"
            className="u-button switch-btn"
            activeClassName="switch-btn__active">
            用户行为分析
          </Link>
          <Link
            to="/browser"
            className="u-button switch-btn"
            activeClassName="switch-btn__active"
          >
            浏览器性能分析</Link>
          <Link
            to="/service"
            className="u-button switch-btn"
            activeClassName="switch-btn__active"
          >
            应用业务分析</Link>
        </div>
        <div className="main-page--body">
          {
            (() => {
              let Child = React.Children.only(this.props.children);
              return React.cloneElement(Child, {
                appId: this.state.appId,
                appIdInNum: this.state.appIdInNum,
                timeId: this.state.timeId,
              })
            })()
          }
        </div>
      </div>
    )
  }
}

export default MainPage;