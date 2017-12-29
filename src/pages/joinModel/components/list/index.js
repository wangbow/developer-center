import React, {Component, PropTypes} from 'react';
import {
  Row,
  Col,
  Button,
  Message,
  FormControl,
  Popconfirm
} from 'tinper-bee';
import Table from 'bee-table';
import './index.less';
import {
  DeleteJoin,
  GetFormRelation
}
from '../../server';

class List extends Component {

  static contextTypes = {
    router: PropTypes.object
  };
  static propTypes = {
    data: PropTypes.array
  };
  static defaultProps = {
    data: []
  };
  subColum = [
    { title: "从表名称", dataIndex: "name", key: "name", width: 100 },
    { title: "连接方式", dataIndex: "joinType", key: "b", width: 100 },
    { title: "连接条件", dataIndex: "joinCondition", key: "c", width: 200 }
  ];

  state = {
    deleteId: '',
    showDeleteModal: false,
    subData:[]
  }


  // 去详情页

  toDetail = (id) => {
    let self = this;
    return function() {
      self.context.router.push('/detail/' + id);
    }
  }


  // 删除
  onDeleteSource = (record) => {
    let self = this;
    const {getListCall} = this.props;
    return function() {
      let param =
      {
        "masterId":record.id
      }
      console.log(getListCall);
      let _this = self;
      DeleteJoin(param, function(response) {
        let res = response;
        if (res.data.success == "success") {
          Message.create({
            content: "删除成功",
            color: 'success',
            duration: 1
          });
          getListCall();
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

  //编辑页
   onEditSource = (record) => {
    let self = this;
    return function() {
      self.context.router.push('/edit/' + record.id);
    }
   }


  expandedRowRender = (record, i, indent) => {
    return (
      <Table
        columns={this.subColum}
        data={this.state.subData[i]}
      />
    );
  };
  getData=(expanded, record)=>{
    let self = this;
    let param = {
      "masterId":record && record.id
    };
    let key = record && record.key;
    //当点击展开的时候才去请求数据
    if(expanded){
      GetFormRelation(param, function(response) {
        let rsdata = response.data && response.data.detailMsg && response.data.detailMsg.data;
        let subData = self.state.subData;
        subData[key] = rsdata
        self.setState({subData:subData});
      })

    }
  }
  //

  render() {
    let {data} = this.props;
    let self = this;
    const columns = [{
      title: '主表名称',
      dataIndex: 'tbName',
      key: 'tbName',
      render(text, record, index) {

        return <span className="hover-detail" onClick={self.toDetail(record.id)}>{text}</span>;
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
      title: '描述',
      dataIndex: 'remark',
      key: 'remark',
      render(text, record, index) {
        return text;
      }
    }, {
      title: '创建时间',
      dataIndex: 'addTime',
      key: 'addTime',
      render(text, record, index) {
        return text;
      }
    }, {
      title: '操作',
      dataIndex: 'oper',
      key: 'oper',
      render(text, record, index) {
        return (
        	<div>
          	 <Popconfirm content="确认删除?" placement="bottom"  onClose={self.onDeleteSource(record)}>
          		 <Button >删除</Button>
           	 </Popconfirm>
             <Button className="marginLeft10" onClick={self.onEditSource(record)}>编辑</Button>
            </div>)

      }
    }];
    return (
      <Col md={12} className="data-tabel">

    		<div className="source-table">
    		  <Table columns={columns}
                 data={data}
                 onExpand={this.getData}
                 expandedRowRender={this.expandedRowRender}
          />
    		</div>

      </Col>
    )
  }
}
export default List;



