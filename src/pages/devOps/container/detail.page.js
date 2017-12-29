// publics
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'tinper-bee';
import Table from 'antd/lib/table';
import 'antd/lib/table/style/css';

// self component
import Header from '../component/header';

// api
import { getChangeList, getChangeType } from '../../../serves/devOpts';

// static
import './detail.style.css';


const columns = [{
  title: '变更单',
  key: 'ch-order',
  render:(text,rec)=>{
    return <span>{`[${rec.id}-${rec.title}]`}</span>
  }
}, {
  title: '变更内容',
  dataIndex: 'content',
  width: '300px',
  key: 'content',
} ,{
  title: '影响应用',
  dataIndex: 'appName',
  key: 'appName',
}, {
    title: '变更时间',
  dataIndex: 'endTime',
  key: 'endTime',
}, {
  title: '执行人',
  key: 'actorName',
  render:(text,rec)=>{
    return <span>{`${rec.actorName}-${rec.deptName}`}</span>
  }
},  {
  title: '变更类型',
  dataIndex: 'type',
  key: 'type',
}, {
  title: '回滚',
  key: 'rollback',
  render: (text, rec) => {
    return (
      <Button
        data-rec={rec}
        onClick={this.handleRollback}
      >回滚</Button>
    )
  }
}];


export default class HomePAge extends Component {
  static propTypes = {}
  static defaultProps = {}

  state = {
    keyword: "",
    types: [],
    total: 0,
    pageSize: 0,
    curType: "",
    listData: [],
    listType: [],
    loading: true,
    showModal: true,
  }
  columns = [{
    title: '变更单',
    key: 'ch-order',
    render: (text, rec) => {
      return <span>{`[${rec.id}]-${rec.title}`}</span>
    }
  }, {
    title: '变更内容',
    dataIndex: 'content',
    width: '300px',
    key: 'content',
  }, {
    title: '影响应用',
    dataIndex: 'appName',
    key: 'appName',
  }, {
    title: '变更时间',
    dataIndex: 'endTime',
    key: 'endTime',
  }, {
    title: '执行人',
    key: 'actorName',
    render: (text, rec) => {
      return <span>{`${rec.actorName}-${rec.deptName}`}</span>
    }
  }, {
    title: '变更类型',
    dataIndex: 'type',
    key: 'type',
  }
  // , {
  //   title: '回滚',
  //   key: 'rollback',
  //   render: (text, rec) => {
  //     return (
  //       <a target="_self" href={`/fe/appManager/index.html#/publish_detail/${rec.appId}?runState=-1`}>回滚</a>
  //     )
  //   }
  // }
];

  rollBackData = null;
  componentDidMount() {
    Promise.all([getChangeList(), getChangeType()])
      .then(([listData, listType]) => {
        listData = listData || {
          changeBillVOList: [],
          pageCount: 0,
          totalCount: 0
        }
        this.setState({
          listData: listData.changeBillVOList,
          total: listData.totalCount,
          pageSize: listData.pageCount,
          listType,
          curType: listType[listType.length - 1] && listType[listType.length - 1].index,
          loading: false,
        })
      })
  }

  // handleRollbackDataSave = (e) => {
  //   let target = e.target;
  //   let rec = target.dataset.rec;

  //   this.rollBackData = rec;
  //   this.setState({
  //     showModal: true,
  //   })
  // }
  // handleRollback = (e) => {
  //   let rec = this.rollBackData;
  //   //发送数据，成功是失败都要删除数据

  // }

  // cancelRollback = () => {
  //   this.rollBackData = null;
  //   this.setState({
  //     showModal: false,
  //   })
  // }

  onSearch = (keyword, type) => {
    this.setState({
      loading: true,
      keyword,
    })
    getChangeList({
      keyword: encodeURIComponent(keyword),
      type: encodeURIComponent(type)
    }).then(listData => {
      listData = listData || {
        changeBillVOList: [],
        pageCount: 0,
        totalCount: 0
      }
      this.setState({
        listData: listData.changeBillVOList,
        pageCount: listData.pageCount,
        total: listData.totalCount,
        loading: false,
      })
    })
  }
  handleTypeChange=(type)=>{
    this.setState({
      curType: type ,
      loading: true,
    })
    getChangeList({
      keyword: encodeURIComponent(''),
      type: encodeURIComponent(type)
    }).then(listData => {
      listData = listData || {
        changeBillVOList: [],
        pageCount: 0,
        totalCount: 0
      }
      this.setState({
        listData: listData.changeBillVOList,
        pageCount: listData.pageCount,
        total: listData.totalCount,
        loading: false,
      })
    })
  }

  handlePagi = (page, pageSize) => {
    this.setState({
      loading: true,
    })
    getChangeList({
      keyword: encodeURIComponent(this.state.keyword),
      type: encodeURIComponent(this.state.curType),
      pageIndex: page,
    }).then(listData => {
      listData = listData || {
        changeBillVOList: [],
        pageCount: 0,
        totalCount: 0
      }
      this.setState({
        listData: listData.changeBillVOList,
        pageCount: listData.pageCount,
        total: listData.totalCount,
        loading: false,
      })
    })
  }


  render() {
    const pagination = {
      total: this.state.total,
      pageSize: this.state.pageSize,
      onChange: this.handlePagi

    };
    return (
      <div className="detail">
        <Header
          types={this.state.listType}
          onTypeChange={this.handleTypeChange}
          onSearch={this.onSearch}
        />
        <Table
          columns={this.columns}
          dataSource={this.state.listData}
          rowKey={record => record.id}
          loading={this.state.loading}
          pagination={pagination}
        />
        {/* <Modal show={this.state.showModal}>
          <Modal.Header>
            <Modal.Title>
              确认回滚？
            </Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button onClick={this.handleRollback}>确认</Button>
            <Button onClick={this.cancelRollback}>取消</Button>
          </Modal.Footer>
        </Modal> */}
      </div>
    )
  }
}