import React, { Component, PropTypes } from 'react';
import { Row, Col, Switch, Tooltip, Button, Select, Table, Message, Popconfirm, Icon, FormControl } from 'tinper-bee';
import classnames from 'classnames';
import './index.less';
import MiroAuthPage from '../../../appManager/components/miro-auth-page';
import SwitchConfirm from '../switch-confirm';
import CurrentLimit from '../mscon-limit';
import OverlayTrigger from 'bee-overlay/build/OverlayTrigger';
import { err, warn, success } from 'components/message-util';


class ServerTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data_service_list: this.props.data_service_list,
      showModal: false,
      service_name: "",
      num: false,
      verQps: false,
      verThreadCount: false,
      metaId: "",
      resId: "",
      userPriviledge: "",
      changeIndex: props.changeIndex || "",
      envType: props.envType,
      param: ""
    };

    this.columnsServer = [{
      title: '服务名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, rec, index) => {
        return (
          <span className="nameColor" onClick={this.handleClickTable(rec['name'])}> {rec["name"]}</span>
        )
      }
    }, {
      title: '今日调用次数',
      dataIndex: 'callHits',
      key: 'callHits'
    }, {
      title: '调用成功率',
      dataIndex: 'successPercent',
      key: 'successPercent',
      render: (text, rec) => {
        return <span>{rec.successPercent ? (parseInt(rec.successPercent) + "%") : ""} </span>
      }
    }, {
      title: '描述',
      dataIndex: 'note',
      key: 'note'

    }, {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      render: (text, rec, index) => {
        return (
          <div className="serverTable-btn">
            <span onClick={this.handleClick(rec, 'auth')}>
              权限
                        </span>

            <span className="margin-left-10" onClick={this.handleClick(rec, 'link')}>
              链路
                        </span>
            <span className="margin-left-10" onClick={this.handleClick(rec, 'cardlimit')}>
              限流
                        </span>

            {/*<span className="margin-left-10"  onClick={this.handleClick(rec, 'rely')}>
              依赖
                        </span>
            <span className="margin-left-10"  onClick={this.handleClick(rec, 'statis')}>
              统计
                        </span>
              */}          
          </div>
        )
      }

    }, {
      title: '设为私有',
      dataIndex: 'dr',
      key: 'dr',
      render: (text, rec, index) => {
        let auth = rec.auth;
        let metaId = rec.id;
        let serviceName = rec.name;
        let paramsString = rec.paramTypeList.toString();
        let resId = rec.interfaceName + "." + serviceName + `(${paramsString})`;
        let defaultIndex = index;
        return (
          <SwitchConfirm
            checked={auth == "public" ? false : true}
            resId={resId}
            metaId={metaId}
            name={name}
            defaultIndex={defaultIndex}
            onChangeHandler={(metaId, resId, userPriviledge, defaultIndex) => {
              this.changeHandle(metaId, resId, userPriviledge, defaultIndex)()
            }}
          />

        )

      }

    }];
  }

  // lifeCyle hooks
  componentDidMount() {

  }

  /**
   * 调用switch的父组件进行数据交互
   */
  changeHandle = (metaId, resId, userPriviledge, defaultIndex) => (e) => {
    let { switchonClick } = this.props;
    let { data_service_list } = this.state;
    if (switchonClick) {
      for (var i = 0; i < data_service_list.length; i++) {
        if (i == defaultIndex) {
          data_service_list[i].auth == "public" ? data_service_list[i].auth = "private" : data_service_list[i].auth = "public";
        }
      }

      this.setState({
        data_service_list: data_service_list
      }, () => {
        switchonClick(metaId, resId, userPriviledge, defaultIndex);
      });

    }
  }

  /**
    *
    * 监听父组件props的变化，用来更新展示的table
    */
  componentWillReceiveProps(nextProps) {
    let { data_service_list } = nextProps;
    this.setState({
      data_service_list: data_service_list
    })
  }
  /**
   * 调用父类的方法，吧当前服务的名称当做参数
   */
  getValue = (value) => {
    const { getSencond } = this.props;
    if (getSencond) {
      getSencond(value);
    }

  }
  /**
   * 获取当前table服务的名称
   */
  handleClickTable = (value) => (e) => {
    return this.getValue(value)
  }

  /**
   * 调用父组件，更改状态的方法
   */
  changeState = (value) => () => {
    let { changeState } = this.props;
    if (changeState) {
      changeState();
    }
  }
  /**
    * 获取请求参数
    */
  getParam = (rec) => {
    if (rec.paramTypeList && rec.paramTypeList.length > 0) {
      let param = rec.paramTypeList.toString();
      return "(" + param + ")";
    } else {
      return ""
    }
  }
  /**
   * 点击table里面每个操作,执行不同的行为
   */
  handleClick = (rec, name) => (e) => {
    let resId, params = '';
    let { flag, appCode, changeParentState, interface_name } = this.props;
    if (rec.paramTypeList) {
      params = rec.paramTypeList.join(',');
    }
    resId = `${rec.interfaceName}.${rec.name}(${params})`;
    let serviceName = rec.name;
    let authFlag = rec.auth;
    if (changeParentState) {

      switch (name) {
        case 'auth':
          if (authFlag == "public") {
            return warn('公有权限不能进行授权操作');
          } else {
            changeParentState("11", interface_name, rec.name, resId);
          }

          break;
        case 'link':
          changeParentState("12", interface_name, rec.name);
          break;
        case 'cardlimit':
          this.setState({
            showModal: true,
            service_name: rec.name,
            num: true,
            param: this.getParam(rec)
          })
          break;
        case 'rely':
          changeParentState("14", interface_name, rec.name);
          break;
         // return warn("正在开发ing");
        case 'statis':
          changeParentState("15", interface_name, rec.name);
          break;
          // return warn("正在开发ing");

      }
    }


  }


  goOperate = () => {

  }

  /**
    * 模态框被点击确认，关闭模态框
    */
  handleConfirm = () => {
    this.setState({
      showModal: false,
      num: false,
      verQps: false,
      verThreadCount: false
    });
  }
  /**
    * 模态框被点击关闭，关闭模态框
    */
  close = () => {
    this.setState({
      showModal: false,
      num: false,
      verQps: false,
      verThreadCount: false
    });
  }

  changeNum = () => {
    this.setState({
      num: false
    });
  }

  changeNumVer = (flag, name) => (e) => {
    if (flag && name == "qps") {
      this.setState(function (prevState, props) {
        return { verQps: true }
      });
    }
    if (flag && name == "threadCount") {
      this.setState(function (prevState, props) {
        return { verThreadCount: true }
      });
    }
    if (flag == false && name == "qps") {
      this.setState(function (prevState, props) {
        return { verQps: false }
      });
    }
    if (flag == false && name == "threadCount") {
      this.setState(function (prevState, props) {
        return { verThreadCount: false }
      });
    }

  }

  render() {
    let { data_service_list, showModal, service_name, num, verQps, verThreadCount, envType, param } = this.state;
    let { appCode, interface_name } = this.props;
    return (
      <Row className="serverTableWrap">
        <Col md={12} sm={12}>
          <div>
            <Table
              data={this.state.data_service_list}
              rowKey={(rec, index) => {
                return rec['id']
              }}
              columns={this.columnsServer}

            />
          </div>
        </Col>
        <CurrentLimit
          showModal={showModal}
          appCode={appCode}
          param={param}
          num={num}
          verQps={verQps}
          verThreadCount={verThreadCount}
          envType={envType}
          changeNum={this.changeNum}
          changeNumVer={(flag, name) => this.changeNumVer(flag, name)()}
          interface_name={interface_name}
          service_name={service_name}
          onConfirm={this.handleConfirm}
          close={this.close}
        />

      </Row>
    )
  }
}


export default ServerTable;
