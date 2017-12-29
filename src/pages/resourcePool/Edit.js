import React, {Component} from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import {Modal, Button, Row, Col, FormGroup, Switch, Label, FormControl, Message, Loading} from 'tinper-bee';
import { getCookie, loadHide,loadShow} from '../../components/util';

class Edit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            id:'',
            name:'',
            description:'',
            invitecode:''
        };
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.handlerChange = this.handlerChange.bind(this);
    }

    close() {
        this.setState({
            showModal: false,
            id:'',
            name:'',
            description:'',
            invitecode:''
        });
    }

    handlerChange() {
        let self=this;
        self.setState({
            name: ReactDOM.findDOMNode(this.refs.name).value,
            description: ReactDOM.findDOMNode(this.refs.description).value
        });
    }

    open() {
        let self=this;
        //loadShow.call(self);
        self.setState({
            showModal: true
        });
        let id=self.props.text.id;
        axios.get('/res-pool-api/v1/resource_pools/'+id).then(function(res){
            //loadHide.call(self);
           if(res){
               let data=res.data;
               self.setState({
                   showModal:true,
                   id:data.id,
                   name:data.name,
                   description:data.description
               })
           }else{
               self.close();
               return Message.create({content:'请求出错',color:'danger',duration: null})
           }
        }).catch(function (err) {
            //loadHide.call(self);
            self.close();
            console.log(err);
            return Message.create({content: '请求出错', color: 'danger',duration: null});

        });
    }

    onAdd() {
        let self = this;
        //loadShow.call(self);
        let id=self.state.id;
        let param = {
            id:id,
            name: ReactDOM.findDOMNode(this.refs.name).value,
            description: ReactDOM.findDOMNode(this.refs.description).value,
            providerId:getCookie('u_providerId')
        };
        axios.put('/res-pool-api/v1/resource_pools/'+id, param)
            .then(function (res) {
                //loadHide.call(self);
                self.close();
                if (res&&res.data&&res.data.flag&&res.data.flag=='fail') {
                    return Message.create({content: res.data.msg||'操作失败', color: 'danger',duration: null});

                } else {
                    document.getElementById('refresh').click();
                    return Message.create({content: '操作成功', color: 'success'});
                }
            })
            .catch(function (err) {
                //loadHide.call(self);
                self.close();
                console.log(err);
                return Message.create({content: '请求出错', color: 'success'});
            });
    }

    render() {
        const {title} = this.props;

        return (
            <span className="create-key-modal"><span ref="pageloading"> </span>
              <a onClick={ this.open } className="operate-button">{title}</a>
              <Modal
                  show={ this.state.showModal  }
                  onHide={ this.close }>
                  <Modal.Header>
                      <Modal.Title>修改资源池</Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                        <FormGroup>
                          <Label>资源池名称：</Label>
                          <FormControl ref="name" value={this.state.name} onChange={this.handlerChange}/>
                        </FormGroup>
                        <FormGroup>
                          <Label>资源池描述：</Label>
                          <FormControl ref="description" value={this.state.description} onChange={this.handlerChange}/>
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

export default Edit;
