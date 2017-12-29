import React, {Component, PropTypes} from 'react';
import {DownloadScript, getJobList, saveJob, deleteTestJob, executeJob,
  downloadDemo, downloadBefore, executeJobBefore } from 'serves/appTile';
import {handleDownload} from 'lib/utils';
import {Button, Table, Pagination,Message,Popconfirm,Col} from 'tinper-bee';
//import Loading from 'bee-loading';
import {err, success, warn} from 'components/message-util';
import Search from 'components/search';
import CreateTest from './create-test';
import LogTest from './test-log';
import ReportTest from './test-report';
import DetailTest from './test-detail';
import LoadingTable from 'components/loading-table';
import Loading from 'components/loading';

import './index.less';

class AutoTest extends Component {

  state = {
    taskList: [],
    pages: 0,
    activePage: 1,
    showCreateModal: false,
    searchValue: '',
    showLoading: true,
    showReportModal: false,
    showLogModal:false,
    selectedId:'',
    editFlag:false,
    excuting:[],
    showDetailModal:false
    //新增页面值
  }

  columScript = [
    {title: '任务名称', dataIndex: 'testjobName', key: 'testjobName'},
    {title: '任务状态', dataIndex: 'testjobState', key: 'testjobState',render:(text,rec) =>{
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
        <div className="autotest-jobstate" style={{background:background}}> {this.stateExplan(text)}</div>
      )
    }},
    {title: '测试人', dataIndex: 'userName', key: 'userName'},
    {title: '设备IP', dataIndex: 'deviceIp', key: 'deviceIp'},
    {title: '执行时间', dataIndex: 'executeTime', key: 'executeTime', render:(text,rec) =>{
      return (
        this.fmtDate(text)
      )
    }},
    {
      title: '操作', dataIndex: 'name', key: 'name', width: '30%', render: (text, rec) => {
      return (
        <div className="control-icon">
          <span onClick={this.handleEdit(rec)}>修改</span>
          <span onClick={this.handleView(true, rec.testjobId)}>查看</span>
          <span onClick={this.execute( rec)}>执行</span>
          <span onClick={this.viewLog(rec)}>日志</span>
          <span onClick={this.viewReport(rec)}>报告</span>
          <Popconfirm placement="bottom" onClose={ this.handleDelete(rec) } content="确认要删除吗？">
            <span>删除</span>
          </Popconfirm>
        </div>
      )
    }
    }
  ];

  componentDidMount() {
    let appId = this.props.appId;
    this.getJobList(`?search_productId=${appId}`);
  }

  stateExplan = (state) =>{
    if(state === 'Y')return "激活";
    if(state === 'start') return "执行中";
    if(state === 'stop')return "已停止";
    if(state === 'N') return "停用";
  }


  getJobList = (param = '') => {
    getJobList(param).then((res)=> {
      let data = res.data;
      if (data.flag === "success") {
        this.setState({
          taskList: data.data.content,
          pages: data.totalPages,
          showLoading:false
        })
      } else {
        Message.create({content: data.msg, color: 'danger', duration: 1.5})
      }
    });
  }
  /**
   * 删除任务
   *
   */
  handleDelete = obj => () => {
    if(obj.testjobState === "start") {
      return Message.create({
        content: "当前任务正在执行，不能删除！",
        color: 'danger',
        duration: 1.5
      })
    }
    let paramData={
      "testjobId": obj.testjobId,
      "testjobName": obj.testjobName,
      "userId": obj.userId,
      "testjobState": obj.testjobState,
    }
    deleteTestJob(paramData)
      .then((res) => {
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
        let appId = this.props.appId;
        let state = "Y";
        this.getJobList(`?search_productId=${appId}`);
      })
  }

  /**
   * 分页换页
   *
   */
  handleSelectPage = (eventKey) => {
    let appId = this.props.appId;
    let state = "Y";
    this.setState({
      activePage: eventKey
    });
    this.getJobList(`?search_productId=${appId}&pageIndex=${eventKey}`)
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
    if(obj.testjobState === "start"){
      return Message.create({
        content: "当前任务正在执行，不能修改！",
        color: 'danger',
        duration: 1.5
      })
    }
    this.setState({
      showCreateModal: true,
      editFlag: true,
      selectedId: obj.testjobId
    })
  }


  /**
   * 查看报告
   */
  viewReport = (obj) => () =>{
    if(obj.testjobState === "start"){
      return Message.create({
        content: "当前任务正在执行，尚未生成任务报告！",
        color: 'danger',
        duration: 1.5
      })
    }
    this.setState({
      showReportModal: true,
      selectedId: obj.testjobId
    })
  }


  /**
   * 查看日志
   */
  viewLog = (obj) => () => {
    if(obj.testjobState === "start"){
      return Message.create({
        content: "当前任务正在执行，尚未生成任务日志！",
        color: 'danger',
        duration: 1.5
      })
    }
    this.setState({
      showLogModal: true,
      selectedId: obj.testjobId
    })
  }

  /**
   * 执行任务
   */
  execute = obj => () => {
    if(obj.testjobState === "start"){
      return Message.create({
        content: "当前任务正在执行，不能重复执行！",
        color: 'danger',
        duration: 1.5
      })
    }
    if(obj.testjobState === "N"){
      return Message.create({
        content: "当前任务已停用，不能执行！",
        color: 'danger',
        duration: 1.5
      })
    }
    let appId = this.props.appId;
    let excuting = this.state.excuting;
    excuting.push(obj.testjobId);
    this.setState({
      excuting
    })

    executeJobBefore(obj.testjobId, obj.executeTime).then(
      ()=>{ this.getJobList(`?search_productId=${appId}`);}//刷新列表数据
    );//改变当前数据的执行状态

    executeJob(obj.testjobId, obj.executeTime).then((res) => {//执行脚本
      excuting = excuting.filter(item =>
        item !== obj.testjobId
      )
      this.setState({
        excuting
      })
      this.getJobList(`?search_productId=${appId}`);//执行脚本返回数据后刷新状态
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
   * 打开创建模态框
   */
  openCreateModal = () => {
    this.setState({
      showCreateModal: true
    })
  }

  closeModal = () =>{
    this.setState({
      showCreateModal: false,
      editFlag:false
    })
  }

  closeViewReportModal = () =>{
    this.setState({
      showReportModal:false,
      selectedId:''
    })
  }

  closeViewLogModal = () =>{
    this.setState({
      showLogModal:false,
      selectedId:''
    })
  }

  closeViewDetailModal = () =>{
    this.setState({
      showDetailModal:false,
      selectedId:''
    })
  }

  /**
   * 搜索
   */
  handleSearch = (param) => {//有条件搜索
    this.setState({
      showLoading:true
    })
    let appId = this.props.appId;
    let state = "Y";
    this.getJobList(`?search_productId=${appId}&search_LIKE_testjobName=${param}&search_LIKE_userName=${param}`);
  }
  /**
   * 搜索框值改变
   */
  handleSelectValue = (e) => {
    this.setState({
      searchValue: e.target.value
    })
  }


  /**
   * 捕获回车
   * @param e
   */
  handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.handleSearch(this.state.searchValue)();
    }
  }


  downLoadScriptDemo = () =>{
    downloadBefore().then((res) =>{
      if(res.data === "hasFile"){
        return true
      }else{
        Message.create({
          content: "没有可供下载的文件！",
          color: 'danger',
          duration: 1.5
        })
      }
    })
  }

  fmtDate = (obj) =>{
    if(typeof(obj)=="undefined"){
      return ''
    }
    var date =  new Date(obj);
    var y = 1900+date.getYear();
    var m = "0"+(date.getMonth()+1);
    var d = "0"+date.getDate();
    var h = "0"+ date.getHours();
    var mm = "0" + date.getMinutes();
    var s = "0" + date.getSeconds();
    return y+"-"+m.substring(m.length-2,m.length)+"-"+d.substring(d.length-2,d.length)+" "+
      h.substring(h.length-2,h.length)+":"+mm.substring(mm.length-2,mm.length)+":"+s.substring(s.length-2,s.length);
  }

  render() {
    return (
      <div className="auto-test">
        <div className="script-btn-group">

          <Button
            onClick={this.openCreateModal}
            shape="squared"
            colors="primary">
            新增测试任务
          </Button>

          <a className="u-button u-button-squared u-button-primary" onclick="return downLoadScriptDemo() "target="_blank" href="/cloudtest/boot_testscript/downloadDemo">
            下载脚本模板
          </a>

          <a className="u-button u-button-squared u-button-primary" target="_blank" href="/../cloudtest/doc/selenium.html">
            查看使用说明
          </a>

          <Search
            className="auto-test-search"
            onSearch={this.handleSearch}
            />
        </div>
        <div className="auto-test-table">
          <LoadingTable
            showLoading={ this.state.showLoading }
            columns={this.columScript}
            data={this.state.taskList}
            />
          <Loading loadingType="line" size="lg" show={this.state.showExcLoading} container={this}/>
          {
            this.state.pages > 1 ? (
              <Pagination
                prev
                next
                items={this.state.pages}
                maxButtons={5}
                activePage={this.state.activePage}
                onSelect={this.handleSelectPage}/>
            ) : null
          }

        </div>



        <CreateTest
          showCreateModal={ this.state.showCreateModal }
          close={this.closeModal}
          app_name={this.props.appName}
          app_id={this.props.appId}
          getJoblist={this.getJobList}
          editFlag={this.state.editFlag}
          dataId={ this.state.selectedId }
          fmtDate={this.fmtDate}
          />

        <ReportTest
          showReportModal={ this.state.showReportModal }
          dataId={ this.state.selectedId }
          closeViewReportModal={this.closeViewReportModal}
          fmtDate={this.fmtDate}
          excuting={this.state.excuting}
          />

        <LogTest
          showLogModal={ this.state.showLogModal }
          dataId={ this.state.selectedId }
          closeViewLogModal={this.closeViewLogModal}
          fmtDate={this.fmtDate}
          excuting={this.state.excuting}
          />

        <DetailTest
          showDetailModal={this.state.showDetailModal}
          dataId={this.state.selectedId}
          closeViewDetailModal={this.closeViewDetailModal}
          fmtDate={this.fmtDate}
          />
      </div>
    )
  }
}
export default AutoTest;
