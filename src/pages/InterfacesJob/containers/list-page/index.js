import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import Title from 'components/Title';
import {Row, Col, Button, Table, Pagination, Message, Popconfirm} from 'tinper-bee';
import { restJobList, deleteRestJob} from 'serves/testCenter';
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
}

  componentDidMount() {
    this.getRestJob();
  }

  /**
   * 获取任务列表
   * @param key
   */
  getRestJob = (param = '') => {
    let joblist=[];
    restJobList(param).then((res)=> {
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
   this.getRestJob(`?search_LIKE_restjobName=${param}&search_LIKE_userName=${param}&search_LIKE_productName=${param}`);
  }


  /**
   * 批量删除
   */
  deleBatch = () =>{
    this.state.JobList.forEach((item) => {
      if(item.checked && item.restjobState === "start"){
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
          "restjobId": item.restjobId,
          "restjobName": item.restjobName,
          "userId": item.userId,
          "restjobState": item.restjobState,
        }
      }
      if(obj.restjobId){data.push(obj)}
    })
    if (!data) return  Message.create({content: "请选择要删除的数据！", color: 'warning', duration: 1.5}) ;

    deleteRestJob(data).then((res) => {
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
      this.getRestJob();
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
        <Title name="接口任务列表" showBack={ false }/>
        <Control
          onSearch={ this.handleSearch }
          handleDelebatch={this.deleBatch}
        />
        <List
          searchData={ this.state.JobList }
          pages={ this.state.pages }
          checkedAllJob={this.state.checkedAllFlag}
          checkAll={this.oncheckAll}
          choiseJob={this.onChioseJob}
          getJobList={this.getRestJob}
        />
        <PageLoading show={ this.state.showLoading } />
      </Col>
      )
  }
}
