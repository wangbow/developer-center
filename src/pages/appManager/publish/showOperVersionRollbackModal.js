import React, {Component} from 'react';
import {
  Clipboard,
  Pagination,
  Col,
  Con,
  Row,
  Button,
  Icon,
  Radio,
  Message,
  FormControl,
  FormGroup,
  Label,
  Modal,
  Select,
  Option
} from 'tinper-bee';
import {historyVersion, rellbackHandle} from '../../../serves/versionHandle'
import {formateDate} from '../../../components/util';
import './showOperVersionModal.css'
import {
  GetConfigVersionByCode
} from '../../../serves/confCenter';

const envObj = {
  dev: {
    num: 1,
    name: '开发环境'
  },
  test: {
    num: 2,
    name: '测试环境'
  },
  stage: {
    num: 3,
    name: '灰度环境'
  },
  online: {
    num: 4,
    name: '发布环境'
  }
};

class ShowOperVersionRollbackModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      selectedVersionValue: "",
      selectedReasonValue: "",
      showMore: false,
      activePage: 1,
      maxCount: 0,
      versions: [],
      confVersionList: [],
      confVersion: ''
    };

    //回滚原因的下拉框功能补充
    let flagBlur = false;
    let blurValue = "";

    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.rollback = this.rollback.bind(this);
    this.getVersionList = this.getVersionList.bind(this);
    this.handleHistoryChange = this.handleHistoryChange.bind(this);
    this.handleReasonChange = this.handleReasonChange.bind(this);
    this.handleSelectPage = this.handleSelectPage.bind(this);
    this.showMoreClick = this.showMoreClick.bind(this);
  }


  componentWillReceiveProps() {
    let {appCode, env} = this.props;
    if (env.hasOwnProperty('cf_disconf_env') && this.state.confVersion === '') {
      GetConfigVersionByCode(`?appCode=${ appCode }&envId=${envObj[env.cf_disconf_env].num}&needDefine=false`)
        .then((res) => {
          if (res.data.error_code) {
            Message.create({
              content: res.data.error_message,
              color: 'danger',
              duration: null
            })
          } else {
            this.setState({
              confVersionList: res.data.page.result,
              confVersion: env.cf_disconf_version
            });
          }
        });
    }

  }

  handleSelect = (value) => {
    this.setState({
      confVersion: value
    })
  }

  /**
   *回滚操作
   */
  rollback() {
    let _this = this;
    let falg = false;
    let appUploadId = null;
    let version = _this.state.selectedVersionValue;

    let versions = _this.state.versions;
    versions.forEach((item, index) => {
      if (item.image_name == version) {
        appUploadId = item.app_upload_id;
        falg = true;
      }
    });

    if (!falg) {
      return Message.create({content: '请选择回滚历史版本！', color: 'warning', duration: 4.5});
    }

    let param = {
      app_id: _this.props.id,
      image: version,
      app_upload_id: appUploadId,
      message: _this.state.selectedReasonValue,
      type: -1,
      config_version: this.state.confVersion
    };
    rellbackHandle(param,
      (data) => {
        if (data.data.error_message) {
          Message.create({content: data.data.error_message, color: 'danger', duration: 4.5});
        }
        else {
          Message.create({content: data.data.message, color: 'success', duration: 4.5});
        }
      })

    this.close()
  }

  getVersionList(pageIndex) {
    let _this = this;
    historyVersion({
      image_name: this.props.overlay,
      pageIndex: pageIndex,
      pageSize: 5
    }, (data) => {
      if (data.data.success) {
        _this.setState({
          maxCount: data.data.max_count,
          versions: data.data.data,
          activePage: (pageIndex + 1)
        })
      }
    })
  }

  /**
   *分页
   */
  handleSelectPage(eventKey) {
    this.getVersionList(eventKey - 1);
  }

  handleHistoryChange(value) {
    this.setState({selectedVersionValue: value});
  }

  handleReasonChange(value) {
    if (!this.flagBlur) {
      this.setState({selectedReasonValue: value});
      this.blurValue = value;
    }
    else {
      document.querySelector('.u-select-selection-selected-value').innerHTML = this.blurValue;
      this.setState({selectedReasonValue: this.blurValue});
    }

  }

  /**
   *显示更多
   */
  showMoreClick() {
    this.setState({showMore: true});
  }

  close() {
    this.setState({
      showModal: false
    });
  }

  open() {
    this.setState({
      showModal: true
    });
    this.getVersionList(0);
  }

  render() {
    let _this = this;
    const {image} = this.props;
    let versions = this.state.versions;
    let array = image.split(':');
    let version = array[array.length - 1];

    let rversions = versions.length === 0 ? '暂无新版本' : versions.map((item, index) => {
      return (
        <Radio value={item.image_name}>
          <div className="u-radio-text">
            <span className="tag-name">
              {item.image_tag}
              </span>
            <span className="tag-version">
                  { formateDate(item.ts) }
              </span>
          </div>
        </Radio>
      )
    });

    return (
      <span>
            <span
              className="btn"
              onClick={this.open}>
                <i className="cl cl-backdate-p"/>
                回滚
            </span>
              <Modal
                show={ this.state.showModal  }
                backdrop="static"
                className="upgrade-model"
                onHide={ this.close }>
                  <Modal.Header closeButton>
                      <Modal.Title>版本回滚</Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                      <Row className="upgrade">
                        <FormGroup className="clearfix">
                            <Col md={12} sm={12} className="label-text">
                                <Label>镜像拉取命令</Label>
                            </Col>
                            <Col md={12} sm={12} className="cdm-copy">
                              <FormControl disabled id="test" ref="cmdName"
                                           defaultValue={'docker pull ' + this.props.overlay}/>
                              <div id="vcmdcopy">
                                {'docker pull ' + this.props.overlay}
                              </div>
                              <Clipboard
                                target='#vcmdcopy'
                                action="copy"
                              />
                            </Col>
                        </FormGroup>
                         <FormGroup className="clearfix">
                            <Col md={3} sm={3} className="label-text">
                              <Label >配置文件</Label>
                            </Col>
                            <Col md={9} sm={9} className="cur-version text-break" style={{paddingLeft: '23px'}}>
                              {
                                this.state.confVersionList.length === 0 ? "当前应用无配置文件" : (
                                  <Select
                                    value={ this.state.confVersion }
                                    onChange={this.handleSelect}>
                                    {
                                      this.state.confVersionList.map(function (item, index) {
                                        return (
                                          <Option
                                            value={ item.value }>{ item.value }</Option>
                                        )
                                      })
                                    }
                                  </Select>
                                )
                              }
                            </Col>
                        </FormGroup>
                        <FormGroup className="clearfix">
                            <Col md={3} sm={3} className="label-text">
                              <Label >当前版本</Label>
                            </Col>
                            <Col md={9} sm={9} className="cur-version text-break" style={{paddingLeft: '23px'}}>
                              <Label className="ellipsis">{version}</Label>
                            </Col>
                        </FormGroup>
                        <FormGroup className="clearfix">
                            <Col md={3} sm={3} className="label-text">
                                <Label>回滚原因</Label>
                            </Col>
                            <Col md={9} sm={9}>
                            <Select
                              showSearch
                              defaultValue={this.state.selectedReasonValue}
                              onChange={this.handleReasonChange}
                              onSearch={this.handleReasonChange}
                              onBlur={() => {
                                _this.flagBlur = true;
                              }}
                              onFocus={() => {
                                _this.flagBlur = false;
                              }}
                            >
                               <Option value="当前版本测出有重大bug发错了">当前版本测出有重大bug发错了</Option>
                               <Option value="当前版本还没做完滚回去">当前版本还没做完滚回去</Option>
                               <Option value="对比复现问题数据错了">对比复现问题数据错了</Option>
                               <Option value="内置了初始数据别的服务有问题">内置了初始数据别的服务有问题</Option>
                               <Option value="关联回滚其他原因">关联回滚其他原因</Option>
                             </Select>
                            </Col>
                        </FormGroup>
                        <FormGroup className="clearfix history">
                            <Col md={3} sm={3} className="label-text">
                              <Label>历史版本</Label>
                            </Col>
                            <Col md={9} sm={9} style={{paddingLeft: '0px'}}>
                              <Col md={12} sm={12} style={{paddingRight: '0px'}}>
                                <Radio.RadioGroup
                                  name="selVersion"
                                  selectedValue={this.state.selectedVersionValue}
                                  onChange={this.handleHistoryChange}>
                                     {rversions}
                               </Radio.RadioGroup>
                              </Col>

                              <Col md={12} sm={12}>
                              {
                                this.state.showMore ?
                                  (
                                    <Pagination
                                      first
                                      last
                                      prev
                                      next
                                      boundaryLinks
                                      size='sm'
                                      items={Math.ceil(this.state.maxCount / 5)}
                                      maxButtons={3}
                                      activePage={this.state.activePage}
                                      onSelect={this.handleSelectPage}/>
                                  ) :
                                  (
                                    this.state.maxCount > 5 ?
                                      <a href="javascript:void(0)" className="more"
                                         onClick={this.showMoreClick}>更多>></a> :
                                      ""
                                  )
                              }
                              </Col>
                            </Col>
                        </FormGroup>
                      </Row>
                  </Modal.Body>

                  <Modal.Footer>
                    <div className="modal-footer">
                      <Button onClick={ this.close } shape="border" className="button">取消</Button>
                      <Button colors="primary" className="button" onClick={this.rollback}>回滚</Button>
                    </div>
                  </Modal.Footer>
             </Modal>
          </span>
    )
  }
}


export default ShowOperVersionRollbackModal;
