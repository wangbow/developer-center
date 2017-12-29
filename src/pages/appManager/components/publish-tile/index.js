import React, {Component, PropTypes} from 'react';
import {Tile, Switch, Col, Form, Badge, ProgressBar, Tooltip, Message, Icon} from 'tinper-bee';
import OverlayTrigger from 'bee-overlay/build/OverlayTrigger';
import {Link} from "react-router";
import axios from 'axios';
import classnames from 'classnames';

import TileHeader from '../tile-header';
import {ImageIcon} from 'components/ImageIcon';
import {checkEmpty} from 'components/util';

import './index.less';

const envObj = {
  dev: {
    num: 1,
    name: '开发'
  },
  test: {
    num: 2,
    name: '测试'
  },
  AB: {
    num: 3,
    name: '灰度'
  },
  pro: {
    num: 4,
    name: '生产'
  }
};

class PublishTile extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      showDestoryModalFlag: false,
      domain: props.AppData.domain
    }
  }

  componentDidMount() {
    const {AppData} = this.props;
    if (AppData.running <= 0 || AppData.staged > 0 || AppData.wait > 0 || AppData.deployments > 0) {

    } else {
      if (AppData.is_fake !== 0) {
        this.getDomain(AppData);
      }

    }
  }

  componentWillReceiveProps(nextProps) {
    const {AppData} = nextProps;
    if (AppData.running <= 0 || AppData.staged > 0 || AppData.wait > 0 || AppData.deployments > 0) {

    } else {
      if (AppData.is_fake !== 0) {
        this.getDomain(AppData);
      }
    }

  }

  /**
   * 获取绑定域名
   * @param AppData
   */
  getDomain = (AppData) => {
    axios.get('/edna/web/v1/domain/listUserDomains?appId=' + AppData.app_id)
      .then((res) => {
        if (res.data.success === 'success') {
          if (res.data.detailMsg) {
            if (res.data.detailMsg.data.bindList instanceof Array) {
              if (res.data.detailMsg.data.bindList.length !== 0) {
                this.setState({
                  domain: res.data.detailMsg.data.bindList[0].domain
                })
              }
            }
          }

        }
      })
  }

  renderTitle = (title) => {
    return (
      <Tooltip inverse>
        { title }
      </Tooltip>
    )
  }

  goToDetail = (id, state) => () => {
    let {AppData} = this.props;
    let envType = AppData.app_type;
    if (AppData.is_fake === 0) {
      this.context.router.push(`/miro-detail/${id}?runState=${state}&envType=${envType}`)
    } else {
      this.context.router.push(`/publish_detail/${id}?runState=${state}&envType=${envType}`)
    }
  }

  render() {
    const {AppData, onDelete, onChangeAlarm} = this.props;
    let id = AppData.id;
    const tooltipHeathy = function (data) {
      return (
        <Tooltip inverse id="healty">
          <span>健康：{data.healthy}</span>
          <span>正在部署：{data.deployments}</span>
          <span>异常：{data.unhealthy}</span>
          <span>等待：{data.wait}</span>
        </Tooltip>
      );
    }
    const tooltipImage = function (data) {
      return (
        <Tooltip inverse id="image">
          <span>{data}</span>
        </Tooltip>
      );
    };

    let isFake = AppData.is_fake === 0;

    return (
      <div className="tile-container">
        <Tile className="publish-tile">
          {
            AppData.app_type ? (
              <div className={`env env-${AppData.app_type}`}>{ envObj[AppData.app_type].name }</div>
            ) : null
          }
          <div onClick={ this.goToDetail(id, AppData.runState)} style={{cursor: 'pointer'}}>
            <TileHeader AppData={ AppData }/>
            <div className="tile-body">
              {
                isFake ? (
                  <div className="is-fake">
                    {`尚未启用[${envObj[AppData.app_type].name}]环境`}
                  </div>
                ) : (
                  <div>
                    <div className="info-row">
                      <div className="info-col-2">
                        <div className="label">内存</div>
                        <div className="value">{`${checkEmpty(AppData.mem)}${isFake ? "" : "MB"}`}</div>
                      </div>
                      <div className="info-col-2">
                        <div className="label">实例数</div>
                        <div className="value">{checkEmpty(AppData.instances)}</div>
                      </div>
                    </div>
                    <div className="info-row">
                      <div className="label">所属镜像</div>
                      {
                        isFake ? (<div className="value">{checkEmpty(AppData.image)}</div>) : (
                          <OverlayTrigger overlay={tooltipImage(AppData.image)} placement="bottom">
                            <div className="value">{AppData.image}</div>
                          </OverlayTrigger>
                        )
                      }
                    </div>
                    <div className="info-row">
                      <div className="label">健康度</div>
                      {
                        isFake ? (
                          <div className="value">暂无数据</div>
                        ) : (
                          <OverlayTrigger overlay={tooltipHeathy(AppData)} placement="bottom">
                            <ProgressBar size="xs">
                              <ProgressBar colors="success"
                                           now={AppData.healthy / (AppData.healthy + AppData.unhealthy + AppData.deployments + AppData.wait) * 100}/>
                              <ProgressBar colors="primary"
                                           now={AppData.deployments / (AppData.healthy + AppData.unhealthy + AppData.deployments + AppData.wait) * 100}/>
                              <ProgressBar colors="danger"
                                           now={AppData.unhealthy / (AppData.healthy + AppData.unhealthy + AppData.deployments + AppData.wait) * 100}/>
                              <ProgressBar colors="dark"
                                           now={AppData.wait / (AppData.healthy + AppData.unhealthy + AppData.deployments + AppData.wait) * 100}/>
                            </ProgressBar>
                          </OverlayTrigger>
                        )
                      }

                    </div>
                  </div>
                )
              }
            </div>
          </div>
          <ul className="group-control">
            <li className="group-control-item" style={{cursor: 'not-allow'}}>
               <span
                 onClick={onChangeAlarm(AppData)}
                 className={classnames({'u-switch': true, 'is-checked': AppData.alarm})}
                 tabIndex="0">
                  <span className="u-switch-inner"/>
                </span>
              {/*<Switch checked={AppData.alarm} onChangeHandler={onChangeAlarm(AppData)} size='sm'/>*/}
              开启报警
            </li>
            <li className="group-control-item" onClick={ onDelete }>
              <i className="cl cl-del"/>
              删除
            </li>
            <li className="group-control-item">
              {
                AppData.running <= 0 ||
                AppData.staged > 0 ||
                AppData.wait > 0 ||
                AppData.deployments > 0 ?
                  (
                    <Link to={`/publish_detail/${id}?runState=${AppData.runState}`}>
                        <span>
                          <i className="cl cl-eye"/>
                          查看应用
                        </span>
                    </Link>
                  ) : (
                  <span>
                      <a href={`http://${this.state.domain}`} target="_blank">
                        <i className="cl cl-externallink"/>
                        访问域名
                      </a>
                    </span>
                )
              }
            </li>
          </ul>
        </Tile>
      </div>

    )
  }
}

PublishTile.contextTypes = {
  router: PropTypes.object,
}

export default PublishTile;
