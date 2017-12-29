import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';
import {
  Con,
  Col,
  Breadcrumb,
  Row,
  Button,
  Table,
  PanelGroup,
  Badge,
  Tooltip,
  ProgressBar,
  Popover,
  Message,
  Icon,
  InputGroup,
  FormControl,
  ButtonGroup
} from 'tinper-bee';
import OverlayTrigger from 'bee-overlay/build/OverlayTrigger';
import InputNumber from 'bee-input-number';
import "bee-input-number/build/InputNumber.css";

import {ConfigFile, AutoTest} from '../components';

import imgempty from '../../../assets/img/taskEmpty.png';
import MircoServer from '../../mscon-server/component/mscon-home';

import {
  AppRestart,
  AppDestory,
  AppScale,
  GetPublicConsole,
  NoticeStart,
  GetNewPublishDetail,
  GetCanSale,
  GetConvertapp,
  GetFreeTime
} from '../../../serves/appTile';


import Tabs, {TabPane} from 'rc-tabs';
import TabContent from 'rc-tabs/lib/TabContent';
import ScrollableInkTabBar from 'rc-tabs/lib/ScrollableInkTabBar';
import 'rc-tabs/assets/index.css';
import '../index.css';

import {lintAppListData, splitParam, getCookie} from '../../../components/util';
import ShowOperVersionModal from './showOperVersionModal';
import ShowOperVersionRollbackModal from './showOperVersionRollbackModal';
import EventRecord from './eventRecord';
import ListenceEchart from './listenceEchart';
import TaskInstance from './taskInstance';
import MainPage from '../../domain/Main';
import {history} from "react-router";

import PublishConsole from './publishConsole';
import Configuration from './configuration';
import ShowPauseModal from '../../../components/ShowPauseModal'
import ImageDetailModal from '../../../components/ImageDetailModal';
import {ImageIcon} from '../../../components/ImageIcon';
import Title from '../../../components/Title';
const Panel = PanelGroup.Panel;
import RuleConfig from '../obs-rules/main';


class PublishDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      publishdetail: '', //详情信息
      panelActiveKey: '1', //tab actove key
      currentId: '', //当前appid 三位数
      runState: '', //上架状态
      publish_type: '',
      showPauseModalFlag: false, //显示重暂停modal flag
      togglePauseFlag: true, //toggle暂停按钮modal flag
      showRestartModalFlag: false, //显示重启modal flag
      showDestoryModalFlag: false, //显示销毁modal flag
      showImgInfoModalFlag: false, //显示镜像modal flag
      forbidTaskUploadFlag: false, //组织子组件更新flag
      showOperVersionFlag: false, //回滚组件更新flag
      remain: {
        day: 9,
        hour: 21
      },
      intervalByVariable: "",
      countDom: {days: null, minutes: null, hours: null, seconds: null},
      isFreeFlag: false,
      showEmpty: false,
      statusData: {},
      instancesNum: 0,
      instanceEdit: false,

    }

    this.changePanelKey = this.changePanelKey.bind(this);
    this.onScale = this.onScale.bind(this);
    this.onDestory = this.onDestory.bind(this);
    this.onRestart = this.onRestart.bind(this);
    this.interDetail = this.interDetail.bind(this);
    this.getNewPublishDetail = this.getNewPublishDetail.bind(this);
    this.validateDila = this.validateDila.bind(this);
    this.onDilatate = this.onDilatate.bind(this);
    this.validateFun = this.validateFun.bind(this);
    this.onGroundStore = this.onGroundStore.bind(this);
    this.onStart = this.onStart.bind(this);
    this.showPauseModal = this.showPauseModal.bind(this);
    this.showDestoryModal = this.showDestoryModal.bind(this);
    this.showRestartModal = this.showRestartModal.bind(this);
    this.onShowImgInfoModal = this.onShowImgInfoModal.bind(this);
    this.hideDestoryModal = this.hideDestoryModal.bind(this);
    this.getNewPublishStatus = this.getNewPublishStatus.bind(this);

  }

  componentDidMount() {
    const {params} = this.props;

    let self = this;

    //刚跳进来不延时
    this.getNewPublishDetail();
    this.interDetail(2000);
    this.getFreeTime();

    //校验时候无应用
    console.log(params);

    GetNewPublishDetail(params.id).then(function (response) {
      if (response.data.error_code) {
        self.setState({
          showEmpty: true
        })
      } else {
        let newList = lintAppListData(response, null, null);

        if (newList.status == "暂停") {
          self.setState({togglePauseFlag: false});
          //this.state.togglePauseFlag
        }
        if (location.query && location.query.key == '6') {
          //从部署直接过来详情页
          self.setState({
            panelActiveKey: '6',
          });
        } else if (location.query && location.query.runState) {
          //从列表页直接过来详情页
          self.setState({
            runState: location.query.runState,
          });
        }


        self.setState({
          publishdetail: newList,
          currentId: Number(params.id),
          publish_type: response.data.publish_type,
          instancesNum: newList.instances
        })

        //self.interDetail(2000);
        self.getFreeTime();
      }
    })
  }

  componentWillUnmount() {
    window.clearInterval(this.detailTimer);
    window.clearInterval(this.IntervalCounterTimer);
  }

  /**
   * 获取应用剩余使用时间
   */
  getFreeTime = () => {
    let self = this;
    GetFreeTime(this.props.params.id, function (response) {
      let res = lintAppListData(response, null, null);
      self.setState({isFreeFlag: res.is_free});
      if (!res.is_free) return;
      self.renderCountDonw(res.time_left, function (time) {
        self.interCountTime(time, res.time_left);
      });
    })
  }

  /**
   * 获取详情
   */
  getNewPublishDetail(time) {
    let self = this;
    const {params, location} = this.props;
    GetNewPublishDetail(params.id).then(function (response) {
      let newList = lintAppListData(response, null, null);

      if (newList.error_code) {
        window.clearInterval(self.detailTimer)
      }
      if (newList.status == "暂停") {
        self.setState({togglePauseFlag: false});
        //this.state.togglePauseFlag
      }
      if (location.query && location.query.key == '6') {
        //从部署直接过来详情页
        self.setState({
          panelActiveKey: '6',
        });
      } else if (location.query && location.query.runState) {
        //从列表页直接过来详情页
        self.setState({
          runState: location.query.runState,
        });
      }

      self.setState({
        publishdetail: newList,
        instancesNum: newList.instances,
        currentId: Number(params.id),
      })

    }).catch(function () {
      window.clearInterval(self.detailTimer)
    })

  }

  /**
   * 循环获取状态
   */
  getNewPublishStatus(time) {
    let self = this;
    const {params, location} = this.props;
    GetNewPublishDetail(params.id).then(function (response) {
      let newList = lintAppListData(response, null, null);

      if (newList.error_code) {
        window.clearInterval(self.detailTimer)
      }
      if (newList.status == "暂停") {
        self.setState({togglePauseFlag: false});
        //this.state.togglePauseFlag
      }

      self.setState({
        statusData: newList
      })

    }).catch(function () {
      window.clearInterval(self.detailTimer)
    })

  }

  /**
   * 轮询获取详情
   */
  interDetail(time) {
    let self = this;

    self.detailTimer = setInterval(function () {
      self.getNewPublishStatus();
    }, time);
  }

  /**
   * 启动成功通知后台
   */
  noticeStart = () => {

    let {logId, offset, appName, appId} = this.props.location.query;

    if (logId) {
      let param = `?info=texttobeappend&logid=${logId}&offset=${offset}&appid=${appId}&appname=${appName}`;

      NoticeStart(param, (res) => {
        if (res.data === 'ok') {

        } else {
          Message.create({
            content: res.data,
            color: 'danger',
            duration: null
          })
        }
      })
    }

  }

  /**
   * tab切换 key设置
   */
  changePanelKey(panelActiveKey) {
    this.setState({panelActiveKey: panelActiveKey});
  }

  /**
   * 显示镜像modal
   */
  onShowImgInfoModal() {
    this.setState({showImgInfoModalFlag: !this.state.showImgInfoModalFlag});
  }

  /**
   * 重启后的回调
   */
  onRestart() {
    let id = this.state.currentId;
    let self = this;
    self.setState({
      showRestartModalFlag: false
    });
    AppRestart(id, function (response) {
      lintAppListData(response, null, '正在重启...');
      //手动隐藏modal
    })
  }

  /**
   * 显示暂停modal
   */
  showPauseModal() {
    this.setState({showPauseModalFlag: !this.state.showPauseModalFlag});
  }

  /**
   * 显示重启modal
   */
  showRestartModal() {
    this.setState({showRestartModalFlag: !this.state.showRestartModalFlag});
  }

  /**
   * 显示销毁modal
   */
  showDestoryModal() {
    this.setState({showDestoryModalFlag: !this.state.showDestoryModalFlag});
    //提前销毁轮询 避免销毁后轮询还在栈中
    window.clearInterval(this.detailTimer)
    delete this.detailTimer;

  }

  /**
   * 销毁modal cancel后的回调
   */
  hideDestoryModal() {
    //如果modal点击了取消，重新轮询
    if (!this.detailTimer) {
      this.interDetail(3000);
    }
    //手动隐藏销毁modal
    this.setState({showDestoryModalFlag: !this.state.showDestoryModalFlag});
  }

  /**
   * 暂停后启动应用 默认实例参数为1
   */
  onStart() {
    let instances = 1;
    let id = this.state.currentId;
    let self = this;
    AppScale({id, instances}, function (response) {
      lintAppListData(response, null, '正在启动中...');
      self.setState({togglePauseFlag: !self.state.togglePauseFlag});
    })
  }

  /**
   * 暂停应用
   */
  onScale() {
    let id = this.state.currentId;
    let instances = 0;
    let self = this;
    self.setState({
      showPauseModalFlag: false
    });
    AppScale({id, instances}, function (response) {
      lintAppListData(response, null, '暂停成功');
      //1.toggle暂停按钮切换，2。手动隐藏弹窗
      self.setState({
        togglePauseFlag: !self.state.togglePauseFlag,
      });
    })
  }

  /**
   * 销毁应用
   */
  onDestory() {
    let id = this.state.currentId;
    let self = this;
    self.setState({
      showDestoryModalFlag: false
    })
    AppDestory(id, function (response) {
      let data = lintAppListData(response, null, '销毁成功');
      if (!data || data.error_code) {
        self.interDetail(5000);
        return;
      }
      //设置forbidTaskUploadFlag为true,为防止setstate之后重新render TAB也签下的子组件
      // 子组件会根据父组件的更新而去轮询接口，销毁后接口查询不到数据
      self.setState({forbidTaskUploadFlag: true});
      self.context.router.push('/?delete=true');
    })

  }

  /**
   * 扩缩应用
   */
  onDilatate = () => {
    let id = this.state.currentId
    let instances = this.state.instancesNum;


    let self = this;
    this.setState({
      instanceEdit: false
    })
    AppScale({id, instances}, function (response) {
      lintAppListData(response, null, '正在扩容中...');
      self.setState({
        togglePauseFlag: true,
      });
      ReactDom.findDOMNode(self.refs.dilaValue).value = "";
      self.interDetail(5000);
    })
  }

  /**
   * 当填写input框 onchange触发 验证扩缩数值
   */

  validateDila(value) {
    this.setState({
      instanceEdit:true,
      instancesNum: value
    });
    //this.validateFun(value);
  }

  /**
   * 验证扩缩数值
   */
  validateFun(value) {

  }

  /**
   * 上架应用
   */
  onGroundStore() {
    let appId = this.state.publishdetail.app_id;
    let detailRunState = this.props.location.query.runState;
    /**
     * detailRunState==-1 应用从未上架过
     * detailRunState==2 || detailRunState==3 应用上架成功或者正在申请中 则调用以前上架id，下一步是去查看上架信息
     * detailRunState==1 || detailRunState==4 || detailRunState==5 应用上架曾经失败，但已经存在上架id,则调用以前上架id，再去上架
     */

    //https://uastest.yyuap.com/
    if (detailRunState == -1) {
      GetCanSale(function (response) {
        let res = lintAppListData(response, null, null);
        let url = encodeURIComponent("https://uastest.yyuap.com/market/operations#/productRelease/ext/add/" + appId)
        if (res.certificationStatus == 1) {
          window.open("https://uastest.yyuap.com/market/jump.jsp?target=" + url);
        } else {
          Message.create({content: "服务商店铺审核未通过", color: 'warning', duration: 4.5});
        }
      })
    } else if (detailRunState == 2 || detailRunState == 3) {
      GetConvertapp(splitParam({dev_appid: appId})).then(function (response) {
        let dev = lintAppListData(response, null, null);
        let dev_id = dev.detailMsg.data;
        if (!dev_id || dev_id.error_code) return;
        window.open("https://uastest.yyuap.com/market/product/preview/" + dev_id);
      })
    } else {
      GetConvertapp(splitParam({dev_appid: appId})).then(function (response) {
        let dev = lintAppListData(response, null, null);
        let dev_id = dev.detailMsg.data;
        if (!dev_id || dev_id.error_code) return;
        GetCanSale(function (response) {
          let res = lintAppListData(response, null, null);
          if (res.certificationStatus == 1) {
            window.open("https://uastest.yyuap.com/market/operations#/productRelease/add/add/" + dev_id);
          } else {
            Message.create({content: "服务商店铺审核未通过", color: 'warning', duration: 4.5});
          }
        })
      })
    }
  }

  onShowOperVersionModal = () => {
    this.setState({showOperVersionFlag: true});
  }

  hideOperVersion = () => {
    this.setState({showOperVersionFlag: false});
  }

  onOperVersion = () => {
    this.setState({showOperVersionFlag: false});
  }

  upInstanceNum = (num) => {
    let self = this;
    let realInstance = this.state.publishdetail.instances;

    if (num == -1 && self.state.instancesNum == 0) {
      return;
    }
    return function () {
      let instances = ReactDom.findDOMNode(self.refs.dilaValue).value;
      ReactDom.findDOMNode(self.refs.dilaValue).value = Number(instances) + num;
      self.setState({instancesNum: ReactDom.findDOMNode(self.refs.dilaValue).value});
    }
  }

  cancleDilate = () => {

    let { publishdetail } = this.state;
    this.setState({
      instancesNum: publishdetail.instances,
      instanceEdit: false
    });
  }

  interCountTime = (intervalByVariable, countTime) => {
    if (!intervalByVariable) return;
    let self = this;
    self.IntervalCounterTimer = setInterval(function () {

      countTime = countTime - intervalByVariable / 1000;

      if (countTime < 1) {
        window.clearInterval(self.IntervalCounterTimer);
      }

      self.renderCountDonw(countTime);
    }, intervalByVariable);
  }

  hasOwner = () => {

  }

  /**
   * 权限管理
   */
  goToAuth = () => {
    let {publishdetail} = this.state;

    this.context.router.push(`/auth/${publishdetail.name}?id=${publishdetail.id}&providerId=${getCookie('u_providerid')}&busiCode=app_manager&userId=${publishdetail.user_id}`);
  }

  renderCountDonw(time1, callback) {
    if (!time1 || time1 < 0) return {days: null, hours: null, minutes: null, seconds: 0};
    let years;
    let months;
    let days;
    let hours;
    let minutes;
    let seconds = time1;
    if (seconds <= 60) {
      this.setState({
        intervalByVariable: "seconds",
        countDom: {days: null, hours: null, minutes: null, seconds: Math.floor(seconds)},
      })
      if (callback) {
        callback(1000);
      }
      return;
    } else {
      minutes = seconds / 60;
    }

    if (minutes <= 60) {
      this.setState({
        intervalByVariable: "seconds",
        countDom: {
          minutes: Math.floor(minutes),
          seconds: Math.floor((minutes - Math.floor(minutes)) * 60),
          days: null,
          hours: null
        },
      })
      if (callback) {
        callback(1000);
      }
      return;
    } else {
      hours = minutes / 60;
    }

    if (hours <= 24) {
      this.setState({
        intervalByVariable: "minutes",
        countDom: {
          hours: Math.floor(hours),
          minutes: Math.floor((hours - Math.floor(hours)) * 60),
          days: null,
          seconds: null
        },
      })
      if (callback) {
        callback(60000);
      }
      return;
    } else {
      days = hours / 24;
      this.setState({
        intervalByVariable: "hours",
        countDom: {
          days: Math.floor(days),
          hours: Math.floor((days - Math.floor(days)) * 24),
          minutes: null,
          seconds: null,
        },
      })
      if (callback) {
        callback(240000);
      }
      return;
    }
  }

  goBack = () => {
    this.context.router.push('/');
  }

  //<ShowOperVersionModal show={this.state.showOperVersionFlag} onCancelCallBack={this.hideOperVersion} onConfirmShowKey={this.onOperVersion} title="回滚" />
  //<Button shape="squared" bordered  size="sm"  onClick={this.onShowOperVersionModal}><i className="cl cl-del"  style={{ fontSize: 12 }}></i>升级</Button>
  //<Button shape="squared" bordered  size="sm"  onClick={this.onShowOperVersionModal}><i className="cl cl-del"  style={{ fontSize: 12 }}></i>回滚</Button>
  render() {
    if (!this.state.publishdetail) return <span></span>;

    let {statusData} = this.state;

    let data = this.state.publishdetail;


    const tooltipHeathy = function (statusData) {
      return (
        <Tooltip inverse id="healty" positionTop="20px">
          <span>健康：{statusData.healthy}</span>
          <span>部署：{statusData.deployments}</span>
          <span>异常：{statusData.unhealthy}</span>
          <span>等待：{statusData.wait}</span>
          <span>未知：{statusData.instances - statusData.healthy - statusData.unhealthy - statusData.deployments - statusData.wait}</span>
        </Tooltip>
      );
    }
    const getLongValue = function (data) {
      return (
        <Tooltip inverse id="longValue" positionTop="20px">
          <span>{data}</span>
        </Tooltip>
      );
    }

    let tabActiveKey = this.props.location.query.key;
    let detailRunState = this.props.location.query.runState;
    let {app_id, appUploadId} = this.state.publishdetail;

    let envType = this.props.location.query.envType||"pro";

    return (
      <div>
        {
          this.state.showEmpty ? (
            <div className="text-center">
              <img src={imgempty} alt="" width="300"/>
              <p>当前应用出现不可预知的错误，请删除当前应用。</p>
              <Button
                shape="squared"
                colors="primary"
                style={{marginTop: 30}}
                onClick={ this.onDestory }>
                删除
              </Button>
              <Button
                shape="squared"
                colors="primary"
                style={{marginTop: 30, marginLeft: 50}}
                onClick={ this.goBack }
                bordered>
                返回
              </Button>
            </div>
          ) : (
            <div>
              <Title path="/" name={data.name || data.appName}/>
              <div className="detail-bg">
                <div className="tile-cricle">
                  <div className="tile-img">
                    {
                      //<img src={`http:\/\/${data.iconPath}`}  className="imgCust"/>
                      ImageIcon(data.iconPath, 'head-img')
                    }
                  </div>
                </div>
                <div className="title">
                  {data.name || data.appName}
                  <div className="state">
                    {Number(detailRunState) == 1 && (<Badge colors="primary">未上架</Badge>)}
                    {Number(detailRunState) == 2 && (<Badge colors="primary">上架申请中</Badge>)}
                    {Number(detailRunState) == 3 && (<Badge colors="primary">已上架</Badge>)}
                    {Number(detailRunState) == 4 && (<Badge colors="primary">上架审批未通过</Badge>)}
                    {Number(detailRunState) == 5 && (<Badge colors="primary">已下架</Badge>)}
                    {this.state.isFreeFlag &&
                    <div className="count-down">
                      <span>剩余使用期限</span>
                      {typeof(this.state.countDom.days) == "number" && <span><span
                        className="count-time-info">{this.state.countDom.days}</span>天</span>}
                      {typeof(this.state.countDom.hours) == "number" &&
                      <span><span className="count-time-info">{this.state.countDom.hours}</span>小时</span>}
                      {typeof(this.state.countDom.minutes) == "number" &&
                      <span><span className="count-time-info">{this.state.countDom.minutes}</span>分钟</span>}
                      {typeof(this.state.countDom.seconds) == "number" &&
                      <span><span className="count-time-info">{this.state.countDom.seconds}</span>秒</span>}
                    </div>}
                  </div>

                </div>
                <div className="health">
                  {
                    (statusData.healthy + statusData.unhealthy + statusData.deployments + statusData.wait) != 0 &&
                    (
                      <OverlayTrigger overlay={tooltipHeathy(statusData)} placement="bottom">
                        <ProgressBar size="xs">

                          <ProgressBar colors="success"
                                       now={statusData.healthy / statusData.instances * 100}/>
                          <ProgressBar colors="primary"
                                       now={statusData.deployments / statusData.instances * 100}/>
                          <ProgressBar colors="danger"
                                       now={statusData.unhealthy / statusData.instances * 100}/>
                          <ProgressBar colors="dark"
                                       now={statusData.wait / statusData.instances * 100}/>
                          <ProgressBar colors="dark"
                                       now={(statusData.instances - statusData.healthy - statusData.unhealthy - statusData.deployments - statusData.wait) / statusData.instances * 100}/>

                        </ProgressBar>
                      </OverlayTrigger>
                    )
                  }

                  {
                    (statusData.healthy + statusData.unhealthy + statusData.deployments + statusData.wait) == 0 &&
                    (
                      <OverlayTrigger overlay={tooltipHeathy(statusData)} placement="bottom">
                        <ProgressBar size="xs" now={0}>
                        </ProgressBar>
                      </OverlayTrigger>
                    )
                  }
                </div>
                <span className="time">
                                        <Icon type="uf-time-c-o"/>
                  { data.updateTime }
                                    </span>
                <div className="btn-group">
                  {
                    this.state.togglePauseFlag &&
                    (
                      <span
                        className="btn"
                        onClick={this.showPauseModal}>
                                                    <i className="cl cl-suspend"/>
                                                    暂停
                                                </span>
                    )
                  }
                  {
                    !this.state.togglePauseFlag &&
                    (
                      <span
                        className="btn"
                        onClick={this.onStart}>
                                                    <i className="cl cl-start"/>
                                                    启动
                                                </span>
                    )
                  }

                  {
                    this.state.togglePauseFlag &&
                    (
                      <span
                        className="btn"
                        onClick={this.showRestartModal}>
                                                    <i
                                                      className="cl cl-restar"
                                                    />
                                                    重启
                                                </span>
                    )
                  }
                  <span
                    className="btn"
                    onClick={this.showDestoryModal}>
                                            <i className="cl cl-del"/>
                                            销毁
                                        </span>
                  {
                    data.container ? (
                      <ShowOperVersionModal
                        id={this.state.currentId}
                        appCode={ data.app_code}
                        env={ data.env }
                        overlay={data.container.docker.image}
                        image={data.container.docker.image}
                      />
                    ) : null
                  }
                  {
                    data.container ? (
                      <ShowOperVersionRollbackModal
                        id={this.state.currentId}
                        appCode={ data.app_code}
                        env={ data.env }
                        overlay={data.container.docker.image}
                        image={data.container.docker.image}
                      />
                    ) : null
                  }


                  {
                    this.state.publishdetail.permission === 1 ? (
                      <span
                        className="btn"
                        onClick={this.goToAuth}>
                        <i className="cl cl-permission"/>
                        权限管理
                      </span>
                    ) : null

                  }

                  {
                    Number(detailRunState) != 2 && Number(detailRunState) != 3 && (
                      <span
                        className="btn"
                        onClick={this.onGroundStore}>
                                                <i
                                                  className="cl cl-shop"
                                                />
                                                上架
                                        </span>
                    )
                  }
                  {(Number(detailRunState) == 2 || Number(detailRunState) == 3) && (
                    <span
                      className="btn"
                      onClick={this.onGroundStore}>
                                            <i
                                              className="cl cl-rmb-s-o"
                                            />
                                            查看上架详情
                                        </span>
                  )}
                </div>
              </div>
              <Col md={12} className="detail">
                <Col md={12}>
                  <Col md={5} sm={12} className="padding-left-none">
                    <div className="ipass-list">
                      <span className="label">域名</span>
                      <OverlayTrigger overlay={getLongValue(data.domain)} placement="bottom">
                                                <span className="value collapse-text"><a target="_blank"
                                                                                         style={{color: '#0084ff'}}
                                                                                         href={`http://${data.domain}`}>{data.domain}</a></span>
                      </OverlayTrigger>
                    </div>
                    <div className="ipass-list">
                      <span className="label">状态</span>
                      <span className="value states">
                                {statusData.running > 0 && statusData.staged <= 0 && statusData.wait <= 0 && statusData.deployments <= 0 && (
                                  <span className="color-success">运行中</span>)}

                        {statusData.deployments > 0 && statusData.wait <= 0 && statusData.staged <= 0 && (
                          <span className="color-primary">部署中</span>)}

                        {statusData.staged > 0 && statusData.wait <= 0 && (
                          <span className="color-dark">初始化</span>)}

                        {statusData.wait > 0 && (<span className="color-dark">等待中</span>)}

                        {statusData.running == 0 && statusData.staged == 0 && statusData.wait == 0 && statusData.deployments <= 0 && statusData.wait == 0 && (
                          <span
                            className={statusData.status && "color-danger"}>{statusData.status ? statusData.status : "未知"}</span>)}
                              </span>
                    </div>
                  </Col>
                  <Col md={7} sm={12} className="padding-left-none">
                    <div className="ipass-list">
                      <span className="label">所属镜像</span>
                      {
                        data.container ? (
                          <OverlayTrigger overlay={getLongValue(data.container.docker.image)}
                                          placement="bottom">
                                    <span
                                      onClick={this.onShowImgInfoModal}
                                      className="value collapse-text"
                                      style={{color: "#0084ff", cursor: "pointer"}}>
                                        {data.container.docker.image}
                                        </span>
                          </OverlayTrigger>) : null
                      }

                    </div>
                    <div className="ipass-list">
                      <span className="label">实例</span>
                      <div className="detail-oper value instances">
                        <InputNumber
                          iconStyle="one"
                          className="instance-input"
                          value={Number(this.state.instancesNum)}
                          min={0}
                          max={1000}
                          onChange={this.validateDila}
                        />
                        {/*<InputGroup style={{width: 160}}>*/}
                          {/*<FormControl*/}
                            {/*ref="dilaValue"*/}
                            {/*value={this.state.instancesNum || data.instances}*/}
                            {/*onChange={this.validateDila}*/}
                            {/*style={{borderRadius: 0, fontSize: 12}}*/}
                          {/*/>*/}
                          {/*<InputGroup.Button className="instances-up-down">*/}
                            {/*<div*/}
                              {/*className="u-button u-button-sm u-button-squared u-button-border"*/}
                              {/*style={{marginLeft: '-1px'}}>*/}
                              {/*<i*/}
                                {/*className="cl cl-up"*/}
                                {/*onClick={this.upInstanceNum(1)}*/}
                              {/*/>*/}
                              {/*<i*/}
                                {/*disabled={data.instances <= 0 || (this.state.instancesNum && this.state.instancesNum <= 0)}*/}
                                {/*className="cl cl-down"*/}
                                {/*onClick={this.upInstanceNum(-1)}*/}
                              {/*/>*/}
                            {/*</div>*/}

                          {/*</InputGroup.Button>*/}
                        {/*</InputGroup>*/}
                        {
                          this.state.instanceEdit ? (
                            <div>
                              {
                                this.state.instancesNum > data.instances ? (
                                  <Button
                                    shape="squared"
                                    colors="primary"
                                    bordered
                                    size="sm"
                                    onClick={this.onDilatate}>
                                    扩
                                  </Button>
                                ) : null
                              }
                              { this.state.instancesNum < data.instances ?
                                (
                                  <Button
                                    shape="squared"
                                    colors="primary"
                                    bordered
                                    size="sm"
                                    onClick={this.onDilatate}>
                                    缩
                                  </Button>
                                ) : null
                              }
                              <Button
                                shape="squared"
                                colors="primary"
                                bordered
                                size="sm"
                                onClick={this.cancleDilate}>
                                取消
                              </Button>
                            </div>
                          ) : null
                        }
                      </div>

                    </div>
                  </Col>
                </Col>
              </Col>
              <Col md={12} xs={12} className="detail">
                <Tabs
                  defaultActiveKey={tabActiveKey ? tabActiveKey : '1'}
                  onChange={this.changePanelKey}
                  destroyInactiveTabPane
                  renderTabBar={() => <ScrollableInkTabBar />}
                  renderTabContent={() => <TabContent />}
                >
                  <TabPane tab="实例" key="1">
                    <TaskInstance
                      appId={app_id}
                      id={this.state.currentId}
                      appName={data.name || data.appName}
                      forbidTaskUploadFlag={this.state.forbidTaskUploadFlag}
                      type={ data.publish_type }
                      activeKey={this.state.panelActiveKey}/>
                  </TabPane>
                  <TabPane className="config-panel" tab="属性" key="2">
                    {
                      // <ConfigPanel id={this.state.currentId} activeKey={this.state.panelActiveKey}/>
                    }

                    <Configuration id={this.state.currentId} publish_type={this.state.publish_type}/>
                  </TabPane>
                  <TabPane tab="事件" key="3">
                    <EventRecord id={this.state.currentId}
                                 forbidTaskUploadFlag={this.state.forbidTaskUploadFlag}
                                 activeKey={this.state.panelActiveKey}/>
                  </TabPane>
                  <TabPane tab="监控" key="4">
                    <ListenceEchart type={ data.publish_type } activeKey="4" appid={app_id} id={this.state.currentId}/>
                  </TabPane>
                  <TabPane tab="域名" key="5">
                    <MainPage domain={data.domain} appid={app_id}
                              activeKey={this.state.panelActiveKey}/>
                  </TabPane>
                  <TabPane tab="日志" key="6">
                    <PublishConsole id={this.state.currentId} appid={app_id}
                                    forbidTaskUploadFlag={this.state.forbidTaskUploadFlag}
                                    activeKey={this.state.panelActiveKey}/>
                  </TabPane>
                  <TabPane tab="配置文件" key="7">
                    <ConfigFile appId={ data.upload_app_id } env={data.env}
                                appCode={ data.app_code }/>
                  </TabPane>
                  <TabPane tab="监控配置" key="8">
                    <RuleConfig appId={this.state.publishdetail.app_id}
                                domain={data.domain}
                    ></RuleConfig>
                  </TabPane>
                  <TabPane tab="微服务" key="9">
                    <MircoServer appCode={ data.app_code } id={data.id} envType={envType}/>
                  </TabPane>
                  <TabPane tab="自动化测试" key="10">
                    <AutoTest
                      appName={this.state.publishdetail.name}
                      userId={this.state.publishdetail.user_id}
                      appId={this.state.publishdetail.app_id}/>
                  </TabPane>
                </Tabs>
              </Col>
            </div>
          )
        }

        <ShowPauseModal show={this.state.showPauseModalFlag} onCancelCallBack={this.showPauseModal} title="暂停"
                        onConfirmShowKey={this.onScale} content="确定暂停吗？"/>
        <ShowPauseModal show={this.state.showRestartModalFlag} onCancelCallBack={this.showRestartModal}
                        onConfirmShowKey={this.onRestart} content="确定重启吗？" title="重启"/>
        <ShowPauseModal show={this.state.showDestoryModalFlag} onCancelCallBack={this.hideDestoryModal}
                        onConfirmShowKey={this.onDestory} content="确定销毁吗？" title="销毁"/>

        {
          data.container ? (
            <ImageDetailModal show={this.state.showImgInfoModalFlag} onCancelCallBack={this.onShowImgInfoModal}
                              imageName={data.container.docker.image}/>
          ) : null
        }

      </div>
    )
  }

}

PublishDetail.contextTypes = {
  router: PropTypes.object
}

export default PublishDetail;
