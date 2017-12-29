import { Component, PropTypes } from 'react';
import { Col, Row, Button, FormGroup, FormControl, Icon, Form, Label, Radio, Select, Message,
        Pagination, InputGroup, Table, Popconfirm} from 'tinper-bee';
import Title from 'components/Title';
import Checkbox from 'rc-checkbox';
import 'rc-checkbox/assets/index.css';
import { Link ,hashHistory} from 'react-router';
import ErrorModal from 'components/ErrorModal';
import AddCaseModal  from '../../components/add-cases';
import SelectAppModal  from '../../components/select-app';
import {saveJob, viewTestJob, deleteJobCase} from 'serves/appTile';
import './index.less';
const Option = Select.Option;

export default class Create extends Component{
  state={
    name: '',
    desc: '',
    email: '',
    browser: 'chrome',
    status: 'Y',
    appName:'',
    appId:'',
    showAddCaseModal:false,
    showAppModal:false,
    jobCases:[],
    checkAllCases:false,
    showDelBatchModal:false,
    testjobId:null,
    bootTestJob:{},
    delecases:[],
  }
   executeOrder = 1;

  componentDidMount() {
    let data = this.props.location.state;
    if(data){
      let {id} = data;
        this.viewDetail(id).then((jobData) => {
          let bootTestJob = jobData.bootTestJob;
          let jobcases = jobData.bootJobCaseList;
          let maxExcuteOrder = 1;
            jobcases.forEach((item)=>{
              item.checked = false;
              if(item.executeOrder > maxExcuteOrder){maxExcuteOrder = item.executeOrder}
            })
          this.executeOrder = maxExcuteOrder + 1;
          this.setState({
            name: bootTestJob.testjobName,
            browser: bootTestJob.browserType,
            desc: bootTestJob.testjobNote,
            email: bootTestJob.email,
            status: bootTestJob.testjobState,
            testjobId: bootTestJob.testjobId,
            appName: bootTestJob.productName,
            appId: bootTestJob.productId,
            bootTestJob: bootTestJob,
            jobCases: jobcases
          })
        })
      }
  }
  /**
   * 获取任务信息
   */
    viewDetail = (id) =>{
     return viewTestJob(id).then((res) =>{
        let data = res.data;
        return data.data;
      })
    }


  /**
   * table数据为空时提示
   */
  emptyFunc = () => {
    return <span>还没有关联用例哦，请点击表格上方的按钮增加用例吧～</span>
  }

  /**
   * 页面值改变
   */
  handleChange = (state) => (e) => {
    this.setState({
      [state]: e.target.value
    })
  }

  /**
   * 浏览器类型值改变
   */
  handleTypeChange = (state)=>(value) =>{
    this.setState({
      [state]: value,
    });
  }

  /**
   * 关闭弹窗
   */
  closeModal =(str) =>{
    if(str == 'app'){
      this.setState({
        showAppModal:false
      })
    }else if(str == 'cases'){
      this.setState({
        showAddCaseModal:false
      })
    }else{
      this.setState({
        showDelBatchModal:false,
      })
    }
  }

  /**
   * 打开添加用例弹窗
   */
  openAddCasesModal = () =>{
    if(!this.state.appName){
      return Message.create({content: "请先选择应用！", color: 'warning', duration: 1.5})
    }
    this.setState({
      showAddCaseModal:true
    })
  }

  /**
   * 添加实例到列表
   */
  addCases = (list) => {
    if(list instanceof Array) {
      list.forEach((item) => {
        item.executeOrder = this.executeOrder;
        item.checked = false;
        this.executeOrder += 1;
        this.state.jobCases.push(item);
      })
      this.setState({
        jobCases:this.state.jobCases
      })
    }
  }

  /**
   * 打开选择应用弹窗
   */
  openSelectAppModal = () =>{
    this.setState({
      showAppModal:true
    })
  }

  /**
   * 选择应用
   */
  choiseApp = (rec) =>{
    this.setState({
      appId: rec.db_app_id,
      appName: rec.app_name
    })
  }


  /**
   * 全选用例
   */
  checkAll =() =>{
    if (!this.state.checkAllCases) {//当前操作是全选
      this.state.jobCases.forEach(function (item) {//影响每一行选择状态
        item.checked = true;
      })
    } else {//全部反选
      this.state.jobCases.forEach(function (item) {
        item.checked = false;
      })
    }
    this.setState({checkAllCases: !this.state.checkAllCases});//记录
  }

  /**
   * 选中当前行用例
   */
  selectCase =(e) =>{
    let index = e.target.index;
    let checkedAll = true;
    let {jobCases } = this.state;
    jobCases[index].checked = !jobCases[index].checked;//反选记录
    this.setState({jobCases: jobCases});
    if (e.target.checked) {//当前操作是选中
      jobCases.forEach((item, i)=> {//判断除了当前行是否都选中
        if (i !== index && !item.checked) {
          return checkedAll = false;
        }
      })
      if (checkedAll) {
        this.setState({checkAllCases: true});
      }
    } else {
      this.setState({checkAllCases: false});
    }
  }

  /**
   * 改变执行顺序
   */
  onInputChange = (index) => (e) => {
    let { jobCases } = this.state;
    let flag = false;
    jobCases.forEach((item)=>{
      if(item.executeOrder === e.target.value){
        return flag = true
        }
    })
    if(flag){
      return Message.create({content: "用例的执行顺序不能相同！", color: 'warning', duration: 1.5})
    }
    jobCases[index].executeOrder= e.target.value;
    this.setState({ jobCases });
  };

  /**
   * 删除单个用例
   */
  handleDelete =(obj) =>() =>{
    let {jobCases, delecases} = this.state;
    let temp = [];
    if(typeof(obj.jobCaseId) === "undefined"){
      temp = jobCases.filter((item) => {
        if(item.testcaseId !== obj.testcaseId || item.executeOrder !== obj.executeOrder) return item;
      })
    }else{
      delecases.push(obj);
      temp = jobCases.filter((item) => {
        if(item.jobCaseId !== obj.jobCaseId) return item;
      })
    }
    this.setState({
      jobCases:temp
    })
  }

  /**
   * 批量删除用例确认提示
   */
  deleBatch  = () =>{
    this.setState({
      showDelBatchModal:true
    })
  }

  /**
   * 批量删除用例
   */
  delonEnsure =() =>{
    let str = "del";
    this.closeModal(str);
    let {jobCases, delecases } = this.state;

    let checkFlag = false;//没有选中用例提示
    jobCases.forEach((item)=>{
      if(item.checked){return checkFlag = true}
    })
    if(!checkFlag){
      return Message.create({
        content: '请选择要删除的用例！',
        color: 'warning',
        duration: 1.5
      })
    }

    jobCases.forEach((item)=>{
      if(item.checked){
        jobCases = jobCases.filter((rec)=>{
          if(item.executeOrder !== rec.executeOrder) return rec;
        })
        if(typeof(item.jobCaseId) !== "undefined") {
          delecases.push(item);
        }
      }
    })
    this.setState({
      jobCases:jobCases,
      checkAllCases:false
    })
  }


  /**
   * 保存任务
   */
  saveJob = () =>{
    let {name, desc, email, browser, status, jobCases, testjobId, appName, appId,  delecases, addcases, bootTestJob} = this.state;
    let testJob = {//新增时的bootTestJob
      testjobId: testjobId,
      testjobState: status,
      browserType: browser,
      testjobName: name,
      testjobNote: desc,
      email: email,
      productId: appId,
      productName: appName,
      testjobType: "selenium"
    };

  //保存的bootJobCaseList，新增时没有为null,去掉checked属性
    let savejobCases=[];
    let obj = {};
    jobCases.forEach((item)=> {
      obj = {};
      obj.executeOrder = item.executeOrder;
      obj.testcaseId = item.testcaseId;
      obj.testcaseName = item.testcaseName;
      if(item.jobCaseId){
        obj.jobCaseId = item.jobCaseId ;
        obj.createTime = item.createTime;
        obj.dr = item.dr;
        obj.productId = item.productId;
        obj.productName = item.productName;
        obj.tenantId = item.tenantId;
        obj.tenentid = item.tenentid;
        obj.testcaseNote = item.testcaseNote;
        obj.testcaseState = item.testcaseState;
        obj.testcaseType = item.testcaseType;
        obj.ts = item.ts;
        obj.userId = item.userId;
        obj.userName = item.userName;
      }
      savejobCases.push(obj);
    })
    let propsData = this.props.location.state;
    let paramData = {};
    if(propsData){//编辑
        //编辑的bootTestJob
        bootTestJob.testjobState = status;
        bootTestJob.browserType = browser;
        bootTestJob.testjobName = name;
        bootTestJob.testjobNote = desc;
        bootTestJob.email = email;

      if (delecases.length !== 0) {//原有用例删除
        deleteJobCase(testjobId, delecases)
      }
      paramData = {
        bootTestJob: bootTestJob,
        bootJobCaseList: savejobCases
      };
    }else{
      paramData = {
        bootTestJob: testJob,
        bootJobCaseList: savejobCases
      };
    }
    saveJob(paramData).then((res) => {
        let data = res.data;
        if (data.flag === "success") {
          Message.create({
            content:propsData?'测试任务修改成功!':'创建测试任务成功！',
            color: 'success',
            duration: 4.5
          });
        } else {
          Message.create({
            content: data.msg,
            color: 'danger',
            duration: 4.5
          })
        }
        //保存后回到首页刷新列表
          let path = {
            pathname:'/',
            state:{},
          }
          hashHistory.push(path);
          })

  }

  /**
   * 取消保存
   */
  handleCancel = () =>{
    this.setState({
      name: '',
      desc: '',
      email: '',
      browser: 'chrome',
      status: 'Y',
      appName:'',
      showAddCaseModal:false,
      showAppModal:false,
      jobCases:[],
      checkAllCases:false,
      showDelBatchModal:false
    })
    this.executeOrder = 1;
  }


  render(){
    let { browser, name, email, desc, appName, jobCases, status} = this.state;
    let propsData = this.props.location.state;
    let title = '新增测试任务', editFlag=false;
    if(propsData){
      editFlag = propsData.editFlag;
      if(editFlag){
        title = "修改测试任务"
      }
    }
    let colums=[{
      title: (<Checkbox  checked={this.state.checkAllCases} onChange={this.checkAll}/>),
      dataIndex: 'checked',
      key: 'checked', render: (flag, record, index) => {
        return <Checkbox index={index} checked={flag} onChange={this.selectCase}/>
      }
    },{
      title:"用例名称",
      dataIndex:"testcaseName",
      key:"testcaseName",
    },{
      title:"执行顺序",
      dataIndex:"executeOrder",
      key:"executeOrder",
      render: (text, record, index) => (
        <FormControl
          value={text}
          onChange={this.onInputChange(index)}
          style={{width:'30%'}}
        />
      )
    },{
      title: '操作',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      render: (text, rec, index) => {
        return (
          <div className="control-icon">
            <Popconfirm placement="bottom" onClose={ this.handleDelete(rec) } content="确认要删除吗？">
              <i className="cl cl-del"/>
            </Popconfirm>
          </div>
        )}
    }]

    return(
      <div className="create-job">
      <Title name={ title } showBack={ true } className="create-test-job"/>
      <Col md={8} mdOffset={1} >
        <Form horizontal style={{margin: '50px auto'}}>
          <FormGroup>
            <Row>
              <Col md={3} className="text-right">
                <Label>
                  任务名称
                </Label>
              </Col>
              <Col md={9}>
                <FormControl
                  onChange={this.handleChange('name')}
                  value={name}
                />
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Row>
              <Col md={3} className="text-right">
                <Label>
                  应用名称
                </Label>
              </Col>
              <Col md={9}>
                <InputGroup simple  style={{width:'100%'}}>
                  <FormControl
                    value={appName}
                    type="text"
                  />
                  <InputGroup.Button shape="border" onClick={this.openSelectAppModal} style={ {cursor:"pointer" ,color: '#008BFA'}}>
                    <Icon type="listing-option uf-symlist"/>
                  </InputGroup.Button>
                </InputGroup>
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Row>
              <Col md={3} className="text-right">
                <Label>
                  任务状态
                </Label>
              </Col>
              <Col md={9}>
                <Radio.RadioGroup
                  color="primary"
                  size="sm"
                  selectedValue={status}
                  onChange={this.handleTypeChange("status")}>
                  <Radio value="Y" className="radio">
                    <div className="radio-state radio-y">激活</div>
                  </Radio>
                  {/*<Radio value="start" className="radio">*/}
                    {/*<div className="radio-state radio-start">执行中</div>*/}
                  {/*</Radio>*/}
                  <Radio value="N" className="radio">
                    <div className="radio-state radio-n">停用</div>
                  </Radio>
                  <Radio value="stop" className="radio">
                    <div className="radio-state radio-sotp">已停止</div>
                  </Radio>
                </Radio.RadioGroup>
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Row>
              <Col md={3} className="text-right">
                <Label>
                  浏览器类型
                </Label>
              </Col>
              <Col md={9}>
                <Select
                  defaultValue='chrome'
                  value={browser}
                  dropdownStyle={{zIndex: '9999'}}
                  onChange={this.handleTypeChange("browser")}>
                  <Option value="chrome">chrome</Option>
                  <Option value="firefox">firefox</Option>
                  <Option value="ie">ie</Option>
                </Select>
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Row>
              <Col md={3} className="text-right">
                <Label>
                  邮件接收人
                </Label>
              </Col>
              <Col md={9}>
                <FormControl
                  onChange={this.handleChange('email')}
                  value={email}
                />
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Row>
              <Col md={3} className="text-right">
                <Label>
                  描述信息
                </Label>
              </Col>
              <Col md={9}>
                      <textarea
                        rows="3"
                        className="job-desc"
                        onChange={this.handleChange('desc')}
                        value={desc}
                      />
              </Col>
            </Row>
            <Row>
              <Col md={3} className="text-right">
                <Label>
                </Label>
              </Col>
              <Col md={9}>
                <hr size="2" className="dash-line"/>
              </Col>
            </Row>
            <Row>
              <Col md={3} className="text-right">
                <Label>
                  关联测试用例
                </Label>
              </Col>
              <Col md={9} style={{marginBottom:'20'}}>
                <Button
                  shape="squared"
                  onClick={this.openAddCasesModal}
                  colors="primary">
                  关联测试用例
                </Button>
                <Button
                  className="control-button"
                  shape="squared"
                  colors="default"
                  onClick={this.deleBatch}>
                  批量删除
                </Button>
              </Col>
            </Row>
            <Row>
              <Col md={9} mdOffset={3}>
                <Table
                  bordered
                  data={jobCases}
                  columns={colums}
                  emptyText={this.emptyFunc}
                />
              </Col>
            </Row>
            <Row>
            <Col md={9} mdOffset={3}>
              {/*<Link to="/" style={{color: "#fff"}}>*/}
                <Button
                  className="button-save"
                  shape="squared"
                  onClick={this.saveJob}
                  colors="primary">
                  保存
                </Button>
              {/*</Link>*/}
              <Link to="/" style={{color: "#fff"}}>
                <Button
                  className="concale-button"
                  shape="squared"
                  colors="default"
                  onClick={this.handleCancel}>
                  取消
                </Button>
              </Link>
            </Col>
          </Row>
          </FormGroup>
        </Form>
      </Col>
        <AddCaseModal
          showAddCaseModal={this.state.showAddCaseModal}
          onSelect={this.addCases}
          close ={this.closeModal}
          app_id={this.state.appId}
        />

        <SelectAppModal
          showAppModal={this.state.showAppModal}
          onSelect={this.choiseApp}
          close ={this.closeModal}
        />

        <ErrorModal
          show ={this.state.showDelBatchModal}
          onEnsure={this.delonEnsure}
          onClose={this.closeModal}
          message={"确定要删除这些用例吗？"}
          title={"删除关联用例"}
          />

      </div>
    )
  }
}
