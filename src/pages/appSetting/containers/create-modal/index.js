import React, {Component, PropTypes} from 'react';
import Title from 'components/Title';
import {Modal, Row, Col, Button, Form, Label, FormControl, Select, FormGroup, Upload, Icon, Message} from 'tinper-bee';
import {createApp}from 'serves/confCenter';
import qs from 'qs';
import {success, err, warn} from 'components/message-util'
import './index.less';

import Loadingstate  from 'bee-loading-state';
import 'bee-loading-state/build/Loadingstate.css';

class Create extends Component {
  static contextTypes = {
    router: PropTypes.object
  }
  state = {
    appName: '',
    desc: '',
    email: '',
    show:false
  }

  /**
   * 输入框捕获
   * @param state
   * @returns {function(*)}
   */
  handleInputChange = (state) => (e) => {
      this.setState({
        [state]: e.target.value
      })
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
    if(data.app === ''){
      return Message.create({
        content:"应用名不能为空！",
        color: 'warning',
        duration: null
      })
    }
    if(data.desc === ''){
      return Message.create({
        content:"应用说明不能为空！",
        color: 'warning',
        duration: null
      })
    }
    this.handleCancel();
    createApp(qs.stringify(data)).then((res) => {
      if (res.data.error_code) {
        err(res.data.error_message ? `${res.data.error_code}: ${res.data.error_message}` : '创建出错。');
        this.setState({show:false});
      } else {
        Message.create({
          content:"创建成功！",
          color: 'success',
          duration: null
        })
        this.setState({
          appName: '',
          email: '',
          desc: '',
          show:false
        });

       // this.context.router.push('/');
      }
    }).catch((e) => {
      this.setState({show:false});
      err(e.response.data.error_message);

    })
  }

  handleCancel = () =>{
    this.setState({
      appName: '',
      desc: '',
      email: ''
    })
    this.props.closeCreateModal();
  }

  render() {
    let {showCreateModal }= this.props;
    return (
      <Modal
        show={ showCreateModal }
        className="simple-modal"
        size="md"
        onHide={ this.handleCancel }>
        <Modal.Header closeBtn>
          <Modal.Title className="modal-head">创建应用</Modal.Title>
        </Modal.Header>
        <Modal.Body>
              <Form style={{margin: '0 auto'}}>
                <Row>
                  <FormGroup>
                    <Col md={3} className="text-right">
                      <Label>应用名称</Label>
                    </Col>
                    <Col md={8}>
                      <FormControl
                        value={ this.state.appName }
                        onChange={ this.handleInputChange('appName')}
                        />
                    </Col>
                  </FormGroup>
                </Row>
                <Row>
                <FormGroup>
                  <Col md={3} className="text-right">
                    <Label>通知邮箱</Label>
                  </Col>
                  <Col md={8}>
                    <FormControl
                      value={ this.state.email }
                      onChange={ this.handleInputChange('email')}
                      />
                  </Col>
                </FormGroup>
              </Row>
                <Row>
                  <FormGroup>
                    <Col md={3}  className="text-right">
                      <Label>说明</Label>
                    </Col>
                    <Col md={8}>
                      <textarea
                        value={ this.state.desc }
                        onChange={ this.handleInputChange('desc') }
                        style={{width: '100%'}}
                        rows="8"
                        />
                    </Col>
                  </FormGroup>
                </Row>
              </Form>
        </Modal.Body>
        <Modal.Footer className="modal-footer">
          <Button onClick={ this.handleCancel } style={{marginRight: 50}} shape="squared">取消</Button>
          <Loadingstate 
            onClick = { this.handleSave } 
            colors = "primary"
            shape = "squared"
            show = { this.state.show }
          >保存</Loadingstate>
        </Modal.Footer>
      </Modal>
    )
  }
}
export default Create;
