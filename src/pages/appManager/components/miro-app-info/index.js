import React, {Component, PropTypes} from 'react';
import {Row, ProgressBar, Col, Icon, Button, Message, Badge} from 'tinper-bee';

import {ImageIcon} from 'components/ImageIcon';
import Title from 'components/Title';

import {
  formateDate,
  getCookie
} from 'components/util';

import './index.less';


class MiroAppInfo extends Component {
  static contextTypes = {
    router: PropTypes.object
  }

  /**
   * 权限管理
   */
  goToAuth = () => {
    let {data} = this.props;

    this.context.router.push(`/auth/${data.name}?id=${data.id}&providerId=${getCookie('u_providerid')}&busiCode=app_manager&userId=${data.userId}`);
  }



  render() {
    let {
      data,
      publishInfo
    } = this.props;

    return (
      <Row className="miro-detail">
        <Title name={data.appName}/>
        <div className="detail-bg">
          <div className="tile-cricle">
            <div className="tile-img">
              {
                ImageIcon(data.iconPath, 'head-img')
              }
            </div>
          </div>
          <span className="title">
        {data.name}
        </span>
          <span className="time">
                <Icon type="uf-time-c-o"/>
            {data.updateTime}
            </span>
          <div className="btn-group">
            {
              data.permission === 1 ? (
                <span
                  className="btn"
                  onClick={this.goToAuth}>
                     <i className="cl cl-permission"/>
                      权限管理
                  </span>
              ) : null
            }
          </div>
        </div>

        <div className="miro-detail-info">
          <Col sm={6}>
            <div className="ipass-list">
              <div className="label">应用编码</div>
              <div className="value green-500">{data.app_code}</div>
            </div>
          </Col>

        </div>

      </Row>

    )
  }
}


export default MiroAppInfo;
