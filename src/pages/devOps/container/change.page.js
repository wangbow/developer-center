// publics 
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table from 'antd/lib/table';
import 'antd/lib/table/style/css';

// self component
import TimePicker from '../component/timePicker';

// api
import { getChangeList } from '../../../serves/devOpts';

// static
import './change.style.css';

const columns = [{
  title: 'ID',
  dataIndex: 'id',
  key: 'id',
}, {
  title: '标题',
  dataIndex: 'title',
  key: 'title',
}, {
  title: '类型',
  dataIndex: 'type',
  key: 'type',
}, {
  title: '执行人',
  dataIndex: 'actorName',
  key: 'actorName',
}, {
  title: '简介',
  dataIndex: 'content',
  width: '300px',
  key: 'content',
}];

export default class ChangePage extends Component {
  
  constructor(props){
    super(props);
    let now = new Date().getTime();


    this.state = {
      loading: true,
      infra:[],
      core: [],
      time: {
        startDate: now - 5 * 60 * 1000,
        endDate: now,
      }
    }
  }
  
  componentDidMount(){
    getChangeList(this.state.time).then(data=>{
      this.setState({
        infra: data && data.basicChangeList || [],
        core: data && data.coreChangeList || [],
        loading: false,
      })
    })
  }
  
  onTimeSelected=(time)=>{
    this.setState({
      loading:true,
    });

    getChangeList(time).then(data => {
      this.setState({
        infra: data && data.basicChangeList || [],
        core: data && data.coreChangeList || [],
        loading: false,
      })
    })
  }

  render() {
    return (
      <div style={{ marginBottom: '35px' }}>
        <div className="change__header">
          <div className="change__name"
          >
            时间选择
          </div>
          <TimePicker onTimeSelected={this.onTimeSelected}/>
        </div>
        <div className="change__table">
          <div className="change__title"
          >基础设施</div>
          <Table
            columns={columns}
            dataSource={this.state.infra}
            rowKey={rec=>rec.id}
            loading={this.state.loading}
            pagination={false}
          />
        </div>
        <div className="change__table">
          <div className="change__title"
          >核心应用</div>
          <Table
            columns={columns}
            dataSource={this.state.core}
            rowKey={rec => rec.id}
            loading={this.state.loading}
            pagination={false}
          />
        </div>
      </div>
    )
  }
}