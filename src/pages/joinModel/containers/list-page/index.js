import React, {
  Component,
  PropTypes
} from "react";
import {
  Link
} from "react-router";
import {
  Row,
  Col,
  Button,
  Table,
  FormControl,
  InputGroup,
  Message,
  Pagination,
  Popconfirm
} from 'tinper-bee';


import {
  GetJoinPage
}
from '../../server';
import Title from 'components/Title';

import {SearchControl,List} from '../../components';

import "./index.less";


class ListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSourceList: [],
      paginationData: []
    }
  }
  componentDidMount() {
    this.getList();
  }

  getList = (number = 0, dbName = "", searchFlag = false) => {
    let param = {
      number: number,
      size: "10",
      dbName: dbName
    };
    let self = this;
     //mock
    GetJoinPage(param, function(response) {
      let res = response;
      //模拟字段
      let content = res.data.detailMsg.data.content;
      if(content){
        content.forEach((item,index)=>{
          item.key = index;
        })
      }
      self.setState({
        dataSourceList: content,
        paginationData: res.data.detailMsg.data
      }); //mock
      if (res.data.success == "success" && searchFlag) {
        Message.create({
          content: "查询成功",
          color: 'success',
          duration: 1
        });
      }

    })
  }

  getListCall = () => {
    this.getList();
  }

  onSearch = (value) => {
    this.getList(this.state.paginationData.number, value, true);
  }

  handleSelect(eventKey) {
    this.setState({
      activePage: eventKey
    });
  }
  render() {
    let self = this;
    return (
      <Row className="data-source-manage">
        <Title name="多表模型管理" showBack={false}/>

        <SearchControl onSearch={ this.onSearch }/>
        <List data={this.state.dataSourceList} getListCall={this.getListCall}/>

        <div className="footer-pagination">
          <Pagination
            first
            last
            prev
            next
            boundaryLinks
            items={this.state.paginationData.total_pages}
            maxButtons={5}
            activePage={this.state.paginationData.number+1}
            onSelect={this.handleSelect.bind(this)} />
        </div>
     </Row>)
  }
}

export default ListPage;
