import React, {
  Component,
  PropTypes
} from "react";
import ReactDOM from "react-dom";
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
  Pagination,
  Message,
  Popconfirm
} from 'tinper-bee';
import Title from 'components/Title';
import {
  GetSourceList,
  DeleteSource
} from './server';

import "./index.css";
class DBSourceManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSourceList: [],
      paginationData: {}
    }
  }
  componentDidMount() {
    this.getList();
  }

  getList = () => {
    let param = {
      number: "", //当前页码
      size: "", //每页显示行数
      dbName: "", //数据库名称
    };
    let self = this;
    GetSourceList(param, function(response) {
      let res = response;
      self.setState({
        dataSourceList: res.data.detailMsg.data.content,
        paginationData: res.data.detailMsg.data
      });
    })
  }

  onSearch = () => {
    let value = ReactDOM.findDOMNode(this.refs.tb_name).value;
    //if(value == "") return;
    let param = {
      number: "", //当前页码
      size: "", //每页显示行数
      dbName: value, //数据库名称
    };
    let self = this;
    GetSourceList(param, function(response) {
      let res = response;
      self.setState({
        dataSourceList: res.data.detailMsg.data.content,
        paginationData: res.data.detailMsg.data
      });
      if (res.data.success == "success") {
        Message.create({
          content: "查询成功",
          color: 'success',
          duration: 1
        });
      }
    })
  }

  handleSelect(eventKey) {
    this.setState({
      activePage: eventKey
    });
  }

  toDetail = (id) => {
    let self = this;
    return function() {
      self.context.router.push('/detail/' + id);
    }
  }

  onDeleteSource = (record) => {
    let self = this;
    return function() {
      let param = {
        id: record.id
      }
      DeleteSource(param, function(response) {
        let res = response;
        if (res.data.success == "success") {
          Message.create({
            content: "删除成功",
            color: 'success',
            duration: 1
          });
          self.getList();

        } else {
          Message.create({
            content: res.data.message,
            color: 'warning',
            duration: 1
          });
        }
      })
    }
  }

  onEditSource = (record) => {
    let self = this;
    return function() {
      self.context.router.push('/edit/' + record.id);
    }
  }

  render() {
    let self = this;

    const columns = [{
      title: '名称',
      dataIndex: 'dbName',
      key: 'dbName',
      render(text, record, index) {
        //return text;
        return <span className="hover-detail" onClick={self.toDetail(record.id)}>{text}</span>
      }
    }, {
      title: '时间',
      dataIndex: 'addTime',
      key: 'addTime',
      render(text, record, index) {
        return text;
      }
    }, {
      title: '端口号',
      dataIndex: 'port',
      key: 'port'
    }, {
      title: '主机IP',
      dataIndex: 'ip',
      key: 'ip',
      render(text, record, index) {
        return text;
      }
    }, {
      title: '描述',
      dataIndex: 'remark',
      key: 'remark1',
      render(text, record, index) {
        return text;
      }
    }, {
      title: '操作',
      dataIndex: 'oper',
      key: 'oper',
      render(text, record, index) {
        return (<div>
                          
                          <Popconfirm content="确认删除?" placement="bottom"  onClose={self.onDeleteSource(record)}>
                           <Button >删除</Button>
                           </Popconfirm>
                          <Button className="marginLeft10" onClick={self.onEditSource(record)}>编辑</Button>
                        </div>)

      }
    }];

    return (
      <Row className="data-source-manage">
      <Title showBack={false} name="数据源管理" />
      <Col md={12} className="source-content">
        <div className="source-header">
          <Link to="/add"><Button >新增</Button></Link>
          <InputGroup>
            <FormControl ref="tb_name" type="text"/>
            <InputGroup.Addon onClick={this.onSearch}>搜索</InputGroup.Addon>
          </InputGroup>
        </div>
        <div className="source-table">
          <Table columns={columns} data={this.state.dataSourceList}/>
        </div>
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
      </Col>

    </Row>)
  }
}

DBSourceManager.contextTypes = {
  router: PropTypes.object
};
export default DBSourceManager;