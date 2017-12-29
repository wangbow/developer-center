import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import Title from 'components/Title';
import {Row, Col, Button, Table, Pagination, Message, Popconfirm} from 'tinper-bee';
import {DownloadScript, getJobList, saveJob, downloadDemo, downloadBefore, deleteTestJobBatch } from 'serves/appTile';
import {List, Control} from '../../components';
import PageLoading from 'components/loading';
import { splitParam} from 'components/util';
import './index.less';

export  default class ListPage extends Component{

state= {
  showLoading: true,
  JobList: [],
  selectedList:[],
  checkedAllFlag:false,
  pages:0,
  jobs:[],
}

  componentDidMount() {
    this.getTestjob();
  }

  /**
   * 获取任务列表
   * @param key
   */
  getTestjob = (param = '') => {
    let joblist=[];
    getJobList(param).then((res)=> {
      let data = res.data;

      if (data.flag === "success") {
        joblist = data.data.content;
        joblist.forEach((item) =>{
          item.checked = false;
        })
        this.setState({
          JobList: joblist,
          pages: data.data.totalPages,
          showLoading:false
        })
      } else {
        Message.create({content: data.msg, color: 'danger', duration: 1.5})
      }
    })
  }

  /**
   * 搜索
   */
  handleSearch = (param) => ()=>{//有条件搜索
    this.setState({
      showLoading:true
    })
   this.getTestjob(`?search_LIKE_testjobName=${param}&search_LIKE_userName=${param}`);
  }


  /**
   * 批量删除
   */
  deleBatch = () =>{
    this.state.JobList.forEach((item) => {
      if(item.checked && item.testjobState === "start"){
        return Message.create({
          content: "所选任务中有任务正在执行，请重新选择！",
          color: 'danger',
          duration: 1.5
        })
      }
    })
    let data=[];
    this.state.JobList.forEach((item)=> {
      let obj = {};
      if (item.checked) {
        obj = {
          "testjobId": item.testjobId,
          "testjobName": item.testjobName,
          "userId": item.userId,
          "testjobState": item.testjobState,
        }
      }
      if(obj.testjobId){data.push(obj)}
    })
    if (!data) return  Message.create({content: "请选择要删除的数据！", color: 'warning', duration: 1.5}) ;

    deleteTestJobBatch(data).then((res) => {
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
      this.getTestjob();
    })
  }

  /**
   * 全选/全反选
   */

  oncheckAll = () =>{
    if (!this.state.checkedAllFlag) {
      this.state.JobList.forEach(function (item) {
        item.checked = true;
      })
    } else {
      this.state.JobList.forEach(function (item) {
        item.checked = false;
      })
    }
    this.setState({checkedAllFlag: !this.state.checkedAllFlag});
  }


  /**
   * 单选任务
   */
  onChioseJob = (e) => {
    let index = e.target.index;
    let checkedAll = true;
    this.state.JobList[index].checked = !this.state.JobList[index].checked;
    this.setState({JobList: this.state.JobList});
    if (e.target.checked) {
      this.state.JobList.forEach(function (item, i) {
        if (i !== index && !item.checked) {
          return checkedAll = false;
        }
      })
      if (checkedAll) {
        this.setState({checkedAllFlag: true});
      }
    } else {
      this.setState({checkedAllFlag: false});
    }
  }


  render(){
    return(
      <Col className="test-job-list">
        <Title name="测试任务列表" showBack={ false }/>
        <Control
          onSearch={ this.handleSearch }
          handleDelebatch={this.deleBatch}
        />
        <List
          searchData={ this.state.JobList }
          pages={ this.state.pages }
          checkedAllJob={this.state.checkedAllFlag}
          jobs={this.state.jobs}
          checkAll={this.oncheckAll}
          choiseJob={this.onChioseJob}
          getJobList={this.getTestjob}
        />
        <PageLoading show={ this.state.showLoading } />
      </Col>
      )
  }
}
