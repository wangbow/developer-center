import { Component } from 'react';
import Rules from './rule-list-item';
import RuleAdd from './rule-add';
import axios from 'axios';
import {Message} from 'tinper-bee';

export default class Main extends Component {
  static defaultProps = {
    appId: '',
    domain: '',
  }

  state = {
    dataSource: [],
  }

  componentDidMount() {
    this.getRuleListApi().then((data) => {
      this.setState({
        dataSource: data,
      })
    });
  }

  getRuleListApi = ({ appId = this.props.appId } = {}) => {
    return axios.post('/iuapInsight/custom/selectCustom' + `?app_id=${appId}`)
      .then(res => res.data)
      .then(data => data.customList)
  }

  handleUpdateDataSource = () => {

  }

  handleAddRule = (param) => {
    if(this.state.dataSource.length >=10){
      return Message.create({
         content: '监控规则不能超过十条',
         color: 'danger',
         duration: 2,
      })
    }


    let query = Object.keys(param).reduce((result, key) => {
      if (key == 'custom_url') {
        return result + key + '=' + this.props.domain + param[key] + '&';
      }
      return result + key + '=' + param[key] + '&';
    }, `app_id=${this.props.appId}&`)
    return axios.post('/iuapInsight/custom/insert?' + query)
      .then(res => res.data)
      .then(res => {
        if (res.result = "success") {
          let data = [...this.state.dataSource, param]
          this.setState({
            dataSource: data,
          })
        }
      })
  }

  handleDeleteRule = (id) => {
    return axios.post(`/iuapInsight/custom / delete?custom_id=${id}`);
  }

  handleRuleUpdate = (param = {}) => {
    let query = Object.keys(param).reduce((result, key) => {
      if (key == 'custom_url') {
        return result + key + '=' + this.props.domain + param[key] + '&';
      }
      return result + key + '=' + param[key] + '&';
    }, `app_id=${this.props.appId}&`)
    return axios.post('/iuapInsight/custom/insert?' + query)
      .then(res => res.data)
      .then(data => data);
  }

  render() {
    return (
      <div className="rule-list">
        <div className="rule-list-header">
          <span className="rule-list-name" style={{ width: '20rem' }}>业务名称</span>
          <span className="rule-list-name" style={{ width: '45rem' }}>业务访问路径</span>
          <span className="rule-list-name" style={{ width: '8rem' }}>图表类型</span>
          <span className="rule-list-name" style={{ width: '7rem' }}>优先级</span>
        </div>
        {this.state.dataSource&&this.state.dataSource.map((item, key) => {
          return (
            <Rules
              dataSource={item}
              onChange={this.handleRuleUpdate}
              onDelete={this.handleDeleteRule}
            />
          )
        })}
        <RuleAdd
          onAdd={this.handleAddRule}
        ></RuleAdd>
      </div>
    )
  }
}