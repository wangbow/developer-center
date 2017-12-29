import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import Title from 'components/Title';
import {Row, Col, Button, Table, Pagination, Message, Popconfirm} from 'tinper-bee';
import  {getScriptlist, deleteScript } from 'serves/testCenter';
import {List, Control} from '../../components';
import PageLoading from 'components/loading';
import { splitParam} from 'components/util';
import './index.less';

export  default class ListPage extends Component{

state= {
  showLoading: true,
  scriptlist: [],
  selectedList:[],
  checkedAllFlag:false,
  pages:0,
  jobs:[],
}

  componentDidMount() {
    this.getTestscript();
  }

  /**
   * 获取脚本列表
   * @param key
   */
  getTestscript = (param = '') => {
    let scriptlist=[];
    getScriptlist(param).then((res)=> {
      let data = res.data;
      if (data.flag === "success") {
        scriptlist = data.data.content;
        scriptlist.forEach((item) =>{
          item.checked = false;
        })
        this.setState({
          scriptlist: scriptlist,
          pages: data.data.totalPages,
          showLoading:false
        })
      } else {
        Message.create({content: data.msg, color: 'danger', duration: null})
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
   this.getTestscript(`?search_LIKE_testscriptName=${param}&search_LIKE_userName=${param}`);
  }


  /**
   * 批量删除
   */
  deleBatch = () =>{
    let data=[];
    this.state.scriptlist.forEach((item)=> {
      let obj = {};
      if (item.checked) {
        obj = {
          "testscriptId": item.testscriptId,
          "testscriptName": item.testscriptName,
          "userId": item.userId,
        }
      }
      if(obj.testscriptId){data.push(obj)}
    })
    if (!data) return  Message.create({content: "请选择要删除的数据！", color: 'warning', duration: 1.5}) ;

    deleteScript(data).then((res) => {
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
      this.getTestscript();
    })
  }

  /**
   * 全选/全反选
   */

  oncheckAll = () =>{
    if (!this.state.checkedAllFlag) {
      this.state.scriptlist.forEach(function (item) {
        item.checked = true;
      })
    } else {
      this.state.scriptlist.forEach(function (item) {
        item.checked = false;
      })
    }
    this.setState({checkedAllFlag: !this.state.checkedAllFlag});
  }


  /**
   * 单选脚本
   */
  onChioseJob = (e) => {
    let index = e.target.index;
    let checkedAll = true;
    this.state.scriptlist[index].checked = !this.state.scriptlist[index].checked;
    this.setState({scriptlist: this.state.scriptlist});
    if (e.target.checked) {
      this.state.scriptlist.forEach(function (item, i) {
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
        <Title name="脚本列表" showBack={ false }/>
        <Control
          onSearch={ this.handleSearch }
          delebatch={this.deleBatch}
        />
        <List
          searchData={ this.state.scriptlist }
          pages={ this.state.pages }
          checkedAllJob={this.state.checkedAllFlag}
          checkAll={this.oncheckAll}
          choiseJob={this.onChioseJob}
          getTestScript={this.getTestscript}
        />
        <PageLoading show={ this.state.showLoading } />
      </Col>
      )
  }
}
