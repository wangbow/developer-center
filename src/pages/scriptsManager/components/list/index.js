import {Component} from 'react';
import {Col, Table, Pagination, Message, Icon, Popconfirm, Tooltip} from 'tinper-bee';
import { success, err } from 'components/message-util';
import DetailTest from '../test-detail';
import {downLoadScript ,deleteScript, generateCase} from 'serves/testCenter';
import './index.less';
import Checkbox from 'rc-checkbox';
import 'rc-checkbox/assets/index.css';
import { Link, hashHistory } from 'react-router';
import OverlayTrigger from 'bee-overlay/build/OverlayTrigger';

export default class List extends Component {
  static propTypes = {};
  static defaultProps = {};

  state = {
    activePage:1,
    showDetailModal:false,
    selectedData:{},
    editFlag: false,
  }

  /**
   * 鼠标悬浮提示
   * @param key
   */
  toolTipData = (data) => {
    return <Tooltip inverse id="toolTipId">
      <span className="tooltip-font-style">{data}</span>
    </Tooltip>
  }
  /**
   * 状态解释
   * @param key
   */
  stateExplan = (state) => {
    if(state === 'Y')return "激活";
    if(state === 'start') return "执行中";
    if(state === 'stop')return "已停止";
    if(state === 'N') return "停用";
  }
  /**
   * 时间格式化
   * @param key
   */
  fmtDate = (obj) => {
    if( typeof(obj) == "undefined" ){
      return ''
    }
    let date =  new Date(obj);
    let y = 1900+date.getYear();
    let m = "0"+(date.getMonth()+1);
    let d = "0"+date.getDate();
    let h = "0"+ date.getHours();
    let mm = "0" + date.getMinutes();
    let s = "0" + date.getSeconds();
    return y+"-"+m.substring(m.length-2,m.length)+"-"+d.substring(d.length-2,d.length)+" "+
      h.substring(h.length-2,h.length)+":"+mm.substring(mm.length-2,mm.length)+":"+s.substring(s.length-2,s.length);
  }


  /**
   * 删除脚本
   *
   */
  handleDelete = obj => () => {
    let paramData={
      "testscriptId": obj.testscriptId,
      "testscriptName": obj.testscriptName,
      "userId": obj.userId,
    }
    let arry = [];
    arry.push(paramData);
    deleteScript(arry).then((res)=>{
        let data = res.data;
        if (data.flag==="fail") {
          return Message.create({
            content: data.msg,
            color: 'danger',
            duration: 1.5
          })
        }
        Message.create({
          content: data.msg,
          color: 'success',
          duration: 1.5
        })
        this.props.getTestScript();
      })
  }


  /**
   * 查看用例
   *
   */
  handleView =(value,rec) =>() =>{
    this.setState({
      showDetailModal:value,
      selectedData:rec
    })
  }

  /**
   * 编辑
   */
  handleEdit = obj => () => {
    let data = {
      rec: obj,
      editFlag: true
    };
    let path = {
      pathname:'/create',
      state:data,
    }
    hashHistory.push(path)
  }


  /**
   * 分页换页
   *
   */
  handleSelectPage = (eventKey) => {
    this.setState({
      activePage: eventKey
    });
    this.props.getTestScript(`?pageIndex=${eventKey - 1}`)
  }


  /**
   * 关闭弹窗
   *
   */
  closeModal = () => {
    this.setState({
      showDetailModal:false
    })
  }

  /**
   * 下载脚本
   *
   */
  handleDownLoad =  (rec) =>() =>{
    //downLoadScript(rec.testscriptId).then((res)=>{
      window.location.href="/cloudtest/boot_testscript/download?testscriptId=" + rec.testscriptId;
   // })
  }


  /**
   * 生成用例
   *
   */

  generatecase = obj => () =>{
    if(obj.testscriptType === 'postman'){
      return Message.create({
        content: "接口测试不能生成用例！！！",
        color: 'danger',
        duration: 1.5
      })
    }
    let formData ={
      createTime:obj.createTime,
      dr: obj.dr,
      productId: obj.productId,
      productName: obj.productName,
      tenantId: obj.tenantId,
      testscriptId: obj.testscriptId,
      testscriptName: obj.testscriptName,
      testscriptNote: obj.testscriptNote,
      testscriptPath: obj.testscriptPath,
      testscriptState:obj.testscriptState,
      testscriptType: obj.testscriptType,
      ts: obj.ts,
      userId: obj.userId,
      userName: obj.userName,
    }
    generateCase(formData).then((res)=>{
      if(res.data.flag ==="fail"){
        Message.create({
          content: res.data.msg,
          color: 'danger',
          duration: 1.5
        })
      }else{
        Message.create({
          content: "生成用例成功！！",
          color: 'success',
          duration: 1.5
        })
      }
    })
  }

  showColumns = () =>{
    const  columns = [{
      title: (<Checkbox  checked={this.props.checkedAllJob} onChange={this.props.checkAll}/>),
      dataIndex: 'checked',
      key: 'checked', render: (flag, record, index) => {
        return <Checkbox index={index} checked={flag} onChange={this.props.choiseJob}/>
      }
    },{title: '脚本名称', dataIndex: 'testscriptName', key: 'testscriptName',render:(text,rec)=>{
      return(
        <OverlayTrigger overlay={this.toolTipData(text)} placement="bottom">
          <div className="font-style">{text}</div>
        </OverlayTrigger>
        )
    }},
      {title: '脚本状态', dataIndex: 'testscriptState', key: 'testscriptState', render:(text,rec) =>{
        let background = '#fff';
        if(text === 'Y'){
          background = '#4CAF50'
        }else{
          background = '#FB8C00'
        }
        return(
          <div className="scripts-state" style={{background:background}}> {this.stateExplan(text)}</div>
        )
      }},
      {title: '脚本类型', dataIndex: 'testscriptType', key: 'testscriptType',render:(text,rec)=>{
        if(rec.testscriptType ==="selenium"){
          return "webUI测试"
        }else{
          return "接口测试"
        }
      }},
      {title: '应用名称', dataIndex: 'productName', key: 'productName',render:(text,rec)=>{

        return (
          <OverlayTrigger overlay={this.toolTipData(text)} placement="bottom">
            <div className="font-style">{text}</div>
          </OverlayTrigger>
        )
      }},
      {title: '上传人', dataIndex: 'userName', key: 'userName',render:(text,rec)=> {

        return (
          <OverlayTrigger overlay={this.toolTipData(text)} placement="bottom">
            <div className="font-style">{text}</div>
          </OverlayTrigger>
        )
      }},
      {title: '上传时间', dataIndex: 'createTime', key: 'createTime',render:(text, rec) =>{
        return (
          this.fmtDate(text)
        )
      }},
      {
        title: '操作', dataIndex: 'name', key: 'name', className:'th-opr',render: (text, rec) => {

        return (
          <div className="control-icon">
            <span onClick={this.handleEdit(rec)}>修改</span>
            <span onClick={this.handleView(true, rec)}>查看</span>
            <span onClick={this.handleDownLoad(rec)}>下载</span>
            <span onClick={this.generatecase(rec)}>生成用例</span>
            <Popconfirm placement="bottom" onClose={ this.handleDelete(rec) } content="确认要删除吗？">
              <span>删除</span>
            </Popconfirm>
          </div>
        )
      }
      }];
    return columns
  }

  render() {

    let { activePage} = this.state;
    let {searchData, pages} = this.props;

    return (
        <Col md={12} className="script-list">
          <Table data={ searchData } columns={ this.showColumns() } rowKey={(rec, index) => { return rec.testscriptId }}/>
          {
            pages > 1 ? (
              <Pagination
                className="info-pagination"
                first
                last
                prev
                next
                boundaryLinks
                items={pages}
                maxButtons={5}
                activePage={activePage}
                onSelect={this.handleSelectPage}/>
            ) : null
          }
          <DetailTest
            showDetailModal={this.state.showDetailModal}
            closeViewDetailModal={this.closeModal}
            fmtDate={this.fmtDate}
            data = {this.state.selectedData}
          />
        </Col>
    )
  }
}
