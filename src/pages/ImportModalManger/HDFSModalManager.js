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
  Message,
  Pagination,
  Popconfirm
} from 'tinper-bee';
import {
  GetSourceList,
  CreateHBase,
  DeleteSource
} from './server';
import Title from 'components/Title';

import "./index.css";
class ImportModalManager extends Component {
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
      dbName: dbName,
      tbName: "",
      isSingle:false
    };
    let self = this;
    GetSourceList(param, function(response) {
      let res = response;
      let content = res.data.detailMsg.data.content;
      let optContent = [];
      // for(let i=0;i<content.length;i++) {
      //   let record = content[i];
      //   //dateLine不为空
      //   //alias 必须为空
      //     if (record.dateLine && !record.alias) {
      //       optContent.push(record);
      //     }
      // }
      self.getDBList(content);
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
      //self.setState({dataSourceList:res.detailMsg.data.content});  //线上

    })
  }
  getDBList = (content) => {
    let dbList = [];
    if (!content) return;

    content.map(function(item, index) {
      dbList.push({
        dbName: item.dbName,
        sourceId: item.sourceId
      });
      //dbList.push(item);
    })

    sessionStorage.setItem("ModalList", JSON.stringify(dbList));
  }

  onSearch = () => {
    let dbName = ReactDOM.findDOMNode(this.refs.dbName).value;
    this.getList(this.state.paginationData.number, dbName, true);
  }

  handleSelect(eventKey) {
    this.setState({
      activePage: eventKey
    });
  }

  onImport = (index) => {
    let self = this;
    return function() {
      let sourceId = self.state.dataSourceList[index].sourceId;
      let tbId = self.state.dataSourceList[index].id;
      let param = {
        sourceId: sourceId,
        tbId: tbId
      }
      let _self = self;
      CreateHBase(param, function(response) {
        let res = response;
        if (res.data.success == "success") {
          Message.create({
            content: res.data.message,
            color: 'success',
            duration: 4
          });
          _self.getList();
        }
      })
    }

  }

  toDetail = (record) => {
    let self = this;
    let id = record.id;
    let url = '/HDFSdetail/' +id;
    
    return function() {
      self.context.router.push(url);
    }
  }

  onDeleteSource = (record) => {
    let self = this;
    return function() {
      let param = {
        id: record.id,
        sourceId: record.sourceId,
        tbName: record.tbName,
        schemaId: record.schemaId,
        isSingle: false
      }
      let _this = self;
      DeleteSource(param, function(response) {
        let res = response;
        if (res.data.success == "success") {
          Message.create({
            content: "删除成功",
            color: 'success',
            duration: 1
          });
          _this.getList();
        } else {
          Message.create({
            content: "删除失败",
            color: 'warning',
            duration: 1
          });
        }
      })
    }
  }

  onEditSource = (record) => {
    let self = this;
    let url = '/HDFSedit/' +record.id;
    return function() {
      self.context.router.push(url);
    }
  }

  render() {
    let self = this;
    const columns = [{
      title: '表名称',
      dataIndex: 'tbName',
      key: 'tbName',
      render(text, record, index) {

        return <span className="hover-detail" onClick={self.toDetail(record)}>{text}</span>;
      }
    }, {
      title: '数据源名称',
      dataIndex: 'dbName',
      key: 'dbName',
      render(text, record, index) {
        return text;
      }
    }, {
      title: '数据库名称',
      dataIndex: 'schemaName',
      key: 'schemaName',
      render(text, record, index) {
        return text;
      }
    }, {
      title: '过滤条件',
      dataIndex: 'filterCondition',
      key: 'filterCondition',
      render(text, record, index) {
        return text;
      }
    }, {
      title: '同步',
      dataIndex: 'isSync',
      key: 'isSync',
      render(text, record, index) {
        if (text) {
          return '是';
        } else {
          return '否';
        }
      }
    }, {
      title: '同步周期',
      dataIndex: 'crontab',
      key: 'crontab',
      render(text, record, index) {
        return text;
      }
    }, {
      title: '描述',
      dataIndex: 'remark',
      key: 'remark',
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
                  
                </div>)

      }
    }];



    return (
      <Row className="data-source-manage">
      <Title name="基础数据抽取"/>
      <Col md={12}>
        <div className="source-header">
          <div>

            <Link to="/addHDFS" className="marginLeft10"><Button colors="primary" shape="squared">新增模型数据关联</Button></Link>
          
          </div>
          <div className="search-container">
            <FormControl ref="dbName" placeholder="数据源名称" type="text"/>
            <Button colors="primary" shape="squared" onClick={this.onSearch}> 搜索 </Button>
          </div>
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

ImportModalManager.contextTypes = {
  router: PropTypes.object
};
export default ImportModalManager;