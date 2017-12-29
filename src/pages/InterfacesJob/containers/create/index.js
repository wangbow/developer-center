import { Component, PropTypes } from 'react';
import { Col, Row, Button, FormGroup, FormControl, Icon, Form, Label, Radio, Select, Message,
        Pagination, InputGroup, Table, Popconfirm} from 'tinper-bee';
import Title from 'components/Title';
import {viewRestJob, saveRestJob} from 'serves/testCenter';
import { Link ,hashHistory} from 'react-router';
import ErrorModal from 'components/ErrorModal';
import AddScriptModal  from '../../components/add-script';
import SelectAppModal  from '../../components/select-app';
import './index.less';
export default class Create extends Component{
  state={
    name: '',
    desc: '',
    email: '',
    status: 'Y',
    appName:'',
    appId: null,
    showScriptModal:false,
    showAppModal:false,
    restjobId:null,
    scriptId:'',
    scriptName:'',
    tenantId: null,
    createTime: null,
    executeTime:'',
    ts:null,
    userId:null,
    userName:null
  }
  componentDidMount() {
    let data = this.props.location.state;
    if(data){
      let {id} = data;
        this.viewDetail(id)
      }
  }
  /**
   * 获取任务信息
   */
  viewDetail = (id) =>{
    viewRestJob(id).then((res)=> {
      let restJob = res.data.data.restJob;
      this.setState({
        name: restJob.restjobName,
        desc: restJob.restjobNote,
        email: restJob.email,
        status: restJob.restjobState,
        restjobId: restJob.restjobId,
        appName: restJob.productName,
        appId: restJob.productId,
        scriptId: restJob.testscriptId,
        scriptName: restJob.testscriptName,
        tenantId: restJob.tenantId,
        createTime: restJob.createTime,
        executeTime: restJob.executeTime,
        ts: restJob.ts,
        userId:restJob.userId,
        userName:restJob.userName
      })
    })
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
   * 任务类型值改变
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
    }else if(str == 'script'){
      this.setState({
        showScriptModal:false
      })
    }else{
      this.setState({
        showDelBatchModal:false,
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
   * 打开选择脚本弹窗
   */
  openSelectScriptModal = ()=>{
    if(this.state.appName === ''){
      return Message.create({
        content: '请先选择应用！',
        color: 'warning',
        duration: 1.5
      })
    }
    this.setState({
      showScriptModal:true
    })
  }

  /**
   * 选择脚本
   */
  choiseScript = (rec)=>{
    this.setState({
      scriptId: rec.testscriptId,
      scriptName: rec.testscriptName
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
   * 保存任务
   */
  saveJob = () =>{
    let propsData = this.props.location.state;
    let {name, desc, email, status, restjobId, appName, appId, scriptId, scriptName,
      tenantId, createTime, executeTime, ts, userId, userName} = this.state;
    let restjob ={
      email: email,
      productId: appId,
      productName: appName,
      restjobId: restjobId,
      restjobName: name,
      restjobNote: desc,
      restjobState: status,
      testscriptId: scriptId,
      testscriptName: scriptName,
      createTime: createTime,
      executeTime: executeTime,
      ts: ts,
      userName: userName,
      userId: userId,
      tenantId:tenantId,
    }
    saveRestJob(restjob).then((res) => {
        let data = res.data;
        if (data.flag === "success") {
          Message.create({
            content:propsData?'接口任务修改成功!':'创建接口任务成功！',
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
    let { name, email, desc, appName, status, scriptName} = this.state;
    let propsData = this.props.location.state;
    let title = '新增接口任务', editFlag=false;
    if(propsData){
      editFlag = propsData.editFlag;
      if(editFlag){
        title = "修改接口任务"
      }
    }
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
                  脚本名称
                </Label>
              </Col>
              <Col md={9}>
                <InputGroup simple  style={{width:'100%'}}>
                  <FormControl
                    value={scriptName}
                    type="text"
                  />
                  <InputGroup.Button shape="border" onClick={this.openSelectScriptModal} style={ {cursor:"pointer" ,color: '#008BFA'}}>
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
        <SelectAppModal
          showAppModal={this.state.showAppModal}
          onSelect={this.choiseApp}
          close ={this.closeModal}
        />

        <AddScriptModal
          showScriptModal={this.state.showScriptModal}
          onSelect={this.choiseScript}
          close ={this.closeModal}
          app_id={this.state.appId}
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
