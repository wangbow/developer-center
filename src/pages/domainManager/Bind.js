import React,{Component} from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import {Modal, Button,Row ,Col,FormGroup,Label,FormControl,Message,Loading,Checkbox,InputGroup} from 'tinper-bee';
import Checkbox from 'rc-checkbox';
import style from 'rc-checkbox/assets/index.css';
import {loadHide,loadShow,splitParam,HTMLDecode} from '../../components/util';

class Bind extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            error:'none',
            private:'table',
            notPrivate:'none',
            privateFlag:true
        };
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.check=this.check.bind(this);

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
    }
    check(){
        let flag=!this.state.privateFlag;
        if(flag){
            this.setState({
                privateFlag:flag,
                private:'table',
                notPrivate:'none',
                error:'none'
            });
        }else{
            this.setState({
                privateFlag:flag,
                private:'none',
                notPrivate:'block',
                error:'none'
            });
        }


    }
    onAdd() {
        var self=this;
        let notPrivateV=ReactDOM.findDOMNode(self.refs.notPrivate);
        let privateV=ReactDOM.findDOMNode(self.refs.private);
        let domain='';
        let flagV=true;
        if(notPrivateV.style.display=='none'){
            domain=privateV.value+'.app.yonyoucloud.com';
            flagV=!!domain;
        }else{
            let reg=/^[a-zA-Z_0-9\u4e00-\u9fa5]+\.([a-zA-Z_0-9\u4e00-\u9fa5]+\.){0,}[a-zA-Z_0-9\u4e00-\u9fa5]+$/;
            domain=notPrivateV.value;
            flagV=reg.test(domain);
        }

        if(flagV){
            self.setState({
                error:'none'
            })
        }else{
            self.setState({
                error:'block'
            });
            return;
        }
        loadShow.call(self);



        let param = {
            domain : domain
        };

        axios.post('/edna/web/v1/domain/binddomain',splitParam(param))
            .then(function (res) {
                loadHide.call(self);
                self.close();
                if (res.data.error_code) {
                    return Message.create({content: HTMLDecode(res.data.error_message||'请求错误'), color: 'danger',duration: null});
                }else{
                    document.getElementById('refresh').click();
                    return Message.create({content: '操作成功', color: 'success'});
                }

            })
            .catch(function (err) {
                loadHide.call(self);
                console.log("error");
                return Message.create({content: HTMLDecode('请求错误'), color: 'danger',duration: null});
            });
    }

    render () {
        const {title} = this.props;

        return (
            <span className="create-key-modal domain"><span ref="pageloading"> </span>
              <Button onClick={ this.open } colors="info">{title}</Button>
              <Modal show = { this.state.showModal  } onHide = { this.close } >
                  <Modal.Header >
                      <Modal.Title>绑定域名</Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                      <Row>
                          <FormGroup>
                              <Col md={2} sm={2}>
                                  <Label>

                                  </Label>
                              </Col>
                              <Col md={5} sm={6}>
                                  <span onClick={this.check} className="privite-domain">
                                      <Checkbox/>
                                  </span>
                                  <span>自有域名</span>
                              </Col>
                          </FormGroup>
                      </Row>
                      <Row>
                          <FormGroup className="error">
                              <Col md={2} sm={2} className="text-right">
                                  <Label>域名:</Label>
                              </Col>
                              <Col md={9} sm={9}>
                                  <FormControl ref="notPrivate"  style={{'display':this.state.notPrivate}}/>
                                  <InputGroup style={{'display':this.state.private}}>
                                        <InputGroup.Addon>http://</InputGroup.Addon>
                                        <FormControl ref="private" type="text"   />
                                        <InputGroup.Addon>.app.yonyoucloud.com</InputGroup.Addon>
                                  </InputGroup>
                              </Col>
                          </FormGroup>
                          <FormGroup className="error" style={{'display':this.state.error}}>
                              <Col md={2} sm={2} className="text-right">

                              </Col>
                              <Col md={10} sm={10}>
                                  <Label  style={{'color':'red'}}>请填写正确的域名</Label>
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
