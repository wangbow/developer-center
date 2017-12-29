import React, {Component} from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import {Modal, Button, Row, Col, FormGroup, Switch, Label, FormControl, Message, Loading} from 'tinper-bee';
import {splitParam, HTMLDecode,loadHide,loadShow} from '../../components/util';
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
    }

    close() {
        this.setState({
            showModal: false,
            showError:'none'
        });
    }

    open() {
        this.setState({
            showModal: true
        });
    }

    onAdd() {

        let self = this;
        let mail=ReactDOM.findDOMNode(this.refs.email).value;
        let reg=/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if(!reg.test(mail)){
            self.setState({
                showError:'block'
            });
            return;
        }else{
            self.setState({
                showError:'none'
            });
        }
        //loadShow.call(self);
        let param = {
            mail: ReactDOM.findDOMNode(this.refs.email).value
        };
        axios.post('/invitecode/web/v1/poolcode/apply', splitParam(param))
            .then(function (res) {
                //loadShow.call(self);
                self.close();
                if (res.success != "success") {
                    return Message.create({content: HTMLDecode(res.data.message), color: 'danger'});
                } else {
                    message();
                    return Message.create({content: HTMLDecode(res.data.message), color: 'success'});
                }

            })
            .catch(function (err) {
                //loadShow.call(self);
                console.log(err);
                return Message.create({content: '请求出错', color: 'success'});
            });
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
                      <Modal.Title>创建邀请码</Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                        <FormGroup>
                          <Label>邮箱：</Label>
                          <FormControl ref="email"/>
                        </FormGroup>
                      <FormGroup style={{'display':this.state.showError}}>
                          <Label style={{'color':'red'}}>邮箱格式错误</Label>
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
