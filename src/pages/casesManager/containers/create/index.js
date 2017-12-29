import { Component, PropTypes } from 'react';
import { Col, Row, Button, FormGroup, FormControl, Icon, Form, Label, Radio, Select, Message,
        Pagination, InputGroup, Table, Popconfirm} from 'tinper-bee';
import Title from 'components/Title';
import Checkbox from 'rc-checkbox';
import 'rc-checkbox/assets/index.css';
import { Link ,hashHistory} from 'react-router';
import ErrorModal from 'components/ErrorModal';
import AddScriptModal  from '../../components/add-scripts';
import SelectAppModal  from '../../components/select-app';
import {saveCase, viewTestCases, deleteCaseScript} from 'serves/testCenter';
import './index.less';
const Option = Select.Option;

export default class Create extends Component{
  state={
    name: '',
    desc: '',
    status: 'Y',
    appName:'',
    appId:'',
    showAddCaseModal:false,
    showAppModal:false,
    caseScripts:[],
    checkAllCases:false,
    showDelBatchModal:false,
    testcaseId:null,
    bootTestCase:{},
    delecases:[],
  }
   executeOrder = 1;

  componentDidMount() {
    let data = this.props.location.state;
    if(data){
      let {id} = data;
        this.viewDetail(id).then((caseData) => {
          let bootTestCase = caseData.testcase;
          let casescripts = caseData.bootCaseScriptList;
          let maxExcuteOrder = 1;
          casescripts.forEach((item)=>{
              item.checked = false;
              if(item.executeOrder > maxExcuteOrder){maxExcuteOrder = item.executeOrder}
            })
          this.executeOrder = maxExcuteOrder + 1;
          this.setState({
            name: bootTestCase.testcaseName,
            desc: bootTestCase.testcaseNote,
            status: bootTestCase.testcaseState,
            testcaseId: bootTestCase.testcaseId,
            appName: bootTestCase.productName,
            appId: bootTestCase.productId,
            bootTestCase: bootTestCase,
            caseScripts: casescripts
          })
        })
      }
  }
  /**
   * 获取用例信息
   */
    viewDetail = (id) =>{
     return viewTestCases(id).then((res) =>{
        let data = res.data;
        return data.data;
      })
    }


  /**
   * table数据为空时提示
   */
  emptyFunc = () => {
    return <span>还没有关联脚本哦，请点击表格上方的按钮增加脚本吧～</span>
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
  handleTypeChange = (value) =>{
    this.setState({
      status: value,
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
    }else if(str == 'scripts'){
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
   * 打开添加接脚本的弹窗
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
   * 添加脚本到列表
   */
  addScripts = (list) => {
    if(list instanceof Array) {
      list.forEach((item) => {
        item.executeOrder = this.executeOrder;
        item.checked = false;
        this.executeOrder += 1;
        this.state.caseScripts.push(item);
      })
      this.setState({
        caseScripts:this.state.caseScripts
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
      this.state.caseScripts.forEach(function (item) {//影响每一行选择状态
        item.checked = true;
      })
    } else {//全部反选
      this.state.caseScripts.forEach(function (item) {
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
    let {caseScripts } = this.state;
    caseScripts[index].checked = !caseScripts[index].checked;//反选记录
    this.setState({caseScripts: caseScripts});
    if (e.target.checked) {//当前操作是选中
      caseScripts.forEach((item, i)=> {//判断除了当前行是否都选中
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
    let { caseScripts } = this.state;
    let flag = false;
    caseScripts.forEach((item)=>{
      if(item.executeOrder === e.target.value){
        return flag = true
        }
    })
    if(flag){
      return Message.create({content: "用例的执行顺序不能相同！", color: 'warning', duration: 1.5})
    }
    caseScripts[index].executeOrder= e.target.value;
    this.setState({ caseScripts });
  };

  /**
   * 删除单个脚本
   */
  handleDelete =(obj) =>() =>{
    let {caseScripts, delecases} = this.state;
    let temp = [];
    if(typeof(obj.casescriptId) === "undefined"){
      temp = caseScripts.filter((item) => {
        if(item.testscriptId !== obj.testscriptId || item.executeOrder !== obj.executeOrder) return item;
      })
    }else{
      delecases.push(obj);
      temp = caseScripts.filter((item) => {
        if(item.casescriptId !== obj.casescriptId) return item;
      })
    }
    this.setState({
      caseScripts:temp
    })
  }

  /**
   * 批量删除脚本确认提示
   */
  deleBatch  = () =>{
    this.setState({
      showDelBatchModal:true
    })
  }

  /**
   * 批量删除脚本
   */
  delonEnsure =() =>{
    let str = "del";
    this.closeModal(str);
    let {caseScripts, delecases } = this.state;

    let checkFlag = false;//没有选中用例提示
    caseScripts.forEach((item)=>{
      if(item.checked){return checkFlag = true}
    })
    if(!checkFlag){
      return Message.create({
        content: '请选择要删除的脚本！',
        color: 'warning',
        duration: 4.5
      })
    }

    caseScripts.forEach((item)=>{
      if(item.checked) {
        caseScripts = caseScripts.filter((rec) => {
          if (item.executeOrder !== rec.executeOrder) {
            return rec;
          }
        })
        if(typeof(item.casescriptId) !== "undefined") {
          delecases.push(item);
        }
      }
    })

      this.setState({
        checkAllCases:false,
        caseScripts:caseScripts
      })
  }


  /**
   * 保存用例
   */
  saveCase = () =>{
    let {name, desc, status, caseScripts, testcaseId, appName, appId,  delecases, bootTestCase} = this.state;
    let testCase = {//新增时的bootTestCase
      testcaseId: testcaseId,
      testcaseState: status,
      testcaseName: name,
      testcaseNote: desc,
      testcaseType: null,
      productId: appId,
      productName: appName,
      userId: null,
      userName:null,
      tenantId: null,
      createTime:''
    };

  //保存的bootJobCaseList，新增时没有为null,去掉checked属性
    let saveCaseScripts=[];
    let obj = {};
    caseScripts.forEach((item)=> {
      if(!item.casescriptId){
      obj = {};
      obj.executeOrder = item.executeOrder;
      obj.testscriptId = item.testscriptId;
      obj.testscriptName = item.testscriptName;
      obj.testcaseId = null;
      obj.testcaseName = null;
      obj.userId = null;
      obj.tenantId = null;
      obj.casescriptId = null;
      obj.createTime = '';
        // obj.casescriptId = item.casescriptId ;
        // obj.testcaseId = item.testcaseId;
        // obj.testcaseName = item.testcaseName;
        // obj.createTime = item.createTime;
        // obj.userId = item.userId;
        // obj.dr = item.dr;
        // obj.ts = item.ts;
        saveCaseScripts.push(obj);
      }
    })
    let propsData = this.props.location.state;
    let paramData = {};
    if(propsData){//编辑
        //编辑的bootTestCase
      bootTestCase.testcaseName = name;
      bootTestCase.testcaseNote = desc;
      bootTestCase.testcaseState = status;
      if (delecases.length !== 0) {//原有用例删除
        deleteCaseScript(testcaseId, delecases)
      }
      paramData = {
        bootTestCase: bootTestCase,
        bootCaseScriptList: saveCaseScripts
      };
    }else{
      paramData = {
        bootTestCase: testCase,
        bootCaseScriptList: saveCaseScripts
      };
    }
    saveCase(paramData).then((res) => {
        let data = res.data;
        if (data.flag === "success") {
          Message.create({
            content:propsData?'用例修改成功!':'创建用例成功！',
            color: 'success',
            duration: 1.5
          });
        } else {
          Message.create({
            content: data.msg,
            color: 'danger',
            duration: 1.5
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
      status: 'Y',
      appName:'',
      showAddCaseModal:false,
      showAppModal:false,
      caseScripts:[],
      checkAllCases:false,
      showDelBatchModal:false
    })
    this.executeOrder = 1;
  }


  render(){
    let { name,  desc, appName, caseScripts, status} = this.state;
    let propsData = this.props.location.state;
    let title = '新增用例', editFlag=false;
    if(propsData){
      editFlag = propsData.editFlag;
      if(editFlag){
        title = "修改用例"
      }
    }
    let colums=[{
      title: (<Checkbox  checked={this.state.checkAllCases} onChange={this.checkAll}/>),
      dataIndex: 'checked',
      key: 'checked', render: (flag, record, index) => {
        return <Checkbox index={index} checked={flag} onChange={this.selectCase}/>
      }
    },{
      title:"脚本名称",
      dataIndex:"testscriptName",
      key:"testscriptName",
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
                  用例名称
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
                  用例状态
                </Label>
              </Col>
              <Col md={8}>
                <Radio.RadioGroup
                  selectedValue={status}
                  onChange={this.handleTypeChange}>
                  <Radio value="Y" className="radio">
                    <div className="radio-state radio-y">激活</div>
                  </Radio>
                  <Radio value="N">
                    <div className="radio-state radio-n">停用</div>
                  </Radio>
                </Radio.RadioGroup>
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
                  关联脚本
                </Label>
              </Col>
              <Col md={9} style={{marginBottom:'20'}}>
                <Button
                  shape="squared"
                  onClick={this.openAddCasesModal}
                  colors="primary">
                  关联脚本
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
                  data={caseScripts}
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
                  onClick={this.saveCase}
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
        <AddScriptModal
          showAddCaseModal={this.state.showAddCaseModal}
          onSelect={this.addScripts}
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
          message={"确定要删除这些脚本吗？"}
          title={"删除关联脚本"}
          />

      </div>
    )
  }
}
