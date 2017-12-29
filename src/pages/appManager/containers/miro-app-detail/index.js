import React, {Component, PropTypes, cloneElement} from 'react';
import {
  Con,
  Col,
  Breadcrumb,
  Row,
  Button,
  Table,
  PanelGroup,
  Badge,
  ButtonGroup,
  Tooltip,
  ProgressBar,
  Icon,
  Popover,
  Message,
  InputGroup,
  FormControl,
  Popconfirm,
} from 'tinper-bee';

import Tabs, {TabPane} from 'rc-tabs';
import TabContent from 'rc-tabs/lib/TabContent';
import ScrollableInkTabBar from 'rc-tabs/lib/ScrollableInkTabBar';
import{getQuickPublishInfo, quickPublish} from 'serves/CI';



import {
  GetNewPublishDetail,
  PublishLogs,
  GetVersionList,
  OndeleteAppUploadLog,
  OnRepealAppAliOssUpload,
} from 'serves/appTile';
import {lintAppListData} from 'components/util';

import { MiroAppInfo } from '../../components';

import classnames from 'classnames';
import { err } from 'components/message-util';

import 'rc-tabs/assets/index.css';
import './index.less';

import MircoServer from '../../../mscon-server/component/mscon-home';
import LookInstance from '../../components/appManager-instance';
import { getQueryString } from '../../../../components/util';

class MiroAppDetail extends Component {
  state = {
    data: {},
    activeKey:getQueryString("activeKey") || "1",
  }

 /* componentWillMount() {
    let { params } = this.props;
    this.data = [{
      key: `/miro-detail/${params.id}/instance`,
      name: '实例',
      component: <LookInstance />,
    }, {
      key: `/miro-detail/${params.id}/mircoServer`,
      name: '微服务',
      component: <MircoServer />,
    }];

  }
  */

  componentDidMount() {
    let { params } = this.props;

    //校验时候无应用
    GetNewPublishDetail(params.id).then((res) => {
      if (res.data.error_code) {
        err(res.data.error_message);
      } else {

        this.setState({
          data: res.data
        })

      }
    })
  }

  onChange = (key) => {
    this.setState({
      activeKey: key
    })

    // window.location.hash = key;
  }


  render() {
    let { data,activeKey } = this.state;
    let envType = this.props.location.query.envType||"pro";
 /*   let activeKey = this.data[0].key;
    const { children } = this.props;
    if (children) {
      this.data.forEach((d) => {
        if (d.component.type === children.type) {
          d.component = cloneElement(children, { appCode: data.app_code ,id:data.id});
          activeKey = d.key;
        }
      });
    }*/
   // const tabs = this.data.map(d => <TabPane key={d.key} tab={d.name}>{d.component}</TabPane>);

    return (
      <Col md={12}>
        <MiroAppInfo
          data={ data }
        />
        <Col md={12} className="detail" style={{marginTop: 30, padding: '0 40px'}}>
          <Tabs
            destroyInactiveTabPane
            defaultActiveKey={activeKey?activeKey:"2"}
            onChange={this.onChange}
            renderTabBar={() => <ScrollableInkTabBar />}
            renderTabContent={() => <TabContent />}>
            <TabPane tab="实例" key="1">
                <LookInstance appCode={ data.app_code } id={data.id} envType ={envType}/>
            </TabPane>
            <TabPane tab="微服务" key="2">
                <MircoServer appCode={ data.app_code } id={data.id} envType ={envType}/>
            </TabPane>
          </Tabs>
        </Col>
      </Col>

    )
  }

}

MiroAppDetail.contextTypes = {
  router: PropTypes.object
};

export default MiroAppDetail;
