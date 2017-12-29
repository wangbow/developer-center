import { Component, PropTypes } from 'react';
import { Col, Row, Button, FormGroup, FormControl, Icon, Form, Label, Radio, Select, Message,
        Pagination, InputGroup, Table, Popconfirm, Upload } from 'tinper-bee';
import Title from 'components/Title';
import { Link ,hashHistory} from 'react-router';
import SelectAppModal  from '../../components/select-app';
import {findDOMNode} from 'react-dom';
import {saveScript, updateScript} from 'serves/testCenter';
import './index.less';
const Option = Select.Option;

export default class Create extends Component{
  state={
    appName:'',
    appId:'',
    showAppModal:false,
    scriptInfo:{},
    type:'',
    desc:null,
    status:'Y',
    userId:null,
    userName:null,
    tenantId:null,
    scriptName:'',
    createTime:'',
    testscriptId: null,
    testscriptPath: null,
    ts:'',
    dr:'',
    fileList:[],
  }
  componentDidMount() {
    let data = this.props.location.state;
    if(data){
      let {rec} = data;
      let file = new File([],'',{type:"",uid:'',lastModified: ''});
      this.setState({
        scriptInfo: rec,
        appName: rec.productName,
        appId: rec.productId,
        type: rec.testscriptType,
        desc: rec.testscriptNote,
        status: rec.testscriptState,
        testscriptId: rec.testscriptId,
        userId:rec.userId,
        userName: rec.userName,
        tenantId: rec.tenantId,
        scriptName:rec.testscriptName,
        testscriptPath: rec.testscriptPath,
        fileList:[file],
        ts: rec.ts,
        dr: rec.dr,
      })
    }
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
   * 类型值改变
   */
  handleTypeChange = (state) =>(value)=>{

    if(state === "type"){
      let dom =  findDOMNode(this.refs.comment);
      if(value === "selenium"){
        dom.innerHTML= "*仅可上传格式为.xlsx等的excel文件";
      }else{
        dom.innerHTML= "*仅可上传格式为.json的文件";
      }
    }
    this.setState({
      [state]: value,
    })
  }

  /**
   * 关闭弹窗
   */
  closeModal =() =>{
      this.setState({
        showAppModal: false
      })
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
   * 保存脚本
   */
  saveScript =() =>{
    let {appName, appId, userName, userId, desc, type, status , tenantId, scriptName,
        testscriptId, fileList, testscriptPath, ts, dr} = this.state;

    let propsData = this.props.location.state;
    let formData = new FormData();
    formData.append('productId',appId);
    formData.append('productName',appName);
    formData.append('productVersion', '');
    formData.append('tenantId',tenantId);
    formData.append('userName',userName);
    formData.append('userId',userId);
    formData.append('testscriptId',testscriptId);
    formData.append('testscriptName',scriptName);
    formData.append('testscriptType',type);
    formData.append('testscriptState',status);
    formData.append('testscriptNote',desc);
    formData.append('testscriptPath',testscriptPath);

    if(propsData){//编辑
      console.log(fileList)
      formData.append('file',fileList[0]);
      updateScript(formData).then((res)=>{
        if(res.data.flag === 'fail'){
          return Message.create({
            content:res.data.msg,
            color:'danger',
            duration:'1.5'
          })
        }else{
          Message.create({
            content:res.data.msg,
            color:'success',
            duration:'1.5'
          })
        }
        //保存后回到首页刷新列表
        let path = {
          pathname:'/',
          state:{},
        }
        hashHistory.push(path);
      })
    }else{//新增
      formData.append('file',fileList[0]);
      saveScript(formData).then((res)=>{
        if(res.data.flag == "fail"){
          return Message.create({
            content:res.data.msg,
            color:'danger',
            duration:'1.5'
          })
        }else{
          Message.create({
            content:res.data.msg,
            color:'success',
            duration:'1.5'
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

  }
  /**
   * 取消保存
   */
  handleCancel = () =>{
    this.setState({

    })
  }
  /**
   * 下载脚本样例
   */
  downloadSample =() =>{
    window.location.href="/cloudtest/boot_testscript/downloadDemo"
  }


  /**
   * 校验文件类型并阻止浏览器自动上传
   */
  beforeUploadFile = (file) => {
    if(!this.state.type){
      return Message.create({
        content:'请先选择脚本类型！',
        color:'warning',
        duration:'1.5'
      })
    }
    let typeArry = ['xls','xlsx','xlsm'];
    let name = file.name;
    let type = name.substr(name.lastIndexOf(".")+1).toLowerCase();//获取后缀名
    let flag = true;
    if(this.state.type === "selenium"){
      if(typeArry.indexOf(type) === -1){
        flag = false;
        return Message.create({
          content:'仅可上传格式为.xlsx等的excel文件！',
          color:'danger',
          duration:1.5
        })
      }
    }else{
      if(type !== 'json'){
        flag = false;
        return Message.create({
          content:'仅可上传格式为.json的文件！',
          color:'danger',
          duration:1.5
        })
      }
    }
    if(flag){
      this.setState({
        scriptName:file.name,
        fileList: [file],
      });
    }else{
      this.setState({
        fileList: [],
      })
    }
    return false;
  }

  /**
   * 删除已上传文件
   */
  remove = ()=>{
    this.setState({
      fileList:[],
      scriptName:''
    })
  }


  /**
   * 上传成功后的返回值
   */
  handleChanged =(info)=>{
    //console.log(info)
    //文件大小及类型的校验也可以放在这里
  }

  render(){
    let { type, appName, desc, status, fileList, scriptName} = this.state;
    let propsData = this.props.location.state;
    let title = '新增脚本', editFlag=false ,uploadLable ="上传脚本";
    if(propsData){
      editFlag = propsData.editFlag;
      if(editFlag){
        title = "修改脚本信息";
        uploadLable = "重新上传"
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
                  脚本类型
                </Label>
              </Col>
              <Col md={9}>
                <Select
                  defaultValue='selenium'
                  value={type}
                  dropdownStyle={{zIndex: '9999'}}
                  onChange={this.handleTypeChange("type")}>
                  <Option value="selenium">webUI测试</Option>
                  <Option value="postman">接口测试</Option>
                </Select>
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Row>
              <Col md={3} className="text-right">
                <Label>
                  上传脚本
                </Label>
              </Col>
              <Col md={9}>
                <div>
                  <Upload
                    name="file"
                    listType="text"
                    multiple={false}
                    showUploadList={false}
                    style={{display:'inline-block'}}
                    fileList={fileList}
                    onRemove={this.remove}
                    beforeUpload={ this.beforeUploadFile }
                    onChange={this.handleChanged}
                  >
                    <Button
                      colors="primary"
                      shape="squared"
                      disabled ={!this.state.type}>
                      <i className="uf1 uf-upload"/> {uploadLable}
                    </Button>
                  </Upload>
                  {(type === 'selenium') ? <span className="button-download"  onClick={this.downloadSample} > 下载脚本样例</span> :''}
                </div>
                <p ref="comment">   </p>
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
                    placeholder="暂无脚本文件"
                    type="text"
                    style={{background:' #F7F7F7', borderRadius:'3',color: '#008BFA'}}
                  />
                  <InputGroup.Button shape="border" onClick={this.remove} style={ {cursor:"pointer" ,color: '#008BFA'}}>
                    {scriptName ? <i className="cl cl-del"/> :'' }
                  </InputGroup.Button>
                </InputGroup>
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Row>
              <Col md={3} className="text-right">
                <Label>
                  脚本状态
                </Label>
              </Col>
              <Col md={9}>
                <Radio.RadioGroup
                  color="primary"
                  size="sm"
                  selectedValue={status}
                  onChange={this.handleTypeChange('status')}>
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
                  应用名称
                </Label>
              </Col>
              <Col md={9}>
                <InputGroup simple   style={{width:'100%'}}>
                  <FormControl
                    value={appName}
                    type="text"
                  />
                  <InputGroup.Button shape="border" onClick={this.openSelectAppModal} style={ {cursor:"pointer",color: '#008BFA' }}>
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
                  脚本描述
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
          </FormGroup>
          <Row>
            <Col md={9} mdOffset={3}>
              <Button
                className="button-save"
                shape="squared"
                onClick={this.saveScript}
                colors="primary">
                保存
              </Button>
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
        </Form>
      </Col>

        <SelectAppModal
          showAppModal={this.state.showAppModal}
          onSelect={this.choiseApp}
          close ={this.closeModal}
        />
      </div>
    )
  }
}
