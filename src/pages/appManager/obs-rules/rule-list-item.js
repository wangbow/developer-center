import { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Popconfirm } from 'tinper-bee';
import classnames from 'classnames';
import RuleMeta from './rule-meta';
import './index.less';

import ListInput from './listInput';
import Box from './box';

export default class ListItem extends Component {
  static defaultProps = {
    dataSource: {},

    onChange: () => { },// return promise
    onDelete: () => { },// return promise
  }

  constructor(props) {
    super(props);
    this.state = {
      ...props.dataSource,
      loading: false,
    }
  }

  componentWillReceiveProps(props) {
    if (props.dataSource !== this.props.dataSource) {
      this.setState({
        data: props.dataSource,
      })
    }
  }

  // FIXME: 这里有性能问题
  handleChange = (prop) => {
    return (val) => {
      this.setState({
        [prop]: val.value || val,
      })

      //掉借口
      let ret = this.props.onChange({ ...this.state, [prop]: val });
      if (ret && ret.then) {
        ret.then(res => {
          if (res === false) {
            this.setState({
              ...this.props.dataSource,
            })
          }
        })
          .catch(() => {
            this.setState({
              ...this.props.dataSource,
            })
          })
      } else if (ret === false) {
        this.setState({
          ...this.props.dataSource,
        })
      }
      return ret;
    }
  }

  handleDeleteRule = () => {
    this.setState({
      loading: true,
    })

    let ret = this.props.onDelete(this.state.custom_id);
    Promise.resolve(ret).then(result => {
      if (result === false) {
        // TODO: 谁来处理失败提示， 我觉得是这里

      }
      this.refs.ruleBody.style.display = "none";
    })
  }

  render() {
    return (
      <div ref="ruleBody">

        <div className="list-c">
          <Box
            style={{ width: '20rem' }}
            inputClass="editor"
            value={this.state.custom_name}
            onChange={this.handleChange('custom_name')}
            changeValidation={RuleMeta.custom_name.checkFunc}
            errMsg={RuleMeta.custom_name.errMsg}
          />
          <Box
            style={{ width: '45rem' }}
            inputClass="editor editor-large"
            value={this.state.custom_url}
            onChange={this.handleChange('custom_url')}
            changeValidation={RuleMeta.custom_url.checkFunc}
            errMsg={RuleMeta.custom_url.errMsg}
          />
          <Box
            style={{ width: '8rem' }}
            inputClass="editor"
            value={this.state.graph_type}
            onChange={this.handleChange('graph_type')}
            popData={[
              { name: '曲线图', value: '1' },
              { name: '柱状图', value: '2' }
            ]}
          />
          <Box
            style={{ width: '7rem' }}
            inputClass="editor"
            value={this.state.sort + ''}
            onChange={this.handleChange('sort')}
            changeValidation={RuleMeta.sort.checkFunc}
            errMsg={RuleMeta.sort.errMsg}
          />

          <Popconfirm
            trigger="click"
            content="确认删除吗？"
            placement="bottom"
            onClose={this.handleDeleteRule}
            rootClose
          >
            {
              this.state.loading
                ? <span className="cl cl-loading iconClass" />
                : <span className="cl cl-delete iconClass" />
            }
          </Popconfirm>
        </div>
      </div>
    )
  }
}


