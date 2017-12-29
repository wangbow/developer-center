import React, {Component} from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import {Modal, Button, Row, Col, FormGroup, Switch, Label, FormControl, Message, Loading} from 'tinper-bee';
import {splitParam, HTMLDecode, getCookie,loadHide,loadShow} from '../../components/util';
import style from './index.css';

class Bind extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            showError:'none'
        };
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.apply=this.apply.bind(this);
    }
    apply(){
        window.parent.location.hash='#/ifr/%252Ffe%252FInvite%252Findex.html';
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

    onAdd() {
        let self = this;
        let invitecode=ReactDOM.findDOMNode(this.refs.invitecode).value;
        if(invitecode){
            this.setState({
                showError: 'none'
            });
        }else{
            this.setState({
                showError: 'block'
            });
            return;
        }
        //loadShow.call(self);
        let finshFlag=self.props.finsh;
        let paramInvitecode={
            invitecode:ReactDOM.findDOMNode(this.refs.invitecode).value,
        };
        axios.post('/invitecode/web/v1/poolcode/verifyCode',splitParam(paramInvitecode))
            .then(function(res){
                if(res&&res.data&&res.data.success=='success'){
                    self.close();
                    if(finshFlag){
                        location.hash='#/ifr/%252Ffe%252FresourcePool%252Findex.html';
                        return Message.create({content: '操作成功', color: 'success'});
                    }else{
                        document.getElementById('refresh').click();
                        return Message.create({content: '操作成功', color: 'success'});
                    }
                }else{
                    //loadHide.call(self);
                    self.close();
                    return Message.create({content: HTMLDecode(res.data.error_message), color: 'danger'});
                }
            })
            .catch(function(err){
                //loadHide.call(self);
                self.close();
                console.log(err);
                return Message.create({content: '请求出错', color: 'danger'});
            })

    }

    render() {
        const {title} = this.props;
        return (
            <span className="create-key-modal"><span ref="pageloading"> </span>
              <Button onClick={ this.open } colors="info">{title}</Button>
              <Modal
                  show={ this.state.showModal  }
                  onHide={ this.close }>
                  <Modal.Header>
                      <Modal.Title>创建资源池</Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                        <FormGroup>
                          <Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;邀请码：</Label>
                          <FormControl ref="invitecode"/>
                        </FormGroup>
                       <FormGroup style={{'display':this.state.showError}}>
                           <Label style={{'color':'red'}}>邀请码为必填项</Label>
                       </FormGroup>
                        <FormGroup>
                          <Label>
                              还没有邀请码？<a onClick={this.apply} className="go-apply">去申请</a>
                          </Label>
                        </FormGroup>

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