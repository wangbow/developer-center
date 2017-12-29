import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import Title from 'components/Title';
import {Row, Col, Button, Table, Pagination, Message, Popconfirm} from 'tinper-bee';
import { getCasesList, deleteTestCase } from 'serves/testCenter';
import {List, Control} from '../../components';
import PageLoading from 'components/loading';
import { splitParam} from 'components/util';
import './index.less';

export  default class ListPage extends Component{

state= {
  showLoading: true,
  caseList: [],
  checkedAllFlag:false,
  pages:0,
}

  componentDidMount() {
    this.getTestcase();
  }

  /**
   * 获取任务列表
   * @param key
   */
  getTestcase = (param = '') => {
    let joblist=[];
    getCasesList(param).then((res)=> {
      let data = res.data;

      if (data.flag === "success") {
        joblist = data.data.content;
        joblist.forEach((item) =>{
          item.checked = false;
        })
        this.setState({
          caseList: joblist,
          pages: data.data.totalPages,
          showLoading:false
        })
      } else {
        Message.create({content: data.msg, color: 'danger', duration:1.5 })
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
   this.getTestcase(`?search_LIKE_testcaseName=${param}&search_LIKE_userName=${param}`);
  }


  /**
   * 批量删除
   */
  deleBatch = () =>{
    let data=[];
    this.state.caseList.forEach((item)=> {
      let obj = {};
      if (item.checked) {
        obj = {
          "testcaseId": item.testcaseId,
          "testcaseName": item.testcaseName,
          "userId": item.userId,
        }
      }
      if(obj.testcaseId){data.push(obj)}
    })
    if (!data) return  Message.create({content: "请选择要删除的数据！", color: 'warning', duration: 1.5}) ;

    deleteTestCase(data).then((res) => {
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
      this.getTestcase();
    })
  }

  /**
   * 全选/全反选
   */

  oncheckAll = () =>{
    if (!this.state.checkedAllFlag) {
      this.state.caseList.forEach(function (item) {
        item.checked = true;
      })
    } else {
      this.state.caseList.forEach(function (item) {
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
    this.state.caseList[index].checked = !this.state.caseList[index].checked;
    this.setState({caseList: this.state.caseList});
    if (e.target.checked) {
      this.state.caseList.forEach(function (item, i) {
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
        <Title name="用例列表" showBack={ false }/>
        <Control
          onSearch={ this.handleSearch }
          delebatch={this.deleBatch}
        />
        <List
          searchData={ this.state.caseList }
          pages={ this.state.pages }
          checkedAllJob={this.state.checkedAllFlag}
          checkAll={this.oncheckAll}
          choiseJob={this.onChioseJob}
          getCaseList={this.getTestcase}
        />
        <PageLoading show={ this.state.showLoading } />
      </Col>
      )
  }
}
