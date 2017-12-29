import React, {Component, PropTypes} from "react";
import {Link} from 'react-router';
import {Button, Table, FormControl, InputGroup, Form, FormGroup, Label, Message, Select} from 'tinper-bee';
import {GetDetail, CheckLink, GetAddSource, UpdateSource} from './server';
import Checkbox from 'rc-checkbox';
import PageLoading from 'components/loading';
import "./index.css";


class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSourceList: [],
      synTime: 10,
      filterCondition: "1=1",
      isSync: false,
      showLoading: true
    }
  }

  componentDidMount() {

    this.onGetDetail();
  }

  onGetDetail = () => {
    let param = {
      id: this.props.params.id
    }
    let self = this;
    GetDetail(param).then(function (res) {
      self.setState({detailList: res.data.detailMsg.data});
      this.setState({
        showLoading: false
      })
    }).catch((e) => {
      this.setState({
        showLoading: false
      })
    })
  }
  onAddSource = () => {
    let self = this;

    let dbName = this.state.detailList.dbName;
    let id = this.state.detailList.id;
    let addTime = ReactDOM.findDOMNode(this.refs.addTime).value;
    let providerId = ReactDOM.findDOMNode(this.refs.providerId).value;
    let remark = ReactDOM.findDOMNode(this.refs.remark).value;


    if (!this.state.linkFlag) {
      Message.create({content: "请先保证测试连接成功", color: 'warning', duration: 2});
      return;
    }


    let param = {
      id: id,
      addTime: addTime,
      providerId: providerId,
      remark: remark,
      dbName: dbName,
    }

    GetAddSource(param, function (response) {
      let res = response;

      if (res.data.success == "success") {
        Message.create({content: res.message || "保存成功", color: 'success', duration: 4.5});
        self.context.router.push('/');
      } else {
        Message.create({content: res.data.message || "保存失败", color: 'warning', duration: 4.5});
      }


    })
  }
  testLink = () => {

    let self = this;
    let dbName = this.state.detailList.dbName;
    let id = this.state.detailList.id;
    let remark = ReactDOM.findDOMNode(this.refs.remark).value;
    let dbPassword = ReactDOM.findDOMNode(this.refs.dbPassword).value;
    let port = ReactDOM.findDOMNode(this.refs.port).value;
    let ip = ReactDOM.findDOMNode(this.refs.ip).value;
    let dbUsername = ReactDOM.findDOMNode(this.refs.dbUsername).value;


    if (dbUsername == '') {
      Message.create({content: "用户名不能为空", color: 'warning', duration: 4.5})
      return;
    }
    if (ip == '') {
      Message.create({content: "/主机名IP不能为空", color: 'warning', duration: 4.5})
      return;
    }
    if (port == '') {
      Message.create({content: "端口不能为空", color: 'warning', duration: 4.5})
      return;
    }
    if (dbPassword == '') {
      Message.create({content: "密码不能为空", color: 'warning', duration: 4.5})
      return;
    }
    this.setState({
      showLoading: true
    });

    let param = {
      id: id,
      dbUsername: dbUsername,
      remark: remark,
      dbName: dbName,
      port: port,
      ip: ip,
      dbDriverClass: "com.mysql.jdbc.Driver",
      dbPassword: dbPassword
    };

    CheckLink(param).then(function (response) {
      let res = response;
      if (res.data.success == "success") {
        self.setState({linkFlag: true})
        self.onSaveSource();
      } else {
        Message.create({content: res.data.message, color: 'warning', duration: 2});
      }
      self.setState({
        showLoading: false
      })
    }).catch((e) => {
      self.setState({
        showLoading: false
      })
    })
  }

  onSaveSource = () => {
    let dbName = this.state.detailList.dbName;
    let id = this.state.detailList.id;
    let remark = ReactDOM.findDOMNode(this.refs.remark).value;
    let dbPassword = ReactDOM.findDOMNode(this.refs.dbPassword).value;
    let port = ReactDOM.findDOMNode(this.refs.port).value;
    let ip = ReactDOM.findDOMNode(this.refs.ip).value;
    let dbUsername = ReactDOM.findDOMNode(this.refs.dbUsername).value;

    let param = {
      id: id,
      dbUsername: dbUsername,
      remark: remark,
      dbName: dbName,
      port: port,
      ip: ip,
      dbDriverClass: "com.mysql.jdbc.Driver",
      dbPassword: dbPassword

    }
    UpdateSource(param, function (response) {
      let res = response;
      if (res.data.success == "success") {
        Message.create({content: "保存成功", color: 'success', duration: 4});
        self.context.router.push('/');
      } else {
        Message.create({content: "保存失败", color: 'warning', duration: 4});
      }
    })
  }

  render() {
    let self = this;
    let id = this.state.detailList && this.state.detailList.id;
    let dbName = this.state.detailList && this.state.detailList.dbName;
    let remark = this.state.detailList && this.state.detailList.remark;
    let dbUsername = this.state.detailList && this.state.detailList.dbUsername;
    let dbPassword = this.state.detailList && this.state.detailList.dbPassword;
    let ip = this.state.detailList && this.state.detailList.dbPassword;
    let port = this.state.detailList && this.state.detailList.dbPassword;


    return (
      <div className="add-source-manage">
        <Link to="/"><Button >返回</Button></Link>
        <Form horizontal>
          <FormGroup className="hide">
            <Label>id:</Label>
            <Label ref="id">{id}</Label>
          </FormGroup>
          <FormGroup>
            <Label>数据库名:</Label>
            <Label ref="dbName">{dbName}</Label>
          </FormGroup>

          <FormGroup>
            <Label>用户名:</Label>
            <input className="u-form-control" type="text" ref="dbUsername" onChange={this.onChangeValue}/>
          </FormGroup>

          <FormGroup>
            <Label>密码:</Label>
            <input type="password" className="u-form-control" ref="dbPassword" onChange={this.onChangeValue}/>
          </FormGroup>
          <FormGroup>
            <Label>主机名/IP:</Label>
            <input type="text" className="u-form-control" ref="ip" defaultValue="localhost"
                   onChange={this.onChangeValue}/>
          </FormGroup>
          <FormGroup>
            <Label>端口:</Label>
            <input type="text" className="u-form-control" ref="port" defaultValue="3306" onChange={this.onChangeValue}/>
          </FormGroup>
          <FormGroup>
            <Label>备注:</Label>
            <input className="u-form-control" type="text" ref="remark" defaultValue={remark}
                   onChange={this.onChangeValue}/>
          </FormGroup>


        </Form>
        <div className="footer-button">
          <Button onClick={this.testLink}>保存</Button>
        </div>
        <PageLoading show={ this.state.showLoading }/>
      </div>)
  }
}

Edit.contextTypes = {
  router: PropTypes.object
};

export default Edit;
