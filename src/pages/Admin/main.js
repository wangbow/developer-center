import React, { Component } from 'react';
import axios from 'axios';
import { Row, Col } from 'tinper-bee';
import Title from 'components/Title';
import { err } from 'components/message-util';

import './index.less';

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    }
  }
  componentDidMount() {
    axios.get('/portal/web/v1/manager/searchProvider')
      .then((res) => {
        let data = res.data;
        if(data.error_code){
          return err(`${data.error_code}:${data.error_message}`)
        }
        this.setState({
          data: data.data
        })
      })
  }
  render() {
    let { data } = this.state;
    return (
      <Row className="admin-info">
        <Title name="管理员信息" showBack={false} />
        <div className="admin-info-tile">
          <Row className="admin-info-row">
            <Col sm={4} className="text-right">
              姓名：
            </Col>
            <Col sm={6} mdOffset={2}>
              {data.userName}
            </Col>
          </Row>
          <Row className="admin-info-row">
            <Col sm={4} className="text-right">
              邮箱：
            </Col>
            <Col sm={6} mdOffset={2}>
              {data.userEmail}
            </Col>
          </Row>
          <Row className="admin-info-row">
            <Col sm={4} className="text-right">
              手机号：
            </Col>
            <Col sm={6} mdOffset={2}>
              {data.userMobile}
            </Col>
          </Row>
        </div>
      </Row>
    )
  }

}

export default MainPage;
