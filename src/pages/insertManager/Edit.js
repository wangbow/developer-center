import React, {Component} from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import {Modal,Button,Row,Col,FormGroup,Label,FormControl,Message,Loading,Checkbox,InputGroup} from 'tinper-bee';
import VerifyInput from '../../components/verifyInput/index';
import {loadHide, loadShow, HTMLDecode} from '../../components/util';

class Bind extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            error: 'none',
            private: 'table',
            notPrivate: 'none',
            privateFlag: true,
            errorMsg: '请输入必填项',
            pdomain: '',
            domain: '',
            port: '',
            host: ''
        };
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.check = this.check.bind(this);
        this.handlerChange = this.handlerChange.bind(this);
        this.focus = this.focus.bind(this);

    }

    handlerChange() {
        let self = this;
        self.setState({
            pdomain: ReactDOM.findDOMNode(this.refs.notPrivate).value,
            domain: ReactDOM.findDOMNode(this.refs.private).value,
            port: ReactDOM.findDOMNode(this.refs.port).value,
            host: ReactDOM.findDOMNode(this.refs.host).value
        });
    }

    close() {
        this.setState({
            showModal: false,
            error: 'none',
            private: 'table',
            notPrivate: 'none',
            privateFlag: true,
            errorMsg: '请输入必填项',
            pdomain: '',
            domain: '',
            port: '',
            host: ''
        });
    }

    open() {
        let self = this;
        let text = self.props.text;
        let domain = text.domain;
        if (domain.indexOf('.app.yonyoucloud.com') != -1) {
            this.setState({
                showModal: true,
                host: text.host,
                port: text.port,
                pdomain: domain.replace('.app.yonyoucloud.com', ''),
                domain: domain.replace('.app.yonyoucloud.com', ''),
                private: 'table',
                notPrivate: 'none',
                privateFlag: true,
            });
        } else {
            this.setState({
                showModal: true,
                host: text.host,
                port: text.port,
                pdomain: domain,
                domain: domain,
                private: 'none',
                notPrivate: 'block',
                privateFlag: false,
            });
        }
    }

    focus(ele) {
        let self = this;
        let value = ReactDOM.findDOMNode(ele).value;
        if (value) {
            self.setState({
                error: 'none'
            });
            return false;
        } else {
            self.setState({
                error: 'block'
            });
            ReactDOM.findDOMNode(ele).focus();
            return true;
        }

    }

    check() {
        let flag = !this.state.privateFlag;
        if (flag) {
            this.setState({
                privateFlag: flag,
                private: 'table',
                notPrivate: 'none',
                error: 'none'
            });
        } else {
            this.setState({
                privateFlag: flag,
                private: 'none',
                notPrivate: 'block',
                error: 'none'
            });
        }


    }

    onAdd() {
        let self = this;
        let notPrivateV = ReactDOM.findDOMNode(self.refs.notPrivate);
        let privateV = ReactDOM.findDOMNode(self.refs.private);
        let domain = '';
        if (notPrivateV.style.display == 'none') {
            if (privateV) {
                domain = privateV.value + '.app.yonyoucloud.com';
            }
            if (self.focus(self.refs.private))return;
            if (ReactDOM.findDOMNode(self.refs.p).getElementsByClassName('show-warning').length)return;
        } else {
            domain = notPrivateV.value;
            if (self.focus(self.refs.notPrivate))return;
            if (ReactDOM.findDOMNode(self.refs.notP).getElementsByClassName('show-warning').length)return;
        }
        let host = ReactDOM.findDOMNode(self.refs.host).value;
        let port = ReactDOM.findDOMNode(self.refs.port).value;
        if (self.focus(self.refs.host))return;
        if (self.focus(self.refs.port))return;
        //loadHide.call(self);
        let param = self.props.text;
        param.host = host;
        param.port = port;
        param.haproxy = self.props.text.haproxy || {};
        param.haproxy.host = host;
        param.haproxy.port = port;
        param.domain = domain;
        axios.post('/domain-edna/web/v1/domain/update_link',param)
            .then(function (res) {
                //loadHide.call(self);
                self.close();
                if (res.data.error_code) {
                    return Message.create({
                        content: HTMLDecode(res.data.error_message || '请求错误'),
                        color: 'danger',
                        duration: null
                    });
                } else {
                    document.getElementById('refresh').click();
                    return Message.create({content: '操作成功', color: 'success'});
                }

            })
            .catch(function (err) {
                //loadHide.call(self);
                console.log("error");
            });
    }

    render() {
        const {title} = this.props;
        return (
            <span className="create-key-modal "><span ref="pageloading"> </span>
              <i onClick={ this.open } className="uf uf-pencil" title={title}> </i>
              <Modal show={ this.state.showModal  } onHide={ this.close } className="insert-manager-bind">
                  <Modal.Header>
                      <Modal.Title>修改接入</Modal.Title>
                  </Modal.Header>

                 <Modal.Body>
                      <Row>
                          <FormGroup>
                              <Col md={2} sm={2}>
                                  <Label>

                                  </Label>
                              </Col>
                              <Col md={5} sm={6}>
                                  <div onClick={this.check} className="privite-domain">
                                      <Checkbox  >自有域名</Checkbox>
                                  </div>

                              </Col>
                          </FormGroup>
                      </Row>
                      <Row>
                          <FormGroup className="clearfix">
                              <Col md={2} sm={2} className="text-right">
                                  <Label>域名:</Label>
                              </Col>
                              <Col md={9} sm={9} ref="notP" style={{'display': this.state.notPrivate}}>
                                  <VerifyInput message="请输入正确的域名" isModal verify={/^[a-zA-Z_0-9\u4e00-\u9fa5]+\.([a-zA-Z_0-9\u4e00-\u9fa5]+\.){0,}[a-zA-Z_0-9\u4e00-\u9fa5]+$/}>
                                   <InputGroup>
                                   <InputGroup.Addon >
                                       <span className="mast">*</span>
                                   </InputGroup.Addon>
                                    <FormControl ref="notPrivate" style={{'display': this.state.notPrivate}}
                                                 onChange={this.handlerChange} value={this.state.pdomain}/>
                                   </InputGroup>
                                   </VerifyInput>
                              </Col>
                              <Col md={9} sm={9} ref="p" style={{'display': this.state.private}}>
                                                                     <VerifyInput message="请输入正确的域名" isModal isRequire>

                                  <InputGroup >
                                        <InputGroup.Addon>
                                            <span className="mast">*</span>http://
                                        </InputGroup.Addon>
                                      <FormControl ref="private" style={{'display': this.state.private}} type="text"
                                                   onChange={this.handlerChange} value={this.state.domain}/>
                                        <InputGroup.Addon>.app.yonyoucloud.com</InputGroup.Addon>
                                  </InputGroup>
                                                                     </VerifyInput>
                              </Col>
                          </FormGroup>
                          <FormGroup className="clearfix">
                              <Col md={2} sm={2} className="text-right">
                                  <Label>IP地址:</Label>
                              </Col>
                              <Col md={9} sm={9}>
                                   <VerifyInput message="请输入IP地址" isModal isRequire>
                                  <InputGroup>
                                   <InputGroup.Addon ><span className="mast">*</span></InputGroup.Addon>
                                    <FormControl ref="host" value={this.state.host} onChange={this.handlerChange}/>
                                  </InputGroup>
                                   </VerifyInput>
                              </Col>
                          </FormGroup>
                          <FormGroup className="clearfix">
                              <Col md={2} sm={2} className="text-right">
                                  <Label>端口号:</Label>
                              </Col>
                              <Col md={9} sm={9}>
                                   <VerifyInput message="请输入端口号" isModal isRequire>
                                  <InputGroup>
                                   <InputGroup.Addon><span className="mast">*</span></InputGroup.Addon>
                                    <FormControl type="number" min="0" max="65535" ref="port" value={this.state.port}
                                                 onChange={this.handlerChange}/>
                                  </InputGroup>
                                   </VerifyInput>
                              </Col>
                          </FormGroup>

                          <FormGroup className="clearfix error" style={{'display': this.state.error}}>
                              <Col md={2} sm={2} className="text-right">

                              </Col>
                              <Col md={10} sm={10}>
                                  <Label style={{'color': 'red'}}>{this.state.errorMsg}</Label>
                              </Col>

                          </FormGroup>
                      </Row>
                  </Modal.Body>

                  <Modal.Footer>
                      <Button onClick={ this.close } shape="border" style={{marginRight: 50}}>关闭</Button>
                      <Button onClick={ this.onAdd } colors="primary">确认</Button>
                  </Modal.Footer>
              </Modal>
          </span>
        )
    }
}

export default Bind;
