import React, {Component} from 'react';

import {Row, Col, Button, Form, Label, FormControl, Select, FormGroup, Upload, Icon, Message} from 'tinper-bee';
import {
  createItem,
  GetConfigVersionFromCenter
}from '../../../../serves/confCenter';

import { err, warn, success } from 'components/message-util';
import qs from 'qs';

const Option = Select.Option;

class CreateItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      env: '1',
      version: '',
      versionList: [],
      envList: [],
      appList: [],
      way: 'upload',
      key: '',
      value: '',
      customVersion: '',
      appName: ''
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
    let { appName } = this.state;
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
   * 输入框事件
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
   * 保存
   */
  handleSave = () => {
    let { version, customVersion, appName } = this.state;

    if (version === 'custom' && customVersion === '') {
      return warn('请输入自定义版本号。');
    }
    let totalVersion = version === 'custom' ? customVersion : version;
    let data = {
      appId: appName,
      version: totalVersion,
      envId: this.state.env,
      key: this.state.key,
      value: this.state.value
    };
    createItem(qs.stringify(data)).then((res) => {
      if (res.data.success === 'true') {
        success('创建成功。');
        this.setState({
          key: '',
          value: ''
        })
      } else {
        err(res.data.error_message);
      }
    }).catch((e) => {
      err(e.response.data.error_message);
    })
  }

  render() {
    let { appList, envList } = this.props;
    let { appName, versionList } = this.state;
    return (
        <Col md={8}>
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
                        onChange={ this.handleInputChange('customVersion')}
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
                  <Label>配置项名</Label>
                </Col>
                <Col sm={9} xs={8}>
                  <FormControl
                    value={ this.state.key }
                    onChange={ this.handleInputChange('key')}
                  />
                </Col>
              </FormGroup>
            </Row>
            <Row>
              <FormGroup>
                <Col sm={3} xs={4} className="text-right">
                  <Label>配置项值</Label>
                </Col>
                <Col sm={9} xs={8}>
                  <FormControl
                    value={ this.state.value }
                    onChange={ this.handleInputChange('value')}
                  />
                </Col>
              </FormGroup>
            </Row>

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

export default CreateItem;
