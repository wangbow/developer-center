import React,{ Component,PropTypes } from "react";
import {Link} from 'react-router';
import {Button,Table,FormControl,InputGroup,Form,FormGroup,Label,Message,Select} from 'tinper-bee';
import {GetDetail} from './server';
import Checkbox from 'rc-checkbox';

import "./index.css";

class Detail extends Component{
  constructor(props) {
    super(props);
    this.state = {
        dataSourceList: [],
        synTime: 10,
        filterCondition: "1=1",
        isSync: false

    }
  }
  componentDidMount() {

    this.onGetDetail();
  }

  onGetDetail = () => {
    let param = {
      id:this.props.params.id
    }
    let self = this;
    GetDetail(param).then((res) => {
      
      self.setState({detailList:res.data.detailMsg.data});
    })
  }

  render(){

    let self = this;
    let id,providerId,addTime,dbName,remark,port,ip;

    if(!this.state.detailList) {
      this.state.detailList = {};
    }
    

    

    return (
    <div className="add-source-manage">
        <Link to="/"><Button >返回</Button></Link>
        <Form horizontal>
          <FormGroup>
              <Label>id:</Label>
              <Label>{this.state.detailList.id}</Label>
          </FormGroup>
          <FormGroup>
              <Label>数据库名:</Label>
              <Label>{this.state.detailList.dbName}</Label>
          </FormGroup>
          <FormGroup>
              <Label>端口号:</Label>
              <Label>{ this.state.detailList.port}</Label>
          </FormGroup>
          <FormGroup>
              <Label>主机IP:</Label>
              <Label>{this.state.detailList.ip}</Label>
          </FormGroup>
          <FormGroup>
              <Label>添加时间:</Label>
              <Label>{this.state.detailList.addTime}</Label>
          </FormGroup>
          <FormGroup>
              <Label>用户id:</Label>
              <Label>{this.state.detailList.providerId}</Label>
          </FormGroup>
          <FormGroup>
              <Label>备注:</Label>
              <Label>{this.state.detailList.remark}</Label>
          </FormGroup>
          
       
      </Form>
      
    </div>)
  }
}

Detail.contextTypes = {
    router: PropTypes.object
};

export default Detail;
