import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import {Row, Col, Button, Form, Label, FormControl, Select, FormGroup, Upload, Icon, Message} from 'tinper-bee';
import {
  uploadConfigFile,
  addConfigFile,
  GetConfigVersionFromCenter
}from '../../../../serves/confCenter';

import {Base64} from 'js-base64';
import qs from 'qs';
import {err, warn, success} from 'components/message-util';

const Option = Select.Option;

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      env: '1',
      version: '',
      customVersion: '',
      way: 'upload',
      fileName: '',
      fileContent: '',
      appName: '',
      versionList: [],
    }
  }

  componentDidMount() {
    let { appList } = this.props;
    let appName = appList[0].value;

    this.getVersion(appName, '1');
    this.setState({
      appName
    })
  }

  getVersion = (appId, env) => {
    //获取版本列表
    GetConfigVersionFromCenter(`?appId=${ appId }&envId=${ env }&needDefine=false`)
      .then((res) => {
        if (res.data.success === 'true') {
          let version = '', versionList = res.data.page.result;

          if (versionList && versionList.length !== 0) {
            version = versionList[0].value;
          }

          this.setState({
            versionList,
            version
          });

        } else {
          this.setState({
            error: true,
          });
          err(res.data.error_message);
        }

      }).catch((e) => {
      err(e.response.data.error_message);
    });

  };


  /**
   * 下拉列表选择
   * @param state
   * @returns {function(*=)}
   */
  handleSelectChange = (state) => {
    let { appName} = this.state;

    return (value) => {
      switch (state) {
        case 'appName':
          this.getVersion(value, this.state.env);
          break;
        case 'env':
          this.getVersion(appName, value);
          break;
      }
      this.setState({
        [state]: value
      })
    }
  }

  /**
   * input框输入
   * @param state
   * @returns {function(*)}
   */
  handleInputChange = (state) => {
    return (e) => {
      this.setState({
        [state]: e.target.value
      })
    }
  }

  /**
   * 文件上传捕获
   * @param info
   */
  handleUploadWar = (info) => {

  }

  /**
   * 保存
   */
  handleSave = () => {
    let {way, version, customVersion, env, fileName, fileContent, file, appName} = this.state;

    if (version === 'custom' && customVersion === '') {
      return warn('请输入自定义版本号。');
    }

    version = version === 'custom' ? customVersion : version;

    let data;
    if (way === 'write') {
      data = {
        'appId': appName,
        'version': version,
        'envId': env,
        'fileName': fileName,
        'fileContent': Base64.encode(fileContent)
      };
      addConfigFile(qs.stringify(data))
        .then((res) => {
          if (res.data.success === 'true') {
            this.setState({
              fileName: '',
              fileContent: ''
            })
            success("上传成功。");
          } else {
            err(res.data.message);
          }
        }).catch((e) => {
        err(e.response.data.error_message);
      })
    } else {
      data = new FormData();
      data.append('myfilerar', file);
      data.append('appId', appName);
      data.append('version', version);
      data.append('envId', env);

      uploadConfigFile(data)
        .then((res) => {
          if (res.data.success === 'true') {
            this.setState({
              fileName: '',
              fileContent: ''
            })
            success("上传成功。");
          } else {
            err(res.data.error_message);
          }
        }).catch((e) => {
        err(e.response.data.error_message);
      })
    }
  }

  handleUpload = (e) => {
    this.setState({
      file: e.target.files[0]
    })
  }

  render() {
    let {appList, envList} = this.props;
    let {appName, versionList} = this.state;

    return (
      <Col md={8} mdOffset={1}>
        <Form style={{margin: '50px auto'}}>
          <Row>
            <FormGroup>
              <Col sm={3} xs={4} className="text-right">
                <Label>应用名称</Label>
              </Col>
              <Col sm={9} xs={8}>
                <Select
                  value={ appName }
                  onChange={this.handleSelectChange('appName')}>
                  {
                    appList.map(function (item, index) {
                      return (
                        <Option value={item.value} key={ index }>{ item.name }</Option>
                      )
                    })
                  }
                </Select>
              </Col>
            </FormGroup>
          </Row>
          <Row>
            <FormGroup>
              <Col sm={3} xs={4} className="text-right">
                <Label>版本</Label>
              </Col>
              <Col sm={9} xs={8}>
                <Select
                  value={ this.state.version }
                  onChange={this.handleSelectChange('version')}>
                  {
                    versionList.map(function (item, index) {
                      return (
                        <Option value={ item.value } key={ index }>{ item.value }</Option>
                      )
                    })
                  }
                  <Option value='custom' key='custom'>自定义版本</Option>
                </Select>
              </Col>
            </FormGroup>
          </Row>
          {
            this.state.version === 'custom' ? (
              <Row>
                <FormGroup>
                  <Col sm={3} xs={4} className="text-right">
                    <Label>自定义版本</Label>
                  </Col>
                  <Col sm={9} xs={8}>
                    <FormControl
                      value={ this.state.customVersion }
                      onChange={ this.handleInputChange('customVersion') }
                    />
                  </Col>
                </FormGroup>
              </Row>
            ) : ""
          }
          <Row>
            <FormGroup>
              <Col sm={3} xs={4} className="text-right">
                <Label>环境</Label>
              </Col>
              <Col sm={9} xs={8}>
                <Select
                  value={ this.state.env}
                  onChange={this.handleSelectChange('env')}>
                  {
                    envList.map(function (item, index) {
                      return (
                        <Option value={item.value} key={ index }>{ item.name }</Option>
                      )
                    })
                  }
                </Select>
              </Col>
            </FormGroup>
          </Row>
          <Row>
            <FormGroup>
              <Col sm={3} xs={4} className="text-right">
                <Label>应用名称</Label>
              </Col>
              <Col sm={9} xs={8}>
                <Select
                  value={ this.state.way }
                  className="select"
                  onChange={this.handleSelectChange('way')}>
                  <Option value="upload">上传文件</Option>
                  <Option value="write">输入文本</Option>
                </Select>
              </Col>
            </FormGroup>
          </Row>
          {
            this.state.way === 'upload' ? (
              <Row>
                <FormGroup>
                  <Col sm={3} xs={4} className="text-right">
                    <Label>应用上传</Label>
                  </Col>
                  <Col sm={9} xs={8}>
                    <FormControl
                      type="file"
                      ref="file"
                      onChange={ this.handleUpload }
                    />
                  </Col>
                </FormGroup>
              </Row>
            ) : (
              <Row>
                <FormGroup>
                  <Col sm={3} xs={4} className="text-right">
                    <Label>文件名</Label>
                  </Col>
                  <Col sm={9} xs={8}>
                    <FormControl
                      value={ this.state.fileName }
                      onChange={ this.handleInputChange('fileName') }
                    />
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col sm={3} xs={4} className="text-right">
                    <Label>输入文本</Label>
                  </Col>
                  <Col sm={9} xs={8}>
                      <textarea
                        value={ this.state.fileContent }
                        onChange={ this.handleInputChange('fileContent') }
                        style={{width: '100%'}}
                        rows="10"
                      />
                  </Col>
                </FormGroup>
              </Row>
            )
          }
        </Form>
        <Row>
          <Col sm={9} xs={8} smOffset={3} xsOffset={4}>
            <Button
              shape="squared"
              onClick={ this.handleSave }
              colors="primary">
              保存
            </Button>
          </Col>
        </Row>

      </Col>
    )
  }
}

export default Create;

