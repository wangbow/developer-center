import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {Row, Col, Button, Table, InputGroup, FormGroup, FormControl, Icon, Popconfirm} from 'tinper-bee';

import Title from 'components/Title';
import {GetConfigAppFromCenter, SearchConfigAppFromCenter, deleteApp}from 'serves/confCenter';
import PageLoading from 'components/loading';

import { List, Control } from '../../components';
import {err, success} from 'components/message-util';

import './index.less'

class ListPage extends Component {
  state = {
    data: [],
    showLoading: true
  }

  componentDidMount() {
    this.getConfigApp();
  }

  getConfigApp = () => {
    GetConfigAppFromCenter().then((res) => {
      if (res.data.success === 'true') {
        let data = res.data.page.result;
        data.forEach((item, index) => {
          item.key = index
        })
        this.setState({
          data: data,
          showLoading: false
        })
      } else {
        err(res.data.error_message);
        this.setState({
          showLoading: false
        })
      }
    }).catch((e) => {
      err(e.response.data.error_message);
    })
  }

  /**
   * 搜索
   */
  handleSearch = (value) => () => {
    SearchConfigAppFromCenter(`?name=${value}&pageIndex=0&pageSize=10`)
      .then((res) => {
      if (res.data.error_code) {
        err(res.data.error_message);
      } else {
        let data = res.data.page.result;
        data.forEach((item, index) => {
          item.key = index
        })
        this.setState({
          data: data
        })
      }
    }).catch((e) => {
      err(e.response.data.error_message);
    })
  }

  render() {
    return (
      <Row className="app-setting">
        <Title name="应用列表" showBack={ false }/>
        <Control onSearch={ this.handleSearch } />
        <List showLoading={ this.state.showLoading } data={ this.state.data } refresh={ this.getConfigApp } />
        <PageLoading show={ this.state.showLoading } />
      </Row>
    )
  }
}


export default ListPage;
