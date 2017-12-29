import {Component} from 'react';
import {Col, Table, Pagination, Message, Icon, Popconfirm, Tooltip} from 'tinper-bee';
import { success, err } from 'components/message-util';
import LogTest from '../test-log';
import DetailTest from '../test-detail';
import {deleteRestJob, excuteRestJobBefore, excuteRestJob} from 'serves/testCenter';
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
    selectedId:'',
    editFlag: false,
    showLogModal:false
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
    if (!obj && typeof(obj)!="undefined" && obj!=0){//null是返回空
      return ''
    }
    if( typeof(obj) == "undefined" ){//undefined返回空
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
   * 删除任务
   *
   */
  handleDelete = obj => () => {
    if(obj.restjobState === "start"){
      return Message.create({
        content: "当前任务正在执行，不能删除！",
        color: 'danger',
        duration: 1.5
      })
    }
    let paramData={
      "restjobId": obj.restjobId,
      "restjobName": obj.restjobName,
      "userId": obj.userId,
    }
    let arry = [];
    arry.push(paramData);
    deleteRestJob(arry).then((res) => {
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
        this.props.getJobList();
      })
  }


  /**
   * 查看任务
   *
   */
  handleView =(value, id) =>() =>{
    this.setState({
      showDetailModal:value,
      selectedId:id
    })
  }

  /**
   * 编辑，先判断是否有权限编辑
   */
  handleEdit = obj => () => {
    if(obj.restjobState === "start"){
      return Message.create({
        content: "当前任务正在执行，不能修改！",
        color: 'danger',
        duration: 1.5
      })
    }
    let data = {
      id: obj.restjobId,
      editFlag: true
    };
    let path = {
      pathname:'/create',
      state:data,
    }
    hashHistory.push(path)
  }


  /**
   * 查看报告
   */
  viewReport = (obj) => () =>{
    if(obj.restjobState === "start"){
      return Message.create({
        content: "当前任务正在执行，尚未生成执行报告！",
        color: 'danger',
        duration: 1.5
      })
    }
    let data = {
      restjobId: obj.restjobId
    }
    let path = {
      pathname: '/reports',
      state: data,
    }
    hashHistory.push(path)
  }


  /**
   * 查看日志
   */
  viewLog = (obj) => () => {
    if(obj.restjobState === "start"){
      return Message.create({
        content: "当前任务正在执行，尚未生成执行日志！",
        color: 'danger',
        duration: 1.5
      })
    }
    this.setState({
      showLogModal: true,
      selectedId: obj.restjobId
    })
  }

  /**
   * 执行任务
   */
  execute = obj => () => {
    if(obj.restjobState === "start"){
      return Message.create({
        content: "当前任务正在执行，不能重复执行！",
        color: 'danger',
        duration: 1.5
      })
    }
    if(obj.restjobState === "N"){
      return Message.create({
        content: "当前任务已停用，不能执行！",
        color: 'danger',
        duration: 1.5
      })
    }
    excuteRestJobBefore(obj.restjobId).then(
      ()=>{ this.props.getJobList();}//刷新列表数据
    );//改变当前数据的执行状态
    excuteRestJob(obj.restjobId).then((res) => {//执行脚本
      this.props.getJobList();//执行脚本返回数据后刷新状态
      let data = res.data;
      if (data.flag === "fail") {
        return Message.create({
          content: data.msg,
          color: 'danger',
          duration: 1.5
        })
      } else {
        return Message.create({
          content: data.msg,
          color: 'success',
          duration: 1.5
        })
      }
     })
  }


  /**
   * 分页换页
   *
   */
  handleSelectPage = (eventKey) => {
    this.setState({
      activePage: eventKey
    });
    this.props.getJobList(`?pageIndex=${eventKey-1}`)
  }


  /**
   * 关闭弹窗
   *
   */
  closeModal = () => {
    this.setState({
      showLogModal:false,
      showDetailModal:false
    })
  }


  render() {
    let { activePage} = this.state;
    let {searchData, pages} = this.props;
    let columns = [{
      title: (<Checkbox  checked={this.props.checkedAllJob} onChange={this.props.checkAll}/>),
      dataIndex: 'checked',
      key: 'checked', render: (flag, record, index) => {
        return <Checkbox index={index} checked={flag} onChange={this.props.choiseJob}/>
      }
    },{title: '任务名称', dataIndex: 'restjobName', key: 'restjobName',render:(text,rec)=>{
      return(
        <OverlayTrigger overlay={this.toolTipData(text)} placement="bottom">
          <div className="font-style">{text}</div>
        </OverlayTrigger>
      )}},
      {title: '任务状态', dataIndex: 'restjobState', key: 'restjobState', render:(text,rec) =>{
        let background = '#fff';
        if(text === 'Y'){
          background = '#4CAF50'
        }else if(text === 'start'){
          background = '#29B6F6'
        }else if(text === 'stop'){
          background = '#DD3730'
        }else{
          background = '#FB8C00'
        }
        return(
          <div className="rest-job-state" style={{background:background}}> {this.stateExplan(text)}</div>
        )
      }},
      {title: '应用名称', dataIndex: 'productName', key: 'productName',render:(text,rec)=>{
        return(
          <OverlayTrigger overlay={this.toolTipData(text)} placement="bottom">
            <div className="font-style">{text}</div>
          </OverlayTrigger>
        )}},
      {title: '测试人', dataIndex: 'userName', key: 'userName',render:(text,rec)=>{
        return(
          <OverlayTrigger overlay={this.toolTipData(text)} placement="bottom">
            <div className="font-style">{text}</div>
          </OverlayTrigger>
        )}},
      {title: '执行时间', dataIndex: 'executeTime', key: 'executeTime', render:(text,rec) =>{
        return (
          this.fmtDate(text)
        )
      }},
      {
        title: '操作', dataIndex: 'name', key: 'name', className:'th-opr', render: (text, rec) => {

        return (
          <div className="control-icon">
            <span onClick={this.handleEdit(rec)}>修改</span>
            <span onClick={this.handleView(true, rec.restjobId)}>查看</span>
            <span onClick={this.execute( rec)}>执行</span>
            <span onClick={this.viewLog(rec)}>日志</span>
            <span onClick={this.viewReport(rec)}>报告</span>
            <Popconfirm placement="bottom" onClose={ this.handleDelete(rec) } content="确认要删除吗？">
              <span>删除</span>
            </Popconfirm>
          </div>
        )
      }
      }];
    return (
        <Col md={12} className="rests-list">
          <Table data={ searchData } columns={ columns }/>
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

          <LogTest
            showLogModal={ this.state.showLogModal }
            dataId={ this.state.selectedId }
            closeViewLogModal={this.closeModal}
            fmtDate={this.fmtDate}
          />

          <DetailTest
            showDetailModal={this.state.showDetailModal}
            dataId={this.state.selectedId}
            closeViewDetailModal={this.closeModal}
            fmtDate={this.fmtDate}
          />
        </Col>
    )
  }
}
