import React, {Component, PropTypes} from 'react';
import Title from 'components/Title';
import {Row, Col, Button, Form, Label, FormControl, Select, FormGroup, Upload, Icon, Message} from 'tinper-bee';
import {createApp}from 'serves/confCenter';
import qs from 'qs';
import {success, err} from 'components/message-util'

class Create extends Component {
  static contextTypes = {
    router: PropTypes.object
  }
  state = {
    appName: '',
    desc: '',
    email: ''
  }

  /**
   * 输入框捕获
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
    let data = {
      app: this.state.appName,
      desc: this.state.desc,
      email: this.state.email
    }
    createApp(qs.stringify(data)).then((res) => {
      if (res.data.error_code) {
        err(res.data.error_message ? `${res.data.error_code}: ${res.data.error_message}` : '创建出错。');
      } else {
        success('创建成功。');

        this.setState({
          appName: '',
          email: '',
          desc: ''
        });

        this.context.router.push('/');
      }
    }).catch((e) => {
      err(e.response.data.error_message);
    })
  }

  render() {
    return (
      <Row>
        <Title name="创建应用"/>
        <Col md={8} mdOffset={1}>
          <Form style={{margin: '50px auto'}}>
            <Row>
              <FormGroup>
                <Col sm={3} xs={4} className="text-right">
                  <Label>应用名称</Label>
                </Col>
                <Col sm={9} xs={8}>
                  <FormControl
                    value={ this.state.appName }
                    onChange={ this.handleInputChange('appName')}
                  />
                </Col>
              </FormGroup>
            </Row><Row>
            <FormGroup>
              <Col sm={3} xs={4} className="text-right">
                <Label>通知邮箱</Label>
              </Col>
              <Col sm={9} xs={8}>
                <FormControl
                  value={ this.state.email }
                  onChange={ this.handleInputChange('email')}
                />
              </Col>
            </FormGroup>
          </Row>
            <Row>
              <FormGroup>
                <Col sm={3} xs={4} className="text-right">
                  <Label>说明</Label>
                </Col>
                <Col sm={9} xs={8}>
                                    <textarea
                                      value={ this.state.desc }
                                      onChange={ this.handleInputChange('desc') }
                                      style={{width: '100%'}}
                                      rows="10"
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
      </Row>
    )
  }
}


export default Create;
