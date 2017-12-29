import React, {Component} from 'react';
import {
  Clipboard,
  Col,
  Con,
  Row,
  Button,
  Icon,
  Radio,
  Message,
  FormControl,
  FormGroup,
  Pagination,
  Label,
  Modal,
  Select
} from 'tinper-bee';
import {formateDate} from '../../../components/util';
import {updateVersion, rellbackHandle} from '../../../serves/versionHandle'

import {
  GetConfigVersionByCode
} from '../../../serves/confCenter';

import './showOperVersionModal.css'

const Option = Select.Option;

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


class ShowOperVersionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      selectedVersionValue: "",
      fileUploadState: 3,
      versions: [],
      confVersionList: [],
      confVersion: '',
      showMore: false,
      activePage: 1,
      maxCount: 0,
    };

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

  handleChange = (value) => {
    this.setState({selectedVersionValue: value});
  }

  /**
   *回滚操作
   */
  rollback = () => {
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
      return Message.create({content: '请选择升级版本！', color: 'warning', duration: 4.5});
    }

    let param = {
      app_id: _this.props.id,
      image: version,
      app_upload_id: appUploadId,
      type: 1,
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
    _this.close();
  }

  getVersionList = (pageIndex = 0) => {
    let _this = this;
    updateVersion({
      image_name: this.props.overlay,
      pageIndex: pageIndex,
      pageSize: 3
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

  close = () => {
    this.setState({
      showModal: false
    });
  }

  open = () => {
    this.setState({
      showModal: true
    });
    this.getVersionList();
  }

  /**
   *上传文件失败时树表hover时显示重传
   */
  hoverShow = (e) => {
    if (this.state.fileUploadState == 3 && e.type == 'mouseenter') {
      //重传
      this.setState({fileUploadState: 4});
    }
    else if (this.state.fileUploadState == 4 && e.type == 'mouseleave') {
      this.setState({fileUploadState: 3});
    }
  }

  /**
   *返回上传后三种状态
   */
  getUploadState = (filename, size, state) => {
    let _this = this;
    let logo = 'cl cl-pass-c', color = '#8CC220', updateState = '上传成功';
    if (state == 3) {
      logo = 'cl cl-notice-p';
      color = '#DD3730';
      updateState = '上传失败';
    }
    else if (state == 4) {
      logo = 'cl cl-re-start';
      color = '#F57323';
      updateState = '重试上传'
    }
    return (
      <div
        onMouseEnter={ (e) => {
          _this.hoverShow(e)
        }}
        onMouseLeave={ (e) => {
          _this.hoverShow(e)
        }}
        style={{width: '100%', float: 'left'}}
      >
        <Col md={12} sm={12}>
          <Col md={10} sm={10} className="file-detail">
            <p>
              {filename}
            </p>
            <div>
              {size}
            </div>
          </Col>
          <Col md={2} sm={2} className="file-right">
            <div>
              <i className={logo} style={{color: color}}></i>
            </div>
            <p style={{color: color}}>
              {updateState}
            </p>
          </Col>
        </Col>
      </div>
    )
  }

  /**
   *文件上传状态
   * 0未上传
   * 1 进行中
   * 2 上传成功
   * 3 上传失败
   * 4 重传
   * 返回对应的html
   */
  createFileUploadState = () => {
    let fileState = this.state.fileUploadState;
    let html = '';
    switch (fileState) {
      case 0:
        html = (
          <span style={{marginTop: '18px', display: 'block', marginLeft: '26px'}}>上传文件预览</span>
        )
        break;
      case 1:
        html = (
          <span style={{marginTop: '18px', display: 'block'}}>进度条未开发</span>
        )
        break;
      case 2:
        html = this.getUploadState('文件名称name0012345.war', '16.00GB', 2)
        break;
      case 3:
        html = this.getUploadState('文件名称name0012345.war', '16.00GB', 3)
        break;
      case 4:
        html = this.getUploadState('文件名称name0012345.war', '16.00GB', 4)
        break;
      default:
    }
    return html;
  }

  handleSelect = (value) => {
    this.setState({
      confVersion: value
    })
  }

  /**
   *分页
   */
  handleSelectPage = (eventKey) => {
    this.getVersionList(eventKey - 1);
  }

  /**
   *显示更多
   */
  showMoreClick = () => {
    this.setState({showMore: true});
  }

  render() {
    const {image} = this.props;
    let array = image.split(':');
    let version = array[array.length - 1];
    let versions = this.state.versions;

    let rversions = versions.length === 0 ? '暂无新版本' : versions.map((item, index) => {

      return (
        <Radio value={item.image_name}>
          <div className="u-radio-text">
            <span className="tag-name">{item.image_tag}</span>
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
              <i className="cl cl-update-p"/>
              升级
          </span>
              <Modal
                show={ this.state.showModal  }
                backdrop="static"
                className="upgrade-model"
                onHide={ this.close }>
                  <Modal.Header closeButton>
                      <Modal.Title>版本升级</Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                      <Row className="upgrade">
                        <FormGroup className="clearfix">
                            <Col md={12} sm={12} className="label-text">
                                <Label>镜像拉取命令</Label>
                            </Col>
                            <Col md={12} sm={12} className="cdm-copy">
                              <FormControl disabled ref="cmdName" defaultValue={'docker pull ' + this.props.overlay}/>
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
                              <Label>选择版本</Label>
                            </Col>
                            <Col md={9} sm={9} style={{paddingLeft: '0px'}}>
                              <Col md={12} sm={12} style={{paddingRight: '0px'}}>
                                <Radio.RadioGroup
                                  name="selVersion"
                                  selectedValue={this.state.selectedVersionValue}
                                  onChange={this.handleChange.bind(this)}>
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
                                      items={Math.ceil(this.state.maxCount / 3)}
                                      maxButtons={3}
                                      activePage={this.state.activePage}
                                      onSelect={this.handleSelectPage}/>
                                  ) :
                                  (
                                    this.state.maxCount > 3 ?
                                      <a href="javascript:void(0)" className="more"
                                         onClick={this.showMoreClick}>更多>></a> :
                                      ""
                                  )
                              }
                              </Col>
                              {/*<Col md={12} sm={12} className="upgrade-first-test"  style={{paddingLeft: '23px'}}>
                               找不到已经上传过的版本？试试直接上传吧！
                               </Col>
                               <Col md={12} sm={12}  style={{paddingLeft: '23px'}}>
                               <Button colors="primary" className="upload">上传</Button>
                               </Col>
                               <Col md={12} sm={12}  style={{paddingLeft: '23px'}}>
                               <div className="upgrade-second-test">*仅可上传类型为*****等格式的文件</div>
                               <div className="file-preview">
                               {this.createFileUploadState()}
                               </div>
                               </Col>*/}
                            </Col>
                        </FormGroup>
                      </Row>
                  </Modal.Body>

                  <Modal.Footer>
                    <div className="modal-footer">
                      <Button onClick={ this.close } shape="border" className="button">取消</Button>
                      <Button onClick={ this.rollback } colors="primary" className="button">升级</Button>
                    </div>
                  </Modal.Footer>
             </Modal>
          </span>
    )
  }
}


export default ShowOperVersionModal;
