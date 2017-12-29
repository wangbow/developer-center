import React,{ Component,PropTypes } from "react";
import {Row, Col, Button,Table,FormControl,InputGroup,Form,FormGroup,Label,Message,Select} from 'tinper-bee';
import {GetAddSource,CheckLink,GetGatabase} from './server';
import Title from 'components/Title';
import "./index.css";
class AddDBSource extends Component{
  constructor(props) {
    super(props);
    this.state = {
        dataSourceList: [],
        DBsourceList: ["请选择"],
        linkFlag: false,
        showDbSelect: false
    }
  }
  componentDidMount() {
    // GetSourceList(function(response) {
    //   let res = lintData(response);
    // })
  }


  getGatabase = () => {

    let port = ReactDOM.findDOMNode(this.refs.port).value;
    let ip = ReactDOM.findDOMNode(this.refs.ip).value;
    let dbUsername = ReactDOM.findDOMNode(this.refs.dbUsername).value;
    let dbPassword = ReactDOM.findDOMNode(this.refs.dbPassword).value;
    let dbDriverClass = "com.mysql.jdbc.Driver";

    if(dbUsername=="" || dbPassword=="" || ip=="" || port=="") {
      this.setState({showDbSelect:false});
      return;
    }
    let param = {
      dbUsername:dbUsername,
      dbPassword:dbPassword,
      dbDriverClass:dbDriverClass,
      ip:ip,
      port:port
    }

    let self = this;
    GetGatabase(param,function(response) {
      let res = response;
      if(res.data.success) {
        let DBsourceList = res.data.detailMsg.data || ["请选择"];
        self.setState({DBsourceList:DBsourceList,showDbSelect:true,currentDBName:DBsourceList[0]});
      }

    })
  }

   //选择数据库
  OnChooseSource = (value) => {
    this.setState({currentDBName:value});
  }

  onAddSource = () => {
    let self = this;

    let dbName = ReactDOM.findDOMNode(this.refs.dbName).value;
    let port = ReactDOM.findDOMNode(this.refs.port).value;
    let ip = ReactDOM.findDOMNode(this.refs.ip).value;
    let dbUsername = ReactDOM.findDOMNode(this.refs.dbUsername).value;
    let dbPassword = ReactDOM.findDOMNode(this.refs.dbPassword).value;
    let dbDriverClass = "com.mysql.jdbc.Driver";
    let remark = ReactDOM.findDOMNode(this.refs.remark).value;


    if(!this.state.linkFlag) {
      Message.create({content: "请先保证测试连接成功", color: 'warning',duration:2});
      return;
    }


    let param = {
      dbName:dbName,
      dbUsername:dbUsername,
      dbPassword:dbPassword,
      dbDriverClass:dbDriverClass,
      remark:remark,
      ip:ip,
      port:port
    }

    GetAddSource(param,function(response) {
      let res = response;

      if(res.data.success == "success") {
        Message.create({content: res.message || "保存成功", color: 'success',duration:4.5});
        self.context.router.push('/');
      }else {
        Message.create({content: res.data.message || "保存失败", color: 'warning',duration:4.5});
      }


    })
  }

  testLink = () => {
    let self = this;
    let dbName = ReactDOM.findDOMNode(this.refs.dbName).value;
    let port = ReactDOM.findDOMNode(this.refs.port).value;
    let ip = ReactDOM.findDOMNode(this.refs.ip).value;
    let dbUsername = ReactDOM.findDOMNode(this.refs.dbUsername).value;
    let dbPassword = ReactDOM.findDOMNode(this.refs.dbPassword).value;
    let dbDriverClass = "com.mysql.jdbc.Driver";
    let remark = ReactDOM.findDOMNode(this.refs.remark).value;


    if(port == '') {
      Message.create({content: "端口不能为空", color: 'warning',duration:4.5})
      return;
    }
    if(ip == '') {
      Message.create({content: "ip不能为空", color: 'warning',duration:4.5})
      return;
    }
    if(dbUsername == '') {
      Message.create({content: "用户名不能为空", color: 'warning',duration:4.5})
      return;
    }
    if(dbPassword == '') {
      Message.create({content: "用户密码不能为空", color: 'warning',duration:4.5})
      return;
    }
    if(dbDriverClass == '') {
      Message.create({content: "JDBC不能为空", color: 'warning',duration:4.5})
      return;
    }
    if(dbName == '') {
      Message.create({content: "数据库名不能为空", color: 'warning',duration:4.5})
      return;
    }
    if(remark == '') {
      Message.create({content: "描述不能为空", color: 'warning',duration:4.5})
      return;
    }


    let param = {
      dbName:dbName,
      dbUsername:dbUsername,
      dbPassword:dbPassword,
      dbDriverClass:dbDriverClass,
      remark:remark,
      ip:ip,
      port:port
    };

    CheckLink(param).then(function(response) {
      let res = response;
      if(res.data.success == "success") {
        Message.create({content: "连接成功", color: 'success',duration:2});
        self.setState({linkFlag:true})
        self.onAddSource();
      }else {
        Message.create({content: res.data.message, color: 'warning',duration:2});
      }
    })
  }

  onChangeValue = () => {
    this.getGatabase();
    this.setState({linkFlag:false});
  }

  render(){
    // <FormGroup>
    //     <Label>实例名称:(请先填以上信息)</Label>
    //     <Select disabled={!this.state.showDbSelect} value={this.state.currentDBName}
    //               onChange={this.OnChooseSource}>
    //           {DBSourceNameOptions}
    //     </Select>
    // </FormGroup>

    let DBsourceList = this.state.DBsourceList || ["请选择"];

    const DBSourceNameOptions = DBsourceList.map(DBsource => <Option key={DBsource} value={DBsource}>{DBsource}</Option>);

    return (
    <Row className="add-source-manage">
      <Title name="新增数据源" />
      <Col md={12}>
        <Form horizontal>
          <FormGroup>
            <Label>数据源名称:</Label>
            <FormControl ref="dbName" onChange={this.onChangeValue}/>
          </FormGroup>
          <FormGroup>
            <Label>端口:</Label>
            <FormControl ref="port" defaultValue="3306" onChange={this.onChangeValue}/>
          </FormGroup>
          <FormGroup>
            <Label>主机名/Ip:</Label>
            <FormControl ref="ip" placeholder="localhost" onChange={this.onChangeValue}/>
          </FormGroup>
          <FormGroup>
            <Label>用户名:</Label>
            <FormControl ref="dbUsername" placeholder="只读用户名" onChange={this.onChangeValue}/>
          </FormGroup>
          <FormGroup>
            <Label>密码:</Label>
            <input type="password" className="test-input" onChange={this.onChangeValue} />
            <FormControl ref="dbPassword" defaultValue="" type="password" onChange={this.onChangeValue}/>
          </FormGroup>
          <FormGroup>
            <Label>描述:</Label>
            <FormControl ref="remark" placeholder="" onChange={this.onChangeValue}/>
          </FormGroup>

        </Form>
        <div className="footer-button">
          <Button onClick={this.testLink}>添加数据源</Button>
        </div>
      </Col>

    </Row>)
  }
}

AddDBSource.contextTypes = {
    router: PropTypes.object
};

export default AddDBSource;
