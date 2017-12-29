import React, {Component, PropTypes} from 'react';
import {Row, Col, Message, Label, Button, FormControl, Select} from 'tinper-bee';
import imgempty from 'assets/img/taskEmpty.png';
import classnames from 'classnames';
import Checkbox from 'rc-checkbox';
import Tooltip from 'rc-tooltip';
import {editQuickInfo} from 'serves/CI';
import {err, success, warn} from 'components/message-util';

import {
  GetConfigFileFromCenterByCode,
  GetConfigVersionByCode,
  GetConfigEnvFromCenter,
  editConfigFile,
  deleteApp
} from 'serves/confCenter';

import {ENV} from '../../constant';

import 'rc-checkbox/assets/index.css';
import 'rc-tooltip/assets/bootstrap_white.css';
import './index.less';

const Option = Select.Option;

function renderTooltip(data) {
  if (data instanceof Array && data.length !== 0) {
    return (
      <ul>
        {
          data.map(function (item, index) {
            return (
              <li key={ index }>
                <div>{ item.Hostname }</div>
                <span style={{
                  display: 'inline-block',
                  color: '#0084ff',
                  margin: 5
                }}>cpu:</span><span>{ item.CpuLeft }</span>
                <span style={{
                  display: 'inline-block',
                  color: '#0084ff',
                  margin: 5
                }}>mem:</span><span>{ item.MemoryLeft }</span>
                <span style={{
                  display: 'inline-block',
                  color: '#0084ff',
                  margin: 5
                }}>disk:</span><span>{ item.DiskLeft }</span>
              </li>
            )
          })
        }
      </ul>
    )
  } else {
    return (
      <span>不可用</span>
    )
  }

}

class QuickPublish extends Component {

  state = {
    edit: false,
    env: 'dev',
    checkedAry: [],
    versionList: [],
    envList: ENV,
    mem: '',
    memMin: null,
    cpu: '',
    cpuMin: null,
    disk: '',
    editConf: false,
    confEnv: "1",
    version: '',
    resChecked: []
  };

  file = '';

  componentDidMount() {
    let {data} = this.props;
    if (!data.length || data.length === 0)return;

    this.setState({
      env: data[0].app_type,
      cpu: data[0].cpu,
      cpuMin: data[0].min_cpu,
      mem: data[0].mem,
      memMin: data[0].min_mem,
      disk: data[0].disk,
      version: data[0].cf_disconf_version,
      confEnv: data[0].cf_disconf_env
    })
  }

  /**
   * 编辑
   */
  handleEdit = () => {
    this.setState({
      edit: true
    })
  }

  /**
   * 取消编辑
   */
  closeEdit = () => {
    this.setState({
      edit: false,
      editConf:false,
    })
  }

  /**
   * 捕获输入框改变
   */
  handleInputChange = (state) => (e) => {
    this.setState({
      [state]: e.target.value
    })
  }

  /**
   * 选中环境
   * @param env
   */
  checkEnv = (env) => (e) => {
    let {checkedAry} = this.state;

    if (e.target.checked) {
      checkedAry.push(env);
    } else {
      checkedAry.splice(checkedAry.indexOf(env), 1);
    }
    this.setState({
      checkedAry
    })
  }

  /**
   * 保存
   */
  handleSave = () => {
    let {mem, memMin, cpu, cpuMin, disk, env, version, confEnv} = this.state;
    let {data, refresh} = this.props;
    let totalInfo = {};
    data.forEach((item) => {
      if (item.app_type === env) {
        totalInfo = item;
      }
    });

    let quickData = {
      "id": totalInfo.id,
      "cpu": cpu,
      "min_cpu": Number(cpuMin),
      "mem": mem,
      "min_mem": Number(memMin),
      "disk": disk,
      "app_code": totalInfo.app_code,
      "app_name": totalInfo.app_name,
      cf_disconf_version: version,
      cf_disconf_env: confEnv,
      // "confProperties": {
      //   "confVersion": version,
      //   "confEnv": confEnv,
      // }
    }

    if (mem < Number(memMin) || cpu < Number(cpuMin)) {
      return warn('最小值应该小于最大值')
    }

    editQuickInfo(quickData)
      .then((res) => {
        let resData = res.data;
        if (resData.error_code) {
          return err(`${resData.error_code}:${resData.error_message}`)
        }
        this.closeEdit();
        success('修改成功。');

        refresh && refresh();
      })
  }

  /**
   * 修改环境变量
   * @param env
   */
  changeEnv = (env) => (e) => {
    let { data } = this.props;
    data.forEach((item) => {
      if(item.app_type === env){
        this.setState({
          cpu: item.cpu,
          mem: item.mem,
          disk: item.disk,
          version: item.cf_disconf_version,
          confEnv: item.cf_disconf_env
        })
      }
    });

    this.setState({
      env,
      edit: false,
      editConf: false
    })
  }

  /**
   * 捕获部署
   */
  handlePublish = () => {
    let {onPublish} = this.props;
    let {checkedAry, resChecked} = this.state;

    if (checkedAry.length === 0)
      return warn('请至少选择一个部署环境。');

    onPublish && onPublish(checkedAry, resChecked);
  }

  /**
   * 是否修改配置文件
   */
  handleChangeConf = (e) => {
    let { env } = this.state;
    if(e.target.checked){
      this.setState({
        editConf: true
      })
      this.getVersion(1);
    }else{
      this.setState({
        editConf: false
      })
    }
  }

  getVersion = (env) => {
    const {appCode} = this.props;
    if (appCode !== '') {
      //获取版本列表
      GetConfigVersionByCode(`?appCode=${ appCode }&envId=${ env }&needDefine=false`)
        .then((res) => {
          let data = res.data;
          if (data.error_code) {
            this.setState({
              error: true,
            });
            err(data.error_message)

          } else {
            let version = res.data.page.result.length !== 0 ? res.data.page.result[0].value : '';

            this.setState({
              versionList: res.data.page.result,
              version: version
            });
          }
        });
    }

  };

  /**
   * 下拉选择钩子函数
   * @param state
   * @returns {Function}
   */
  handleSelectChange = (state) => {
    const self = this;
    return function (value) {
      if (state === 'envConf') {
        self.getVersion(value);
      }
      self.setState({
        [state]: value
      })
    }

  }

  /**
   * 多选框改变
   * @param id 点击check的id
   */
  onCheckboxChange = (id) => (e) => {

    let {resChecked} = this.state;
    if(e.target.checked){
      resChecked.push(id)
    }else{
      resChecked = resChecked.filter((item) => {
        return item.resourcepool_id !== id;
      })
    }
    this.setState({
      resChecked
    })

  }


  render() {
    let {data, onPublish, version, resPool} = this.props;
    let {edit, info, editConf} = this.state;
    if (data.length === 0) {
      return (
        <Col md={12} className="text-center">
          <img src={imgempty} width={200} alt="内容为空"/>
          <p>当前应用还没有部署过，需要部署一次后，才能进行一键部署。</p>
        </Col>
      )
    }

    let resInfo = resPool.filter((item) => {
      return item.type === data[0].publish_type;
    })

    return (
      <Col md={12} className="quick-publish">
        <Col md={12}>
          <Button
            className="btn"
            shape="squared"
            colors="primary"
            onClick={ this.handlePublish }>
            一键部署
          </Button>
        </Col>
        <div>
          <Label>
            应用名称
          </Label>

          <div className="base-info">
            {
              data[0].app_name
            }
          </div>

          <Label>
            当前版本
          </Label>
          <div className="base-info">
            {
              version
            }
          </div>
        </div>
        <Col md={12}>
          <h4>资源池选择</h4>
          {
            resInfo.map((item, index) => {
              return (
                <label key={ item.resourcepool_id } style={{display: 'inline-block', padding: 3}}>
                  <Checkbox
                    onChange={this.onCheckboxChange(item.resourcepool_id, item.type)}
                    style={{marginLeft: 10, marginRight: 5, marginBottom: 10}}
                    disabled={ item.Host_count === 0 }
                    checked={this.state.resChecked.indexOf(item.resourcepool_id) > -1}
                    defaultChecked={ item.Host_count !== 0 && item.Isdefault === 1 }
                  />
                  <Tooltip overlay={renderTooltip(this.props.resPoolInfo[item.resourcepool_id])}
                           placement="bottomLeft">
                    <span className="res-name">{ item.resourcepool_name }</span>
                  </Tooltip>
                </label>
              )
            })
          }
        </Col>
        <Col md={12}>
          <h4>环境选择</h4>
          <ul className="info-env">
            {
              ENV.map((item) => {
                return (
                  <li className="info-env-item" key={ item.key }>
                    <Checkbox onChange={ this.checkEnv(item.value) }/>
                    <span onClick={ this.changeEnv(item.value) }
                          className={classnames(`info-env-item-label info-env-${item.key}`, {'active': this.state.env === item.value})}>
                    { item.name }
                  </span>
                  </li>
                )
              })
            }
          </ul>
        </Col>
        <Col md={12}>
          {
            data.map((item) => {

              if (item.app_type === this.state.env) {
                return (
                  <div>
                    <div>
                      <div className="width-100" style={{display: "inline-block"}}>
                        <Label className="label">
                          CPU 最大值
                        </Label>
                      </div>
                      {
                        edit ? (
                          <FormControl
                            value={ this.state.cpu }
                            className="quick-publish-input"
                            onChange={ this.handleInputChange('cpu') }
                          />
                        ) : (
                          <div className="info">
                            {
                              item.cpu
                            }
                          </div>
                        )
                      }
                    </div>
                    {
                      item.publish_type === 3 ? (
                        <div>
                          <div className="width-100" style={{display: "inline-block"}}>
                            <Label className="label">
                              CPU 最小值
                            </Label>
                          </div>
                          {
                            edit ? (
                              <FormControl
                                value={ this.state.cpuMin }
                                className="quick-publish-input"
                                onChange={ this.handleInputChange('cpuMin') }
                              />
                            ) : (
                              <div className="info">
                                {
                                  item.min_cpu
                                }
                              </div>
                            )
                          }
                        </div>
                      ) : ( <div />)
                    }
                    <div>
                      <div className="width-100" style={{display: "inline-block"}}>
                        <Label className="label">
                          内存 最大值
                        </Label>
                      </div>
                      {
                        edit ? (
                          <FormControl
                            value={ this.state.mem }
                            className="quick-publish-input"
                            onChange={ this.handleInputChange('mem') }
                          />
                        ) : (
                          <div className="info">
                            {
                              `${item.mem}M`
                            }
                          </div>
                        )
                      }
                    </div>
                    {
                      item.publish_type === 3 ? (
                        <div>
                          <div className="width-100" style={{display: "inline-block"}}>
                            <Label className="label">
                              内存 最小值
                            </Label>
                          </div>
                          {
                            edit ? (
                              <FormControl
                                value={ this.state.memMin }
                                className="quick-publish-input"
                                onChange={ this.handleInputChange('memMin') }
                              />
                            ) : (
                              <div className="info">
                                {
                                  `${item.min_mem}M`
                                }
                              </div>
                            )
                          }
                        </div>
                      ) : ( <div />)
                    }
                    {
                      edit ? (
                        <div className="edit-conf-checkbox">
                          <Checkbox onChange={ this.handleChangeConf } />
                          <span className="edit-conf-select-version-label">
                            是否修改配置文件
                          </span>

                        </div>

                      ) : null
                    }
                    {
                      editConf ? (
                        <div className="edit-conf-select">
                          <span>环境：</span>
                          <Select
                            value={ this.state.confEnv }
                            size="lg"
                            className="select-env"
                            onChange={this.handleSelectChange('confEnv')}>
                            {
                              this.state.envList.map(function (item, index) {
                                return (
                                  <Option value={item.confValue} key={ index }>{ item.name }</Option>
                                )
                              })
                            }
                          </Select>
                          <span className="edit-conf-select-version-label">版本：</span>
                          <Select
                            size="lg"
                            value={ this.state.version }
                            className="select-env"
                            onChange={this.handleSelectChange('version')}>
                            {
                              this.state.versionList.map(function (item, index) {
                                return (
                                  <Option value={ item.value } key={ index }>{ item.value }</Option>
                                )
                              })
                            }
                          </Select>
                        </div>
                      ) : null
                    }

                  </div>
                )
              } else {
                return null;
              }
            })
          }

        </Col>

        {
          edit ? (
            <Col md={12}>
              <Button
                className="btn"
                shape="squared"
                onClick={ this.closeEdit }>
                取消
              </Button>
              <Button
                className="btn btn-right"
                shape="squared"
                colors="primary"
                onClick={ this.handleSave }>
                保存
              </Button>

            </Col>
          ) : (
            <Col md={12}>
              <Button
                className="btn"
                shape="squared"
                colors="primary"
                onClick={ this.handleEdit }
              >
                修改配置
              </Button>
            </Col>

          )
        }


      </Col>
    )
  }


}


export default QuickPublish;
