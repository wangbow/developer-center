import { Component } from 'react';
import { Select, Message } from 'tinper-bee';

import RuleMeta from '../rule-meta';
import './index.less';
export default class RuleAdd extends Component {
  static propTypes = {

  }
  static defaultProps = {
    onAdd: () => { },
  }
  state = {
    custom_name: '',
    custom_url: '',
    graph_type: '1',
    sort: 0,
    loading: false,
  }


  handleAddRule = () => {
    let canCreate = true;


    let keys = Object.keys(this.state);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let meta = RuleMeta[key];
      if (meta && !meta.checkFunc(this.state[key])) {
        Message.create({
          content: meta.errMsg,
          color: 'danger',
          duration: 2,
        })
        return;
      }
    }


    this.setState({ loading: true });
    let ret = this.props.onAdd(this.state);
    Promise.resolve(ret).then(res => {
      this.setState({
        custom_name: '',
        custom_url: '',
        loading: false
      });
      // TODO: tip about the operation

    })
  }

  render() {
    return (
      <div className="rule-add">
        {/* <div className="header">新增业务监控</div> */}
        <input type="text"
          onChange={(e) => {
            let val = e.target.value.trim();
            this.setState({ custom_name: val })
          }}
          value={this.state.custom_name}
          placeholder="示例: 下单"
          className="rule-add-item"
          style={{ width: '20rem' }}
        />
        <input type="text"
          placeholder="示例: /order"
          className="rule-add-item"
          style={{ width: '45rem' }}
          onChange={(e) => {
            let val = e.target.value;
            this.setState({ custom_url: val.trim() })
          }}
          value={this.state.custom_url}
        />
        <Select defaultValue="1">
          <Option value="1">曲线图</Option>
          <Option value="2">柱状图</Option>
        </Select>
        <input type="text"
          placeholder="优先级"
          className="rule-add-item"
          style={{ width: '7rem' }}
          onChange={(e) => {
            let val = e.target.value.trim();
            this.setState({ sort: ~~val })
          }}
          value={this.state.sort}
        />
        {
          this.state.loading
            ? <span className="cl cl-loading loading iconClass" />
            : <span
              className="cl cl-add-c-o iconClass"
              onClick={this.handleAddRule}
            />
        }

      </div>
    )
  }
}